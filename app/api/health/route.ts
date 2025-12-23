import { NextResponse } from "next/server";
import { getServerTime } from "@/server/services/weex-client";

export async function GET() {
  try {
    const serverTime = await getServerTime();

    return NextResponse.json({
      success: true,
      data: {
        status: "operational",
        serverTime: serverTime.timestamp,
        localTime: Date.now(),
        latency: Date.now() - serverTime.timestamp,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      data: {
        status: "error",
        error: message,
      },
    });
  }
}
