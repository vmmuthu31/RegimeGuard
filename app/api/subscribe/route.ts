import { NextRequest, NextResponse } from 'next/server';
import { sendSubscriptionEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Send subscription email
        const result = await sendSubscriptionEmail({ email });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Subscription confirmed! Check your email.',
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to send email' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Subscribe API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
