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
  pusher.trigger(
    AppConfig.PUSHER_COMMAND_CHANNEL,
    AppConfig.PUSHER_COMMAND_EVENT_NAME,
    res
  );
  return NextResponse.json({ res });
}
