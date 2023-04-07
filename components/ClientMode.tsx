"use client";
import "@patternfly/react-core/dist/styles/base.css";
import ElevatorDispatcher from "@/model/ElevatorDispatcher";
import { useEffect, useReducer, useState } from "react";
import _ from "lodash";
import PusherService from "@/service/pusher.service";
import { ElevatorDispatcherData } from "@/types/ElevatorDispatcherData";
import Floors from "./Floors";
import ElevatorDirection from "@/model/ElevatorDirection";
import { ElevatorCommandData } from "@/types/ElevatorCommandData";
import ElevatorCommandType from "@/model/ElevatorCommandType";
import LogPanel from "./LogPanel";

type Action = { type: "tick"; data: ElevatorDispatcher };

function reducer(dispatcher: ElevatorDispatcher, action: Action) {
  switch (action.type) {
    case "tick":
      return _.cloneDeep(action.data);
    default:
      throw new Error();
  }
}
type ClientModeProps = {
  dispatcher: ElevatorDispatcher;
};

const sendData = async (
  direction: ElevatorDirection,
  commandType: ElevatorCommandType,
  destinationFloor: number
) => {
  let data: ElevatorCommandData = {
    direction,
    commandType,
    destinationFloor,
  };
  const response = await fetch("/api/elevator-command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export default function ClientMode({ dispatcher }: ClientModeProps) {
  const [simulatorTime, setSimulatorTime] = useState(0);
  const [elevatorDispatcher, dispatch] = useReducer(reducer, dispatcher);

  useEffect(() => {
    const messageCallback = (data: ElevatorDispatcherData) => {
      setSimulatorTime(data.simulatorTime);
      const dispatcher = new ElevatorDispatcher();
      dispatcher.logs = data.logs;
      dispatcher.setCommandQueueFromData(data.commandQueue);
      dispatcher.setElevatorFromData(data.elevator);
      dispatch({ type: "tick", data: dispatcher });
    };
    const pusherService = new PusherService();
    pusherService.bind(messageCallback);

    return () => {
      pusherService.unbind;
    };
  }, []);

  return (
    <>
      <div className="flex justify-between items-start mb-4 gap-5">
        <div className="w-1/4">
          <Floors
            onInternalClick={(floor) => {
              if (floor === elevatorDispatcher.elevator.currentFloor) {
                alert(
                  `Elevator is already in floor ${floor}. Try pressing other floors.`
                );
                return;
              }
              sendData(
                ElevatorDirection.NO_DIRECTION,
                ElevatorCommandType.INTERNAL,
                floor
              );
            }}
            currentFloor={elevatorDispatcher.elevator.currentFloor}
            commands={elevatorDispatcher.commandQueue.getItems()}
            onExternalClick={(floor: number, direction: ElevatorDirection) => {
              if (floor === elevatorDispatcher.elevator.currentFloor) {
                alert(
                  `Elevator is already in floor ${floor}. Try pressing other floors.`
                );
                return;
              }
              sendData(
                direction === ElevatorDirection.UP
                  ? ElevatorDirection.UP
                  : ElevatorDirection.DOWN,
                ElevatorCommandType.EXTERNAL,
                floor
              );
            }}
          />
        </div>
        <div className="w-3/4">
          <LogPanel
            simulatorTime={simulatorTime}
            mode="Client"
            logs={elevatorDispatcher.logs}
          />
        </div>
      </div>
    </>
  );
}
