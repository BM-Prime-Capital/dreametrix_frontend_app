Documentation API - Section ChatCette section détaille les endpoints et les opérations disponibles pour la gestion des messages et des salons de discussion ("chat").1. Messages de Chat (/chats/messages/)Endpoint: /chats/messages/Description: Gère la liste et la création des messages de chat.GETOpération ID: chats_messages_listDescription: Permet de lister tous les messages de chat ou de filtrer par salon de discussion.Requête (Paramètres de Query):limit: (Optionnel) integer. Nombre de résultats à retourner par page.offset: (Optionnel) integer. L'index initial à partir duquel retourner les résultats.Réponses (Codes HTTP):200 OK: Retourne un objet contenant le nombre total de résultats (count), les liens vers les pages suivantes et précédentes (next, previous), et une liste d'objets ChatMessage (results).Exemple de Structure de Réponse (schéma):{
    "count": 0,
    "next": "string($uri)",
    "previous": "string($uri)",
    "results": [
        {
            "id": 0,
            "content": "string",
            "is_deleted": false,
            "uuid": "string($uuid)",
            "created_at": "string($date-time)",
            "last_update": "string($date-time)",
            "extra_data": {},
            "school": 0,
            "chat": 0,
            "sender": 0
        }
    ]
}
POSTOpération ID: chats_messages_createDescription: Permet de créer un nouveau message de chat.Requête (Corps de la Requête - application/json):data: Objet ChatMessage (obligatoire).Exemple de Structure de Requête (schéma):{
    "content": "string",
    "is_deleted": false,
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
Réponses (Codes HTTP):201 Created: Retourne l'objet ChatMessage créé.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "content": "string",
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
Endpoint: /chats/messages/create/Description: Une méthode pour ajouter/créer un nouveau message de chat.POSTOpération ID: chats_messages_create_chat_messageDescription: Ajouter/créer un nouveau message de chat.Requête (Corps de la Requête - application/json):data: Objet CreateChatMessage (obligatoire).Exemple de Structure de Requête (schéma):{
    "chat_room_id": "string",
    "content": "string"
}
Réponses (Codes HTTP):201 Created: Retourne l'objet CreateChatMessage créé.Exemple de Structure de Réponse (schéma):{
    "chat_room_id": "string",
    "content": "string"
}
Endpoint: /chats/messages/{id}/Description: Gère les opérations individuelles sur un message de chat spécifique. {id} doit être remplacé par l'ID numérique du message.GETOpération ID: chats_messages_readDescription: Lire les détails d'un message de chat spécifique.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du message de chat.Réponses (Codes HTTP):200 OK: Retourne l'objet ChatMessage correspondant à l'ID.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "content": "string",
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
PUTOpération ID: chats_messages_updateDescription: Met à jour entièrement un message de chat existant.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du message de chat à mettre à jour.Requête (Corps de la Requête - application/json):data: Objet ChatMessage (obligatoire). Les nouvelles données complètes du message.Exemple de Structure de Requête (schéma):{
    "content": "string",
    "is_deleted": false,
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
Réponses (Codes HTTP):200 OK: Retourne l'objet ChatMessage mis à jour.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "content": "string",
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
PATCHOpération ID: chats_messages_partial_updateDescription: Met à jour partiellement un message de chat existant.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du message de chat à mettre à jour.Requête (Corps de la Requête - application/json):data: Objet ChatMessage (obligatoire). Les champs à mettre à jour.Exemple de Structure de Requête (schéma): (Peut inclure un sous-ensemble des champs de ChatMessage){
    "content": "string"
}
Réponses (Codes HTTP):200 OK: Retourne l'objet ChatMessage mis à jour.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "content": "string",
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {},
    "school": 0,
    "chat": 0,
    "sender": 0
}
DELETEOpération ID: chats_messages_deleteDescription: Supprime un message de chat spécifique.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du message de chat à supprimer.Réponses (Codes HTTP):204 No Content: Indique que la suppression a été réussie et qu'il n'y a pas de contenu à retourner.2. Salons de Discussion (/chats/rooms/)Endpoint: /chats/rooms/Description: Gère la liste et la création des salons de discussion.GETOpération ID: chats_rooms_listDescription: Permet de lister tous les salons de discussion.Requête (Paramètres de Query):name: (Optionnel) string. Filtre par nom du salon.school: (Optionnel) string. Filtre par école.details: (Optionnel) string. Filtre par détails du salon.limit: (Optionnel) integer. Nombre de résultats à retourner par page.offset: (Optionnel) integer. L'index initial à partir duquel retourner les résultats.Réponses (Codes HTTP):200 OK: Retourne un objet contenant le nombre total de résultats (count), les liens vers les pages suivantes et précédentes (next, previous), et une liste d'objets ChatRoom (results).Exemple de Structure de Réponse (schéma):{
    "count": 0,
    "next": "string($uri)",
    "previous": "string($uri)",
    "results": [
        {
            "id": 0,
            "school": "string",
            "name": "string",
            "details": "string",
            "is_group": false,
            "is_deleted": false,
            "uuid": "string($uuid)",
            "created_at": "string($date-time)",
            "last_update": "string($date-time)",
            "extra_data": {}
        }
    ]
}
POSTOpération ID: chats_rooms_createDescription: Permet de créer un nouveau salon de discussion.Requête (Corps de la Requête - multipart/form-data ou application/x-www-form-urlencoded):name: (Optionnel) string. Longueur maximale: 255. Nom du chat.details: (Optionnel) string. Plus de détails sur le chat.is_group: (Optionnel) boolean. Indique si le salon est un groupe.is_deleted: (Optionnel) boolean. Indique si le salon est supprimé.extra_data: (Optionnel) string. Données supplémentaires au format JSON.Réponses (Codes HTTP):201 Created: Retourne l'objet ChatRoom créé.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "school": "string",
    "name": "string",
    "details": "string",
    "is_group": false,
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {}
}
Endpoint: /chats/rooms/create/Description: Une méthode pour ajouter/créer un nouveau salon de discussion.POSTOpération ID: chats_rooms_create_chat_roomDescription: Ajouter/créer un nouveau salon de discussion.Requête (Corps de la Requête - multipart/form-data ou application/x-www-form-urlencoded):name: (Optionnel) string. Longueur minimale: 1. Nom du salon.Réponses (Codes HTTP):201 Created: Retourne l'objet CreateChatRoom créé.Exemple de Structure de Réponse (schéma):{
    "name": "string"
}
Endpoint: /chats/rooms/{id}/Description: Gère les opérations individuelles sur un salon de discussion spécifique. {id} doit être remplacé par l'ID numérique du salon.GETOpération ID: chats_rooms_readDescription: Lire les détails d'un salon de discussion spécifique.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du salon de discussion.Réponses (Codes HTTP):200 OK: Retourne l'objet ChatRoomDetail correspondant à l'ID.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "school": "string",
    "messages": "string",
    "name": "string",
    "details": "string",
    "is_group": false,
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {}
}
PUTOpération ID: chats_rooms_updateDescription: Met à jour entièrement un salon de discussion existant.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du salon de discussion à mettre à jour.Requête (Corps de la Requête - multipart/form-data ou application/x-www-form-urlencoded):name: (Optionnel) string. Longueur maximale: 255. Nom du chat.details: (Optionnel) string. Plus de détails sur le chat.is_group: (Optionnel) boolean. Indique si le salon est un groupe.is_deleted: (Optionnel) boolean. Indique si le salon est supprimé.extra_data: (Optionnel) string. Données supplémentaires au format JSON.Réponses (Codes HTTP):200 OK: Retourne l'objet ChatRoom mis à jour.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "school": "string",
    "name": "string",
    "details": "string",
    "is_group": false,
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {}
}
PATCHOpération ID: chats_rooms_partial_updateDescription: Met à jour partiellement un salon de discussion existant.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du salon de discussion à mettre à jour.Requête (Corps de la Requête - multipart/form-data ou application/x-www-form-urlencoded):name: (Optionnel) string. Longueur maximale: 255. Nom du chat.details: (Optionnel) string. Plus de détails sur le chat.is_group: (Optionnel) boolean. Indique si le salon est un groupe.is_deleted: (Optionnel) boolean. Indique si le salon est supprimé.extra_data: (Optionnel) string. Données supplémentaires au format JSON.Réponses (Codes HTTP):200 OK: Retourne l'objet ChatRoom mis à jour.Exemple de Structure de Réponse (schéma):{
    "id": 0,
    "school": "string",
    "name": "string",
    "details": "string",
    "is_group": false,
    "is_deleted": false,
    "uuid": "string($uuid)",
    "created_at": "string($date-time)",
    "last_update": "string($date-time)",
    "extra_data": {}
}
DELETEOpération ID: chats_rooms_deleteDescription: Supprime un salon de discussion spécifique.Requête (Paramètres de Chemin):id: Entier (obligatoire). L'ID unique du salon de discussion à supprimer.Réponses (Codes HTTP):204 No Content: Indique que la suppression a été réussie et qu'il n'y a pas de contenu à retourner.