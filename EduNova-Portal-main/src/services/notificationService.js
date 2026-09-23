export const getNotifications = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const stored = localStorage.getItem('edunova_notifications');
  return stored ? JSON.parse(stored) : [];
};

export const markNotificationRead = async (id) => {
  const notifs = await getNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem('edunova_notifications', JSON.stringify(updated));
  return updated;
};
