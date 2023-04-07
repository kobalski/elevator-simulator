import { ElevatorCommandData } from "./ElevatorCommandData";
import { ElevatorData } from "./ElevatorData";

export type ElevatorDispatcherData = {
  elevator: ElevatorData;
  commandQueue: ElevatorCommandData[];
  logs: string[];
  simulatorTime: number;
};
