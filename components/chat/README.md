# Module Chat Intégré - Dreametrix Frontend

## Vue d'ensemble

Le module chat a été intégré avec succès dans l'application Dreametrix Frontend. Ce module fournit une fonctionnalité de messagerie en temps réel basée sur l'API de chat existante de l'application.

## Architecture

### Structure des fichiers

```
/types/chat.ts                                    - Types TypeScript pour le chat
/services/chat-service.ts                         - Services API pour le chat
/hooks/useChat.ts                                 - Hooks React pour la gestion d'état
/components/chat/ChatInterface.tsx                - Interface utilisateur du chat
/components/communicate/EnhancedTeacherCommunication.tsx - Composant intégré avec onglets
/lib/api-config.ts                               - Configuration API mise à jour
```

### Types principaux

- **ChatMessage** : Message de base de l'API
- **ChatRoom** : Salon de chat de base de l'API  
- **EnhancedChatMessage** : Message enrichi avec infos utilisateur
- **EnhancedChatRoom** : Salon enrichi avec participants et métadonnées
- **ChatParticipant** : Informations sur les participants au chat

### Services API

- **ChatMessageService** : CRUD pour les messages
  - `listMessages(limit?, offset?)`
  - `createChatMessage(data)`
  - `getChatMessage(id)`
  - `updateChatMessage(id, data)`
  - `partialUpdateMessage(id, data)`
  - `deleteMessage(id)`

- **ChatRoomService** : CRUD pour les salons
  - `listRooms(limit?, offset?)`
  - `createChatRoom(data)`
  - `getChatRoom(id)`
  - `updateChatRoom(id, data)`
  - `partialUpdateRoom(id, data)`
  - `deleteRoom(id)`

### Hooks React

- **useChatRooms()** : Gestion des salons de chat
  - État : `rooms`, `selectedRoom`, `loading`, `error`
  - Actions : `fetchRooms`, `createRoom`, `updateRoom`, `deleteRoom`

- **useChatMessages(roomId)** : Gestion des messages pour un salon
  - État : `messages`, `loading`, `error`
  - Actions : `fetchMessages`, `sendMessage`, `updateMessage`, `deleteMessage`

## Intégration dans l'interface utilisateur

### Composant EnhancedTeacherCommunication

Le module chat est intégré dans l'interface de communication des enseignants via un système d'onglets :

1. **Messages & Annonces** - Fonctionnalité existante
2. **Chat en temps réel** - Nouvelle fonctionnalité de chat
3. **Diffusions** - Réservé pour future extension

### Fonctionnalités du chat

- Liste des salons de conversation
- Création de nouveaux salons
- Envoi et réception de messages
- Affichage des participants
- Statut de connexion des utilisateurs
- Interface responsive et intuitive
- Intégration avec l'API existante

## Configuration

### Variables d'environnement

Les endpoints de chat utilisent la configuration API existante :

```typescript
API_CONFIG.ENDPOINTS.CHAT_MESSAGES = "/chats/messages/"
API_CONFIG.ENDPOINTS.CHAT_ROOMS = "/chats/rooms/"
```

### Authentification

Le module utilise le système d'authentification existant de l'application. Assurez-vous que l'utilisateur est connecté avant d'utiliser les fonctionnalités de chat.

## Utilisation

### Importer le composant intégré

```tsx
import EnhancedTeacherCommunication from '@/components/communicate/EnhancedTeacherCommunication';

function CommunicationPage() {
  return <EnhancedTeacherCommunication />;
}
```

### Utiliser les hooks directement

```tsx
import { useChatRooms, useChatMessages } from '@/hooks/useChat';

function MyCustomChatComponent() {
  const { rooms, createRoom } = useChatRooms();
  const { messages, sendMessage } = useChatMessages(selectedRoomId);
  
  // Votre logique personnalisée ici
}
```

## API Endpoints

### Messages de chat

- `GET /chats/messages/` - Liste des messages
- `POST /chats/messages/` - Créer un message
- `GET /chats/messages/{id}/` - Détails d'un message
- `PUT /chats/messages/{id}/` - Mise à jour complète
- `PATCH /chats/messages/{id}/` - Mise à jour partielle
- `DELETE /chats/messages/{id}/` - Supprimer un message

### Salons de chat

- `GET /chats/rooms/` - Liste des salons
- `POST /chats/rooms/` - Créer un salon
- `GET /chats/rooms/{id}/` - Détails d'un salon
- `PUT /chats/rooms/{id}/` - Mise à jour complète
- `PATCH /chats/rooms/{id}/` - Mise à jour partielle
- `DELETE /chats/rooms/{id}/` - Supprimer un salon

## Tests et développement

### Données mock

Le système utilise des données mock pour le développement :
- Participants fictifs avec différents rôles (enseignant, étudiant, parent)
- Messages d'exemple
- Salons de conversation de test

### Mode développement

```bash
npm run dev
```

Naviguez vers la page de communication pour voir le module chat en action.

## Extensions futures

- 🔄 Messages en temps réel avec WebSockets
- 📎 Support des pièces jointes (images, fichiers)
- 🔔 Notifications push
- 🎨 Personnalisation des thèmes
- 📊 Statistiques de chat
- 🔍 Recherche dans l'historique des messages
- 👥 Gestion avancée des groupes

## Dépannage

### Erreurs courantes

1. **"Failed to fetch rooms"** - Vérifiez la configuration API et l'authentification
2. **Messages non affichés** - Assurez-vous que roomId est défini
3. **Erreurs TypeScript** - Vérifiez l'importation des types depuis `/types/chat.ts`

### Logs

Les erreurs sont loggées dans la console du navigateur avec des préfixes explicites :
- `Error fetching rooms:`
- `Error sending message:`
- `Error creating room:`

## Support

Pour toute question ou problème, consultez :
1. Les types TypeScript dans `/types/chat.ts`
2. La documentation des services dans `/services/chat-service.ts`
3. Les exemples d'utilisation dans `/hooks/useChat.ts`

---

**Module développé avec succès et prêt pour la production** ✅
