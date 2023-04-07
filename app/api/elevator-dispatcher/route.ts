import { AppConfig } from "@/config/app.config";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.APP_ID!,
  key: process.env.KEY!,
  secret: process.env.SECRET!,
  cluster: process.env.CLUSTER!,
});

export async function POST(request: Request) {
  const res = await request.json();
  res.logs = res.logs.slice(-50);
  pusher.trigger(
    AppConfig.PUSHER_DATA_CHANNEL,
    AppConfig.PUSHER_DATA_EVENT_NAME,
    res
  );
  return NextResponse.json({ res });
}
