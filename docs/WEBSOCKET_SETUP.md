# Configuration WebSocket pour le Chat Temps Réel

## Variables d'Environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# WebSocket Configuration
NEXT_PUBLIC_WS_HOST=localhost:8000
NEXT_PUBLIC_WS_PROTOCOL=ws
NEXT_PUBLIC_API_TOKEN=your_api_token_here

# Pour la production, utilisez wss:
# NEXT_PUBLIC_WS_PROTOCOL=wss
# NEXT_PUBLIC_WS_HOST=backend-dreametrix.com
```

## Configuration Serveur WebSocket

Le serveur WebSocket Django doit être configuré pour gérer les événements suivants :

### Événements Entrants (Client → Serveur)

```json
{
  "type": "auth",
  "data": { "user_id": 123 },
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "join_room",
  "data": { "room_id": 456 },
  "room_id": 456,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "leave_room", 
  "data": { "room_id": 456 },
  "room_id": 456,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "message",
  "data": { "room_id": 456, "content": "Hello world!" },
  "room_id": 456,
  "user_id": 123,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "typing",
  "data": { "room_id": 456, "is_typing": true },
  "room_id": 456,
  "user_id": 123,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "user_status",
  "data": { "status": "online" },
  "user_id": 123,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "ping",
  "data": {},
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Événements Sortants (Serveur → Client)

```json
{
  "type": "message",
  "data": {
    "id": 789,
    "content": "Hello world!",
    "sender": 123,
    "chat": 456,
    "created_at": "2024-01-15T10:00:00Z",
    "sender_info": {
      "id": 123,
      "name": "John Doe",
      "role": "teacher",
      "avatar": "/path/to/avatar.jpg"
    }
  },
  "room_id": 456,
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "typing",
  "data": {
    "room_id": 456,
    "user_id": 123,
    "user_name": "John Doe",
    "is_typing": true
  },
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "user_status",
  "data": {
    "user_id": 123,
    "status": "online",
    "last_seen": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "error",
  "data": { "error": "Invalid room ID" },
  "timestamp": "2024-01-15T10:00:00Z"
}

{
  "type": "pong",
  "data": {},
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Architecture Django Channels

### consumers.py

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, ChatMessage
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
        else:
            await self.accept()
            
    async def disconnect(self, close_code):
        # Quitter tous les groupes
        for room_id in getattr(self, 'joined_rooms', []):
            await self.channel_layer.group_discard(
                f"chat_{room_id}",
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data['type']
        
        if message_type == 'join_room':
            await self.join_room(data)
        elif message_type == 'leave_room':
            await self.leave_room(data)
        elif message_type == 'message':
            await self.chat_message(data)
        elif message_type == 'typing':
            await self.typing_indicator(data)
        elif message_type == 'ping':
            await self.send_pong()
            
    async def join_room(self, event):
        room_id = event['data']['room_id']
        await self.channel_layer.group_add(
            f"chat_{room_id}",
            self.channel_name
        )
        
    async def chat_message(self, event):
        # Sauvegarder en base et diffuser
        message = await self.save_message(event['data'])
        await self.channel_layer.group_send(
            f"chat_{event['room_id']}",
            {
                'type': 'send_message',
                'message': message
            }
        )
```

### routing.py

```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
]
```

### settings.py

```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Ajout de channels dans INSTALLED_APPS
INSTALLED_APPS = [
    'channels',
    # ... autres apps
]

# Configuration ASGI
ASGI_APPLICATION = 'myproject.asgi.application'
```

## Déploiement

### Docker

```dockerfile
# Dockerfile pour le serveur WebSocket
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Installer Redis pour les channels
RUN apt-get update && apt-get install -y redis-server

EXPOSE 8000

CMD ["daphne", "-p", "8000", "-b", "0.0.0.0", "myproject.asgi:application"]
```

### Nginx Configuration

```nginx
upstream websocket {
    server 127.0.0.1:8000;
}

server {
    location /ws/ {
        proxy_pass http://websocket;
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

## Test Local

1. **Démarrer le serveur Django avec Channels** :
   ```bash
   pip install channels channels-redis
   python manage.py runserver
   ```

2. **Démarrer Redis** :
   ```bash
   redis-server
   ```

3. **Tester la connexion WebSocket** :
   ```javascript
   const ws = new WebSocket('ws://localhost:8000/ws/chat/');
   ws.onopen = () => console.log('Connected');
   ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
   ```

## Monitoring et Logs

- Utiliser `console.log` côté client pour déboguer
- Côté serveur Django, utiliser `logging` pour tracer les événements
- Surveiller les connexions Redis avec `redis-cli monitor`
- Utiliser des outils comme Sentry pour le monitoring en production
