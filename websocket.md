# Architecture Backend (Spécifications)

### 🐍 Stack Technique

- **Framework:** Django + Django Channels
- **WebSocket:** Django Channels avec Redis
- **Base de données:** PostgreSQL
- **Cache:** Redis
- **ASGI:** Uvicorn/Daphne

### 📋 Modèles de Données

#### ChatRoom

```python
class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    is_group = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    
    class Meta:
        db_table = 'chat_rooms'
```

#### ChatMessage

```python
class ChatMessage(models.Model):
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    message_type = models.CharField(max_length=50, default='text')
    status = models.CharField(max_length=20, default='sent')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['-created_at']
```

### 🔌 WebSocket Consumer

```python
# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
            return
            
        self.user_group_name = f"user_{self.user.id}"
        
        # Join user group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Notify user is online
        await self.channel_layer.group_send(
            self.user_group_name,
            {
                'type': 'user_status',
                'user_id': self.user.id,
                'status': 'online'
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
        
        # Notify user is offline
        if hasattr(self, 'user') and not self.user.is_anonymous:
            await self.channel_layer.group_send(
                f"user_{self.user.id}",
                {
                    'type': 'user_status',
                    'user_id': self.user.id,
                    'status': 'offline'
                }
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'join_room':
                await self.join_room(data)
            elif message_type == 'leave_room':
                await self.leave_room(data)
            elif message_type == 'send_message':
                await self.send_message(data)
            elif message_type == 'typing_start':
                await self.typing_start(data)
            elif message_type == 'typing_stop':
                await self.typing_stop(data)
            elif message_type == 'heartbeat':
                await self.heartbeat()
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))

    async def join_room(self, data):
        room_id = data['room_id']
        self.current_room = f"room_{room_id}"
        
        # Join room group
        await self.channel_layer.group_add(
            self.current_room,
            self.channel_name
        )
        
        await self.send(text_data=json.dumps({
            'type': 'room_joined',
            'room_id': room_id
        }))

    async def send_message(self, data):
        room_id = data['room_id']
        content = data['content']
        
        # Save message to database
        message = await self.save_message(room_id, content)
        
        # Send to room group
        await self.channel_layer.group_send(
            f"room_{room_id}",
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'content': message.content,
                    'sender_info': {
                        'id': message.sender.id,
                        'name': f"{message.sender.first_name} {message.sender.last_name}",
                        'role': getattr(message.sender, 'role', 'user')
                    },
                    'created_at': message.created_at.isoformat(),
                    'status': message.status
                }
            }
        )

    async def typing_start(self, data):
        room_id = data['room_id']
        
        await self.channel_layer.group_send(
            f"room_{room_id}",
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'user_name': f"{self.user.first_name} {self.user.last_name}",
                'room_id': room_id,
                'is_typing': True
            }
        )

    # Message handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'data': event['message']
        }))

    async def typing_indicator(self, event):
        if event['user_id'] != self.user.id:  # Don't send back to sender
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'data': {
                    'user_id': event['user_id'],
                    'user_name': event['user_name'],
                    'room_id': event['room_id'],
                    'is_typing': event['is_typing']
                }
            }))

    @database_sync_to_async
    def save_message(self, room_id, content):
        from .models import ChatRoom, ChatMessage
        
        room = ChatRoom.objects.get(id=room_id)
        message = ChatMessage.objects.create(
            room=room,
            sender=self.user,
            content=content
        )
        return message
```

### 🌐 URLs et Routing

#### WebSocket Routing

```python
# chat/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
]
```

#### ASGI Configuration

```python
# asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dreametrix.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        )
    ),
})
```

### ⚙️ Configuration Django

#### Settings

```python
# settings.py
INSTALLED_APPS = [
    'daphne',  # Doit être en premier
    'django.contrib.admin',
    'django.contrib.auth',
    # ... autres apps
    'channels',
    'channels_redis',
    'chat',
]

ASGI_APPLICATION = 'dreametrix.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# WebSocket
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'your-domain.com']

# CORS pour WebSocket
CORS_ALLOW_ALL_ORIGINS = True  # Pour dev seulement
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-frontend-domain.com",
]
```

### 🚀 Installation et Déploiement

#### Dépendances Backend

```bash
pip install django
pip install channels
pip install channels-redis
pip install redis
pip install daphne
pip install uvicorn
```

#### Configuration Redis

```bash
# Installation Redis
sudo apt-get install redis-server

# Démarrage Redis
redis-server

# Test Redis
redis-cli ping
```

#### Démarrage du serveur

```bash
# Développement
python manage.py runserver

# Production avec Daphne
daphne -b 0.0.0.0 -p 8000 dreametrix.asgi:application

# Ou avec Uvicorn
uvicorn dreametrix.asgi:application --host 0.0.0.0 --port 8000
```

#### Configuration Nginx (Production)

```nginx
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        try_files $uri @proxy_to_app;
    }

    location @proxy_to_app {
        proxy_pass http://django;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /ws/ {
        proxy_pass http://django;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
