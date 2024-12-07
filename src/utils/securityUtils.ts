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

  // Prevent selecting text
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Add CSS to prevent selection and dragging
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    
    img, video {
      pointer-events: none !important;
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
    }
  `;
  document.head.appendChild(style);
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