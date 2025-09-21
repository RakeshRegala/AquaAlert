import { useState, useCallback } from 'react';
import { emailService, AlertEmailData } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

interface UseEmailNotificationsReturn {
  sendAlertNotification: (data: Omit<AlertEmailData, 'governmentEmail' | 'governmentName'>) => Promise<boolean>;
  sendTestEmail: (email: string) => Promise<boolean>;
  isEmailConfigured: boolean;
  isSending: boolean;
}

export const useEmailNotifications = (): UseEmailNotificationsReturn => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const isEmailConfigured = true; // Server-side API handles email configuration

  const sendAlertNotification = useCallback(async (data: Omit<AlertEmailData, 'governmentEmail' | 'governmentName'>) => {
    if (!isEmailConfigured) {
      toast({
        title: "Email Not Configured",
        description: "Please configure Gmail credentials in environment variables to send notifications.",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);
    try {
      // Get government user's email from their profile
      const governmentEmail = import.meta.env.VITE_GOVERNMENT_EMAIL || 'government@example.com';
      const governmentName = import.meta.env.VITE_GOVERNMENT_NAME || 'Government Authority';

      const emailData: AlertEmailData = {
        ...data,
        governmentEmail,
        governmentName,
      };

      const success = await emailService.sendAlertNotification(emailData);
      
      if (success) {
        toast({
          title: "Alert Notification Sent",
          description: `Email notification sent to ${governmentEmail}`,
        });
      } else {
        toast({
          title: "Failed to Send Notification",
          description: "Could not send email notification. Please check the configuration.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error sending alert notification:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending the notification.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }, [isEmailConfigured, toast]);

  const sendTestEmail = useCallback(async (email: string) => {
    if (!isEmailConfigured) {
      toast({
        title: "Email Not Configured",
        description: "Please configure Gmail credentials in environment variables.",
        variant: "destructive",
      });
      return false;
    }

    setIsSending(true);
    try {
      const success = await emailService.sendTestEmail(email);
      
      if (success) {
        toast({
          title: "Test Email Sent",
          description: `Test email sent to ${email}`,
        });
      } else {
        toast({
          title: "Failed to Send Test Email",
          description: "Could not send test email. Please check the configuration.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending the test email.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }, [isEmailConfigured, toast]);

  return {
    sendAlertNotification,
    sendTestEmail,
    isEmailConfigured,
    isSending,
  };
};
