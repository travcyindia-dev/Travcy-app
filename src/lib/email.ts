import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP (or any other SMTP service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // Use App Password for Gmail
    },
});

// Email templates
export const emailTemplates = {
    // Customer Welcome Email
    customerWelcome: (name: string) => ({
        subject: '🎉 Welcome to Travecy - Your Adventure Begins!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .header p { color: rgba(255,255,255,0.9); margin-top: 10px; }
                    .content { padding: 40px 30px; }
                    .content h2 { color: #1e293b; margin-top: 0; }
                    .content p { color: #64748b; line-height: 1.6; }
                    .features { display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
                    .feature { flex: 1; min-width: 150px; text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; }
                    .feature-icon { font-size: 32px; margin-bottom: 10px; }
                    .feature h3 { margin: 0; color: #1e293b; font-size: 14px; }
                    .btn { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌍 Welcome to Travecy!</h1>
                        <p>Your gateway to amazing travel experiences</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}! 👋</h2>
                        <p>Thank you for joining Travecy! We're thrilled to have you as part of our travel community.</p>
                        <p>With Travecy, you can:</p>
                        <div class="features">
                            <div class="feature">
                                <div class="feature-icon">🗺️</div>
                                <h3>Discover Amazing Destinations</h3>
                            </div>
                            <div class="feature">
                                <div class="feature-icon">✈️</div>
                                <h3>Book Curated Packages</h3>
                            </div>
                            <div class="feature">
                                <div class="feature-icon">🏆</div>
                                <h3>Travel with Verified Agencies</h3>
                            </div>
                        </div>
                        <p>Start exploring our handpicked travel packages and create unforgettable memories!</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/customer" class="btn">Explore Packages →</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 Travecy. All rights reserved.</p>
                        <p>Making travel dreams come true, one journey at a time.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    // Booking Confirmation Email
    bookingConfirmation: (data: {
        customerName: string;
        bookingId: string;
        packageTitle: string;
        destination: string;
        startDate: string;
        endDate: string;
        travelers: number;
        amount: number;
        paymentId: string;
    }) => ({
        subject: `✅ Booking Confirmed - ${data.destination} Trip | #${data.bookingId.slice(-8).toUpperCase()}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .success-icon { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 40px 30px; }
                    .booking-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0; }
                    .booking-card h3 { margin: 0 0 20px 0; color: #1e293b; display: flex; align-items: center; gap: 10px; }
                    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                    .detail-row:last-child { border-bottom: none; }
                    .detail-label { color: #64748b; }
                    .detail-value { color: #1e293b; font-weight: 600; }
                    .amount { font-size: 24px; color: #10b981; }
                    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
                    .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="success-icon">✅</div>
                        <h1>Booking Confirmed!</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>Great news! Your booking has been confirmed. Get ready for an amazing trip!</p>
                        
                        <div class="booking-card">
                            <h3>📋 Booking Details</h3>
                            <div class="detail-row">
                                <span class="detail-label">Booking ID</span>
                                <span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Package</span>
                                <span class="detail-value">${data.packageTitle}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Destination</span>
                                <span class="detail-value">📍 ${data.destination}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Travel Dates</span>
                                <span class="detail-value">${data.startDate} - ${data.endDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Travelers</span>
                                <span class="detail-value">${data.travelers} person(s)</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Payment ID</span>
                                <span class="detail-value">${data.paymentId}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Amount Paid</span>
                                <span class="detail-value amount">₹${data.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <p>You can view your booking details and manage your trips from your dashboard.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/customer/bookings" class="btn">View My Bookings</a>
                    </div>
                    <div class="footer">
                        <p>Need help? Contact our support team.</p>
                        <p>© 2025 Travecy. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    // Booking Cancellation Email
    bookingCancellation: (data: {
        customerName: string;
        bookingId: string;
        packageTitle: string;
        destination: string;
        amount: number;
    }) => ({
        subject: `❌ Booking Cancelled - ${data.destination} Trip | #${data.bookingId.slice(-8).toUpperCase()}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .cancel-icon { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 40px 30px; }
                    .booking-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #fecaca; }
                    .detail-row:last-child { border-bottom: none; }
                    .detail-label { color: #64748b; }
                    .detail-value { color: #1e293b; font-weight: 600; }
                    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
                    .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="cancel-icon">❌</div>
                        <h1>Booking Cancelled</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${data.customerName}</strong>,</p>
                        <p>Your booking has been cancelled as requested. We're sorry to see you go!</p>
                        
                        <div class="booking-card">
                            <div class="detail-row">
                                <span class="detail-label">Booking ID</span>
                                <span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Package</span>
                                <span class="detail-value">${data.packageTitle}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Destination</span>
                                <span class="detail-value">📍 ${data.destination}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Refund Amount</span>
                                <span class="detail-value">₹${data.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <p>If you paid online, your refund will be processed within 5-7 business days.</p>
                        <p>We hope to see you again soon! Feel free to explore other amazing packages.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/customer" class="btn">Browse Packages</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 Travecy. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    // Agency Welcome Email
    agencyWelcome: (agencyName: string) => ({
        subject: '🎉 Welcome to Travecy - Agency Registration Received!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .content { padding: 40px 30px; }
                    .status-card { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
                    .status-card h3 { color: #92400e; margin: 0; }
                    .steps { margin: 30px 0; }
                    .step { display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; }
                    .step-num { width: 32px; height: 32px; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
                    .step-content h4 { margin: 0 0 5px 0; color: #1e293b; }
                    .step-content p { margin: 0; color: #64748b; font-size: 14px; }
                    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏢 Welcome to Travecy!</h1>
                        <p style="color: rgba(255,255,255,0.9);">Agency Partner Program</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #1e293b; margin-top: 0;">Hello ${agencyName}! 👋</h2>
                        <p style="color: #64748b;">Thank you for registering your agency with Travecy! We're excited to have you as a potential partner.</p>
                        
                        <div class="status-card">
                            <h3>⏳ Verification Pending</h3>
                            <p style="color: #92400e; margin-top: 10px;">Your application is under review by our admin team.</p>
                        </div>

                        <div class="steps">
                            <h3 style="color: #1e293b;">What happens next?</h3>
                            <div class="step">
                                <div class="step-num">1</div>
                                <div class="step-content">
                                    <h4>Admin Review</h4>
                                    <p>Our team will verify your agency details and documents.</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-num">2</div>
                                <div class="step-content">
                                    <h4>Approval Notification</h4>
                                    <p>You'll receive an email once your agency is approved.</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-num">3</div>
                                <div class="step-content">
                                    <h4>Start Listing Packages</h4>
                                    <p>Create and manage your travel packages on our platform.</p>
                                </div>
                            </div>
                        </div>

                        <p style="color: #64748b;">This process usually takes 1-2 business days. We'll notify you as soon as your agency is verified!</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Travecy. All rights reserved.</p>
                        <p>Empowering travel agencies worldwide.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),

    // Agency New Booking Notification
    agencyNewBooking: (data: {
        agencyName: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        bookingId: string;
        packageTitle: string;
        destination: string;
        startDate: string;
        endDate: string;
        travelers: number;
        amount: number;
    }) => ({
        subject: `🎉 New Booking Received! ${data.packageTitle} | #${data.bookingId.slice(-8).toUpperCase()}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .money-icon { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 40px 30px; }
                    .booking-card { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin: 20px 0; }
                    .booking-card h3 { margin: 0 0 20px 0; color: #065f46; }
                    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #a7f3d0; }
                    .detail-row:last-child { border-bottom: none; }
                    .detail-label { color: #64748b; }
                    .detail-value { color: #1e293b; font-weight: 600; }
                    .amount { font-size: 24px; color: #10b981; }
                    .customer-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0; }
                    .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
                    .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="money-icon">💰</div>
                        <h1>New Booking Received!</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${data.agencyName}</strong>,</p>
                        <p>Great news! You have received a new booking. Here are the details:</p>
                        
                        <div class="booking-card">
                            <h3>📋 Booking Details</h3>
                            <div class="detail-row">
                                <span class="detail-label">Booking ID</span>
                                <span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Package</span>
                                <span class="detail-value">${data.packageTitle}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Destination</span>
                                <span class="detail-value">📍 ${data.destination}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Travel Dates</span>
                                <span class="detail-value">${data.startDate} - ${data.endDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Travelers</span>
                                <span class="detail-value">${data.travelers} person(s)</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Amount</span>
                                <span class="detail-value amount">₹${data.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div class="customer-card">
                            <h3 style="margin: 0 0 15px 0; color: #1e293b;">👤 Customer Details</h3>
                            <p style="margin: 5px 0; color: #64748b;"><strong>Name:</strong> ${data.customerName}</p>
                            <p style="margin: 5px 0; color: #64748b;"><strong>Email:</strong> ${data.customerEmail}</p>
                            <p style="margin: 5px 0; color: #64748b;"><strong>Phone:</strong> ${data.customerPhone}</p>
                        </div>

                        <p>Log in to your dashboard to view and manage this booking.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/agency" class="btn">View Dashboard</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 Travecy. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    }),
};

// Send email function
export async function sendEmail(to: string, template: { subject: string; html: string }) {
    try {
        // Check if email is configured
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.log('Email not configured. Skipping email send to:', to);
            console.log('Subject:', template.subject);
            return { success: true, skipped: true };
        }

        const mailOptions = {
            from: `"Travcy" <${process.env.SMTP_EMAIL}>`,
            to,
            subject: template.subject,
            html: template.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
