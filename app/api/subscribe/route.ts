import { NextRequest, NextResponse } from "next/server";
import { sendSubscriptionEmail } from "@/lib/email";
import { getSupabaseServerClient } from "@/src/server/config/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: existingSubscriber, error: fetchError } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Database fetch error:", fetchError);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      // Update existing subscriber status to 'subscribed'
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          status: "subscribed",
          subscribed_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (updateError) {
        console.error("Database update error:", updateError);
        return NextResponse.json(
          { success: false, error: "Failed to update subscription" },
          { status: 500 }
        );
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase.from("subscribers").insert({
        email,
        status: "subscribed",
      });

      if (insertError) {
        console.error("Database insert error:", insertError);
        return NextResponse.json(
          { success: false, error: "Failed to save subscription" },
          { status: 500 }
        );
      }
    }

    // Send subscription email
    const result = await sendSubscriptionEmail({ email });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Subscription confirmed! Check your email.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
