import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  } else {
    console.warn('EmailJS public key not found in environment variables');
  }
};

// Send confirmation email to user
export const sendUserConfirmationEmail = async (userData) => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.warn('EmailJS service ID or template ID not configured');
      return { success: false, message: 'Email service not configured' };
    }

    // Initialize EmailJS if not already done
    initEmailJS();

    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      from_name: 'Capita Prime LLC',
      reply_to: 'invest@capitaprimellc.com',
      user_name: userData.name,
      user_email: userData.email,
      user_phone: userData.phone || 'Not provided',
      user_message: userData.message,
      user_type: userData.type || 'General Inquiry',
      user_budget: userData.budget || 'Not specified',
    };

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    console.log('EmailJS result:', result);
    return { success: true, message: 'Confirmation email sent successfully' };

  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send confirmation email'
    };
  }
};

// Send inquiry notification to admin (this could be kept as backend or also use EmailJS)
export const sendAdminNotificationEmail = async (inquiryData) => {
  // This function could also use EmailJS if you want to move admin notifications to frontend
  // For now, we'll keep this as a placeholder since admin emails are handled by backend
  console.log('Admin notification would be sent for:', inquiryData);
  return { success: true, message: 'Admin notification sent' };
};

export default {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
  initEmailJS
};