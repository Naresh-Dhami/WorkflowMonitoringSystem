
import { useCallback, useEffect } from 'react';

export function useNavigationDialog() {
  // Function to dispatch a refresh navigation event
  const refreshNavigation = useCallback(() => {
    // Create and dispatch a custom event when navigation dialog closes
    const event = new Event('refreshNavigation');
    window.dispatchEvent(event);
  }, []);
  
  // Function to fix focus trap issues when dialog closes
  const handleDialogClose = useCallback(() => {
    // Short timeout to ensure DOM is updated before fixing focus
    setTimeout(() => {
      // Remove any modal backdrops that might be stuck
      const backdrops = document.querySelectorAll('[data-backdrop]');
      backdrops.forEach(backdrop => {
        backdrop.parentNode?.removeChild(backdrop);
      });
      
      // Remove any lingering aria-hidden attributes from the main content
      const mainContent = document.getElementById('root');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
        mainContent.style.pointerEvents = 'auto';
      }
      
      // Restore body scroll and pointer events
      document.body.style.overflow = '';
      document.body.style.pointerEvents = 'auto';
      
      // Remove any aria-hidden attributes from other elements
      document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
        if (el.id !== 'radix-:r0:' && !el.closest('[role="dialog"]')) {
          el.removeAttribute('aria-hidden');
        }
      });
      
      // Refresh navigation items
      refreshNavigation();
    }, 50);
  }, [refreshNavigation]);
  
  // Effect to add event listener for dialog close events
  useEffect(() => {
    const handleDialogCloseEvent = () => {
      handleDialogClose();
    };
    
    // Listen for custom dialog close events
    window.addEventListener('dialogClosed', handleDialogCloseEvent);
    
    return () => {
      window.removeEventListener('dialogClosed', handleDialogCloseEvent);
    };
  }, [handleDialogClose]);
  
  return {
    refreshNavigation,
    handleDialogClose
  };
}
