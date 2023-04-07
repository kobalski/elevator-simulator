import { AppConfig } from "@/config/app.config";
import { pusher } from "@/config/pusher";
import Pusher, { Channel } from "pusher-js";

export default class PusherService {
  pusher: Pusher;
  channelName: string = AppConfig.PUSHER_DATA_CHANNEL;
  channel: Channel;

  constructor() {
    this.pusher = pusher;
    this.channel = pusher.subscribe(this.channelName);
  }

  bind = (callback: (data: any) => void) => {
    this.channel.bind(AppConfig.PUSHER_DATA_EVENT_NAME, callback);
  };

  unbind = () => {
    this.channel.unbind();
  };
}
