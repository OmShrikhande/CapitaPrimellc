# EmailJS Setup Guide

This guide explains how to set up EmailJS for sending confirmation emails to users who submit inquiries through your contact forms.

## What is EmailJS?

EmailJS allows you to send emails directly from your frontend application without needing a backend server. It's perfect for sending confirmation emails, newsletters, and other user-facing communications.

## Setup Steps

### 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account and grant permissions
5. Note down your **Service ID** (something like `service_xxxxx`)

### 3. Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure for user confirmations:

**Subject:**
```
Thank you for your inquiry - Capita Prime LLC
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank you for your inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Interest</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Capita Prime LLC</p>
    </div>

    <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 10px 10px; padding: 30px;">
        <h2 style="color: #2c5530; margin-top: 0;">Dear {{to_name}},</h2>

        <p>Thank you for reaching out to Capita Prime LLC. We have received your inquiry and appreciate your interest in our premium land investment services.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Your Inquiry Details:</h3>
            <p><strong>Name:</strong> {{user_name}}</p>
            <p><strong>Email:</strong> {{user_email}}</p>
            <p><strong>Phone:</strong> {{user_phone}}</p>
            <p><strong>Interest:</strong> {{user_type}}</p>
            <p><strong>Budget:</strong> {{user_budget}}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e9ecef;">
                {{user_message}}
            </div>
        </div>

        <p>Our team will review your inquiry and contact you within 24 hours with more information about available opportunities that match your requirements.</p>

        <p>In the meantime, feel free to explore our current listings and services on our website.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://capitaprimellc.onrender.com" style="background: #C9A84C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Visit Our Website</a>
        </div>

        <p>If you have any urgent questions, please don't hesitate to contact us directly:</p>
        <p><strong>Email:</strong> invest@capitaprimellc.com<br>
        <strong>Phone:</strong> +971 4 XXX XXXX</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 14px; color: #666;">
            <strong>Capita Prime LLC</strong><br>
            Burj Khalifa District, Downtown Dubai, UAE<br>
            RERA Certified | DLD Registered
        </p>
    </div>
</body>
</html>
```

**Template Variables to set:**
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email (for replies)
- `{{user_name}}` - User's name
- `{{user_email}}` - User's email
- `{{user_phone}}` - User's phone
- `{{user_type}}` - Type of inquiry
- `{{user_budget}}` - Budget range
- `{{user_message}}` - User's message

4. Save the template and note down your **Template ID** (something like `template_xxxxx`)

### 4. Get Public Key

1. Go to **Account** in your EmailJS dashboard
2. Find your **Public Key** (something like `xxxxxxxxxxxxxx`)
3. This key is safe to use in frontend code

### 5. Update Environment Variables

Update your `.env` file with the EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Replace the placeholder values with your actual EmailJS IDs.

## How It Works

1. **User submits inquiry** through contact form or popup
2. **Backend receives inquiry** and sends admin notification email
3. **Frontend sends confirmation email** to user using EmailJS
4. **User receives professional confirmation email** with their inquiry details

## Testing

1. Submit a test inquiry through your contact form
2. Check that you receive the admin notification (backend email)
3. Check that the user receives the confirmation email (EmailJS)

## Troubleshooting

- **Emails not sending**: Check your EmailJS dashboard for error logs
- **Template variables not working**: Ensure variable names match exactly in your template
- **Service quota exceeded**: EmailJS free plan has limits - upgrade if needed

## Security Note

EmailJS public keys are safe to use in frontend code as they only allow sending emails through your configured services. They cannot be used to access your email account directly.</content>
</xai:function_call"> 