export function notifyDesktop(title, body) {
  if (!('Notification' in window)) return;

  const show = () => {
    try {
      new Notification(title, { body });
    } catch {
      // Notifications are a desktop nicety; never block the workflow.
    }
  };

  if (Notification.permission === 'granted') {
    show();
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') show();
    });
  }
}
