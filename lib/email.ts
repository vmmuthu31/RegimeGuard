import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SubscriptionEmailParams {
  email: string;
}

export async function sendSubscriptionEmail({ email }: SubscriptionEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"RegimeGuard" <noreply@regimeguard.com>',
      to: email,
      subject: '🛡️ Welcome to RegimeGuard',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      color-scheme: light dark;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    @media (prefers-color-scheme: dark) {
      body { background-color: #0B0E11; color: #ffffff; }
      .container { background-color: #18181b !important; }
      .text-primary { color: #ffffff !important; }
      .text-secondary { color: #a1a1aa !important; }
    }
    .container {
      max-width: 500px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }
    .banner-container {
      padding: 24px 24px 0;
      text-align: center;
    }
    .banner {
      width: 100%;
      max-width: 420px;
      border-radius: 8px;
      display: inline-block;
    }
    .content {
      padding: 20px 32px 32px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 10px;
      color: #111;
      letter-spacing: -0.02em;
    }
    .text-primary {
      color: #111;
    }
    .text-secondary {
      color: #666;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .highlight {
      color: #10b981;
      font-weight: 600;
    }
    ul {
      margin: 0 0 24px;
      padding: 0;
      list-style: none;
    }
    li {
      font-size: 14px;
      line-height: 2;
      color: #555;
    }
    li:before {
      content: "•";
      color: #10b981;
      font-weight: bold;
      margin-right: 8px;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 40px;
      background: #000000;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      transition: background 0.2s;
    }
    .footer {
      text-align: center;
      padding: 20px 32px;
      border-top: 1px solid rgba(0,0,0,0.05);
      font-size: 12px;
      color: #999;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner-container">
      <img src="https://regimeguard.vercel.app/banner.jpeg" alt="RegimeGuard" class="banner" />
    </div>
    
    <div class="content">
      <div class="badge">✓ Subscription Active</div>
      
      <h1 class="title text-primary">Welcome to RegimeGuard</h1>
      
      <p class="message text-secondary">
        You've successfully joined the <span class="highlight">RegimeGuard Intelligence Network</span>. 
        We'll keep you updated on our AI-powered trading system.
      </p>
      
      <p class="message text-secondary" style="margin-bottom: 8px;">You'll receive notifications about:</p>
      
      <ul>
        <li>New regime detection algorithms</li>
        <li>Risk engine updates</li>
        <li>Performance insights</li>
        <li>Exclusive strategies</li>
      </ul>
      
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://regimeguard.vercel.app/dashboard" class="cta-button">
          Access Dashboard →
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 RegimeGuard · <a href="https://regimeguard.vercel.app">regimeguard.vercel.app</a></p>
    </div>
  </div>
</body>
</html>
            `,
      text: `
Welcome to RegimeGuard!

Subscription Confirmed ✓

You've successfully joined the RegimeGuard Intelligence Network.

You'll receive notifications about:
- New regime detection algorithms
- Risk engine updates
- Performance insights
- Exclusive strategies

Access your dashboard: https://regimeguard.vercel.app/dashboard

© 2025 RegimeGuard
            `,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

