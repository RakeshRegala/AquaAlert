// Utility functions for testing email functionality

export const validateEmailConfig = () => {
  const requiredVars = [
    'VITE_GMAIL_USER',
    'VITE_GMAIL_APP_PASSWORD',
    'VITE_GOVERNMENT_EMAIL',
    'VITE_GOVERNMENT_NAME'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
    config: {
      gmailUser: import.meta.env.VITE_GMAIL_USER,
      governmentEmail: import.meta.env.VITE_GOVERNMENT_EMAIL,
      governmentName: import.meta.env.VITE_GOVERNMENT_NAME,
      hasAppPassword: !!import.meta.env.VITE_GMAIL_APP_PASSWORD
    }
  };
};

export const getEmailConfigStatus = () => {
  const validation = validateEmailConfig();
  
  if (validation.isValid) {
    return {
      status: 'configured',
      message: 'Email notifications are properly configured and ready to use.',
      color: 'green'
    };
  } else {
    return {
      status: 'incomplete',
      message: `Missing configuration: ${validation.missingVars.join(', ')}`,
      color: 'orange'
    };
  }
};
