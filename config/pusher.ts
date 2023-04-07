import Pusher from "pusher-js";
import { AppConfig } from "./app.config";

export const pusher = new Pusher(AppConfig.PUSHER_KEY, {
  cluster: AppConfig.PUSHER_CLUSTER,
});
