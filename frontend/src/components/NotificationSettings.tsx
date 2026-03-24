import React, { useEffect, useState } from 'react';
import notificationService from '../services/notification.service';
import '../styles/NotificationSettings.css';

const NotificationSettings: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setPermission('granted');
      setIsEnabled(true);
      
      // Show test notification
      await notificationService.showNotification('Notifications Enabled!', {
        body: 'You will now receive updates about your orders and products.',
        icon: '/icons/icon-192x192.png',
        tag: 'notification-enabled',
      });
    } else {
      setPermission(Notification.permission);
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  if (permission === 'denied') {
    return (
      <div className="notification-settings denied">
        <div className="notification-icon">🔕</div>
        <div className="notification-text">
          <h4>Notifications Blocked</h4>
          <p>Please enable notifications in your browser settings</p>
        </div>
      </div>
    );
  }

  if (isEnabled) {
    return (
      <div className="notification-settings enabled">
        <div className="notification-icon">🔔</div>
        <div className="notification-text">
          <h4>Notifications Enabled</h4>
          <p>You'll receive updates about orders and products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="notification-icon">🔔</div>
      <div className="notification-text">
        <h4>Enable Notifications</h4>
        <p>Get updates about your orders and new products</p>
      </div>
      <button onClick={handleEnableNotifications} className="enable-btn">
        Enable
      </button>
    </div>
  );
};

export default NotificationSettings;
