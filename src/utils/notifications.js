export const showNotification = (message, type = 'success') => {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach(notification => notification.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification-toast fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  } text-white transform transition-all duration-300 ease-in-out translate-x-full`;
  
  notification.textContent = message;
  document.body.appendChild(notification);

  // Trigger animation
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });

  // Remove notification after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}; 