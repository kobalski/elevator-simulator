"use client";
import "@patternfly/react-core/dist/styles/base.css";
import ElevatorDispatcher from "@/model/ElevatorDispatcher";
import ElevatorCommand from "@/model/ElevatorCommand";
import ElevatorDirection from "@/model/ElevatorDirection";
import ElevatorCommandType from "@/model/ElevatorCommandType";
import { useEffect, useReducer, useState } from "react";
import _ from "lodash";
import { ElevatorDispatcherData } from "@/types/ElevatorDispatcherData";
import Floors from "./Floors";
import CommandService from "@/service/command.service";
import { ElevatorCommandData } from "@/types/ElevatorCommandData";
import LogPanel from "./LogPanel";

type Action =
  | { type: "tick" }
  | { type: "internal"; direction: ElevatorDirection; floor: number }
  | { type: "external"; direction: ElevatorDirection; floor: number };

function reducer(dispatcher: ElevatorDispatcher, action: Action) {
  let command;
  switch (action.type) {
    case "tick":
      dispatcher.step();
      return _.cloneDeep(dispatcher);
    case "internal":
      command = new ElevatorCommand(
        action.direction,
        ElevatorCommandType.INTERNAL,
        action.floor
      );
      dispatcher.addCommand(command);
      return _.cloneDeep(dispatcher);
    case "external":
      command = new ElevatorCommand(
        action.direction,
        ElevatorCommandType.EXTERNAL,
        action.floor
      );
      dispatcher.addCommand(command);
      return _.cloneDeep(dispatcher);
    default:
      throw new Error();
  }
}

export default function ServerMode() {
  const [simulatorTime, setSimulatorTime] = useState(0);
  const initialState = new ElevatorDispatcher();
  const [elevatorDispatcher, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messageCallback = (data: ElevatorCommandData) => {
      if (data.commandType === ElevatorCommandType.EXTERNAL) {
        dispatch({
          type: "external",
          floor: data.destinationFloor,
          direction:
            data.direction === ElevatorDirection.UP
              ? ElevatorDirection.UP
              : ElevatorDirection.DOWN,
        });
      } else {
        dispatch({
          type: "internal",
          floor: data.destinationFloor,
          direction: ElevatorDirection.NO_DIRECTION,
        });
      }
    };
    const commandService = new CommandService();
    commandService.bind(messageCallback);

    return () => {
      commandService.unbind;
    };
  }, []);

  useEffect(() => {
    const sendData = async () => {
      let data: ElevatorDispatcherData = {
        elevator: {
          currentDirection: elevatorDispatcher.elevator.currentDirection,
          currentState: elevatorDispatcher.elevator.currentState,
          currentFloor: elevatorDispatcher.elevator.currentFloor,
          internalTimer: elevatorDispatcher.elevator.internalTimer,
        },
        commandQueue: elevatorDispatcher.commandQueue
          .getItems()
          .map((command) => {
            return {
              direction: command.direction,
              commandType: command.commandType,
              destinationFloor: command.destinationFloor,
            };
          }),
        logs: elevatorDispatcher.logs,
        simulatorTime: simulatorTime,
      };
      const response = await fetch("/api/elevator-dispatcher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    };
    sendData();
  }, [elevatorDispatcher]);

  useEffect(() => {
    let interval = setInterval(() => {
      setSimulatorTime(simulatorTime + 1);
      dispatch({ type: "tick" });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [simulatorTime]);

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
              dispatch({
                type: "internal",
                floor,
                direction: ElevatorDirection.NO_DIRECTION,
              });
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
              dispatch({
                type: "external",
                floor,
                direction: direction,
              });
            }}
          />
        </div>
        <div className="w-3/4">
          <LogPanel
            simulatorTime={simulatorTime}
            mode="Server"
            logs={elevatorDispatcher.logs}
          />
        </div>
      </div>
    </>
  );
}
