import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Wifi, WifiOff, Volume2, VolumeX } from "lucide-react";
import { useWebSocketNotifications } from "@/utils/websocket-notifications";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";

interface WebSocketSettingsProps {
  userId: number;
}

export const WebSocketSettings: React.FC<WebSocketSettingsProps> = ({
  userId,
}) => {
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: false,
    soundNotifications: true,
    mentionNotifications: true,
    messageNotifications: true,
    systemNotifications: true,
  });

  const [connectionSettings, setConnectionSettings] = useState({
    autoReconnect: true,
    showTypingIndicators: true,
    showOnlineStatus: true,
  });

  const { requestPermission, getPermissions } = useWebSocketNotifications();
  const { isConnected, reconnect, disconnect } = useChatWebSocket(userId);

  // Charger les paramètres depuis le localStorage
  useEffect(() => {
    const savedNotificationSettings = localStorage.getItem(
      "websocket-notification-settings"
    );
    const savedConnectionSettings = localStorage.getItem(
      "websocket-connection-settings"
    );

    if (savedNotificationSettings) {
      try {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      } catch (error) {
        console.error(
          "Erreur lors du chargement des paramètres de notification:",
          error
        );
      }
    }

    if (savedConnectionSettings) {
      try {
        setConnectionSettings(JSON.parse(savedConnectionSettings));
      } catch (error) {
        console.error(
          "Erreur lors du chargement des paramètres de connexion:",
          error
        );
      }
    }
  }, []);

  // Sauvegarder les paramètres dans le localStorage
  const saveNotificationSettings = (
    newSettings: typeof notificationSettings
  ) => {
    setNotificationSettings(newSettings);
    localStorage.setItem(
      "websocket-notification-settings",
      JSON.stringify(newSettings)
    );
  };

  const saveConnectionSettings = (newSettings: typeof connectionSettings) => {
    setConnectionSettings(newSettings);
    localStorage.setItem(
      "websocket-connection-settings",
      JSON.stringify(newSettings)
    );
  };

  // Gérer l'activation des notifications push
  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermission();
      if (granted) {
        saveNotificationSettings({
          ...notificationSettings,
          pushNotifications: true,
        });
      } else {
        // Afficher un message d'erreur
        alert(
          "Les permissions de notification ont été refusées. Vous pouvez les activer dans les paramètres de votre navigateur."
        );
      }
    } else {
      saveNotificationSettings({
        ...notificationSettings,
        pushNotifications: false,
      });
    }
  };

  // Tester les notifications
  const testNotification = () => {
    if (notificationSettings.pushNotifications) {
      const testNotification = new Notification("Test Dreametrix", {
        body: "Vos notifications fonctionnent correctement !",
        icon: "/favicon.ico",
      });

      setTimeout(() => {
        testNotification.close();
      }, 3000);
    } else {
      alert("Activez d'abord les notifications push pour tester.");
    }
  };

  // Vérifier le statut des permissions
  const permissions = getPermissions();

  return (
    <div className="space-y-6">
      {/* Paramètres de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configurez comment vous souhaitez être notifié des nouveaux messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Notifications push</label>
              <p className="text-xs text-muted-foreground">
                Recevoir des notifications même quand l'onglet n'est pas actif
              </p>
            </div>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={handlePushNotificationToggle}
              disabled={permissions.denied}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Sons de notification
              </label>
              <p className="text-xs text-muted-foreground">
                Jouer un son lors de nouveaux messages
              </p>
            </div>
            <Switch
              checked={notificationSettings.soundNotifications}
              onCheckedChange={(checked) =>
                saveNotificationSettings({
                  ...notificationSettings,
                  soundNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Mentions</label>
              <p className="text-xs text-muted-foreground">
                Notifications spéciales quand vous êtes mentionné
              </p>
            </div>
            <Switch
              checked={notificationSettings.mentionNotifications}
              onCheckedChange={(checked) =>
                saveNotificationSettings({
                  ...notificationSettings,
                  mentionNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Messages directs</label>
              <p className="text-xs text-muted-foreground">
                Notifications pour tous les nouveaux messages
              </p>
            </div>
            <Switch
              checked={notificationSettings.messageNotifications}
              onCheckedChange={(checked) =>
                saveNotificationSettings({
                  ...notificationSettings,
                  messageNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Messages système</label>
              <p className="text-xs text-muted-foreground">
                Notifications pour les événements système
              </p>
            </div>
            <Switch
              checked={notificationSettings.systemNotifications}
              onCheckedChange={(checked) =>
                saveNotificationSettings({
                  ...notificationSettings,
                  systemNotifications: checked,
                })
              }
            />
          </div>

          {permissions.denied && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Les notifications ont été bloquées dans votre navigateur. Vous
                pouvez les réactiver dans les paramètres de votre navigateur.
              </p>
            </div>
          )}

          <Button
            onClick={testNotification}
            variant="outline"
            size="sm"
            disabled={!notificationSettings.pushNotifications}
          >
            Tester les notifications
          </Button>
        </CardContent>
      </Card>

      {/* Paramètres de connexion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connexion WebSocket
          </CardTitle>
          <CardDescription>Gérez votre connexion en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Statut de connexion</label>
              <p className="text-xs text-muted-foreground">
                {isConnected ? "Connecté" : "Déconnecté"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Button
                onClick={isConnected ? disconnect : reconnect}
                variant="outline"
                size="sm"
              >
                {isConnected ? "Déconnecter" : "Reconnecter"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Reconnexion automatique
              </label>
              <p className="text-xs text-muted-foreground">
                Se reconnecter automatiquement en cas de perte de connexion
              </p>
            </div>
            <Switch
              checked={connectionSettings.autoReconnect}
              onCheckedChange={(checked) =>
                saveConnectionSettings({
                  ...connectionSettings,
                  autoReconnect: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Indicateurs de frappe
              </label>
              <p className="text-xs text-muted-foreground">
                Voir quand les autres utilisateurs sont en train d'écrire
              </p>
            </div>
            <Switch
              checked={connectionSettings.showTypingIndicators}
              onCheckedChange={(checked) =>
                saveConnectionSettings({
                  ...connectionSettings,
                  showTypingIndicators: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Statut en ligne</label>
              <p className="text-xs text-muted-foreground">
                Afficher votre statut en ligne aux autres utilisateurs
              </p>
            </div>
            <Switch
              checked={connectionSettings.showOnlineStatus}
              onCheckedChange={(checked) =>
                saveConnectionSettings({
                  ...connectionSettings,
                  showOnlineStatus: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations de débogage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informations de débogage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1 font-mono bg-gray-50 p-3 rounded">
            <div>Connexion: {isConnected ? "active" : "inactive"}</div>
            <div>
              Permissions:{" "}
              {permissions.granted
                ? "accordées"
                : permissions.denied
                ? "refusées"
                : "par défaut"}
            </div>
            <div>User ID: {userId}</div>
            <div>Timestamp: {new Date().toISOString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
