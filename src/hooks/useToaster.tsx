import React from 'react';
import { useToasts, AddToast } from 'react-toast-notifications';

const useToaster = () => {
  const { addToast } = useToasts();

  function info(message, autoDismiss = false) {
    addToast(message, {
      appearance: 'info',
      autoDismiss,
    });
  }

  function success(message, autoDismiss = false) {
    addToast(message, {
      appearance: 'success',
      autoDismiss,
    });
  }

  function warning(message, autoDismiss = false) {
    addToast(message, {
      appearance: 'warning',
      autoDismiss,
    });
  }

  function error(message, autoDismiss = false) {
    addToast(message, {
      appearance: 'error',
      autoDismiss,
    });
  }

  return { info, success, warning, error };
};

export { useToaster };
