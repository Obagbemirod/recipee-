export const preventScreenCapture = () => {
  // Prevent screenshots and recordings
  document.addEventListener('keydown', (e) => {
    if (
      (e.key === 'PrintScreen' || 
      (e.ctrlKey && e.key === 'p') || 
      (e.metaKey && e.key === 'p'))
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
};

export const checkOfflineAccess = () => {
  return {
    isOnline: navigator.onLine,
    hasOfflineAccess: localStorage.getItem('hasOfflineAccess') === 'true'
  };
};

export const setupOfflineDetection = (callback: (isOnline: boolean) => void) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};