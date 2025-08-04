// Configuration types pour l'environnement WebSocket
export interface WebSocketConfig {
  host: string;
  protocol: "ws" | "wss";
  path: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  authToken?: string;
}

export interface EnvironmentConfig {
  websocket: WebSocketConfig;
  api: {
    baseUrl: string;
    token?: string;
  };
  features: {
    enableTypingIndicators: boolean;
    enableReadReceipts: boolean;
    enablePushNotifications: boolean;
    maxMessageLength: number;
    fileUploadMaxSize: number;
  };
}

// Configuration par défaut pour le développement
const defaultConfig: EnvironmentConfig = {
  websocket: {
    host: process.env.NEXT_PUBLIC_WS_HOST || "localhost:8000",
    protocol: (process.env.NEXT_PUBLIC_WS_PROTOCOL as "ws" | "wss") || "ws",
    path: "/ws/chat/",
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    authToken: process.env.NEXT_PUBLIC_API_TOKEN,
  },
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
    token: process.env.NEXT_PUBLIC_API_TOKEN,
  },
  features: {
    enableTypingIndicators: true,
    enableReadReceipts: true,
    enablePushNotifications: false,
    maxMessageLength: 2000,
    fileUploadMaxSize: 10 * 1024 * 1024, // 10MB
  },
};

// Configuration pour la production
const productionConfig: Partial<EnvironmentConfig> = {
  websocket: {
    ...defaultConfig.websocket,
    protocol: "wss",
    host: process.env.NEXT_PUBLIC_WS_HOST || "backend-dreametrix.com",
  },
  features: {
    ...defaultConfig.features,
    enablePushNotifications: true,
  },
};

// Configuration finale basée sur l'environnement
export const config: EnvironmentConfig = {
  ...defaultConfig,
  ...(process.env.NODE_ENV === "production" ? productionConfig : {}),
};

// Helper pour construire l'URL WebSocket complète
export const getWebSocketUrl = (): string => {
  const { protocol, host, path } = config.websocket;
  return `${protocol}://${host}${path}`;
};

// Helper pour vérifier si une fonctionnalité est activée
export const isFeatureEnabled = (
  feature: keyof EnvironmentConfig["features"]
): boolean => {
  return config.features[feature] as boolean;
};

// Validation de la configuration
export const validateConfig = (): boolean => {
  const requiredEnvVars = ["NEXT_PUBLIC_WS_HOST", "NEXT_PUBLIC_API_BASE_URL"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("Variables d'environnement manquantes:", missingVars);
    return false;
  }

  return true;
};

// Types pour l'authentification WebSocket
export interface WebSocketAuth {
  user_id: number;
  token: string;
  role: "teacher" | "student" | "parent" | "school_admin" | "super_admin";
}

// Configuration des salles de chat par rôle
export const chatRoomPermissions = {
  teacher: {
    canCreateRooms: true,
    canDeleteMessages: true,
    canModerateChat: true,
    canInviteUsers: true,
  },
  student: {
    canCreateRooms: false,
    canDeleteMessages: false,
    canModerateChat: false,
    canInviteUsers: false,
  },
  parent: {
    canCreateRooms: false,
    canDeleteMessages: false,
    canModerateChat: false,
    canInviteUsers: false,
  },
  school_admin: {
    canCreateRooms: true,
    canDeleteMessages: true,
    canModerateChat: true,
    canInviteUsers: true,
  },
  super_admin: {
    canCreateRooms: true,
    canDeleteMessages: true,
    canModerateChat: true,
    canInviteUsers: true,
  },
} as const;

export type UserRole = keyof typeof chatRoomPermissions;
export type RoomPermissions = (typeof chatRoomPermissions)[UserRole];
