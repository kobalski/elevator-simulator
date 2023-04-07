import React from "react";
import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/solid";
import ElevatorCommand from "@/model/ElevatorCommand";
import ElevatorCommandType from "@/model/ElevatorCommandType";
import ElevatorDirection from "@/model/ElevatorDirection";

type FloorProps = {
  onInternalClick: (floor: number) => void;
  onExternalClick: (floor: number, direction: ElevatorDirection) => void;
  currentFloor: number;
  commands: ElevatorCommand[];
};

function getInternalCommands(commands: ElevatorCommand[]) {
  return commands
    .filter((command) => command.commandType === ElevatorCommandType.INTERNAL)
    .map((command) => command.destinationFloor);
}

function getExternalCommands(commands: ElevatorCommand[]) {
  return commands
    .filter((command) => command.commandType === ElevatorCommandType.EXTERNAL)
    .map((command) => command);
}

const Floors = ({
  onInternalClick,
  onExternalClick,
  currentFloor,
  commands,
}: FloorProps) => {
  const floors = [6, 5, 4, 3, 2, 1];

  const internalCommands = getInternalCommands(commands);
  const externalCommands = getExternalCommands(commands);

  return (
    <div className="flex flex-col justify-center items-start gap-4 border-2 border-cyan-900 ml-8 p-4">
      {floors.map((floor) => {
        const isActiveUp =
          externalCommands.filter(
            (command) =>
              command.destinationFloor === floor &&
              command.direction === ElevatorDirection.UP
          ).length > 0;

        const isActiveDown =
          externalCommands.filter(
            (command) =>
              command.destinationFloor === floor &&
              command.direction === ElevatorDirection.DOWN
          ).length > 0;

        return (
          <div className="grid grid-cols-6 content-between" key={floor}>
            <div className="flex justify-center items-center gap-2 border-2 col-span-3 p-8  w-32 h-32">
              <div className="text-xl">{floor}</div>
              {floor !== 1 ? (
                <button
                  className={
                    isActiveDown
                      ? "border-2 border-gray-900 bg-yellow-400"
                      : "border-2 border-gray-900"
                  }
                  onClick={() => {
                    onExternalClick(floor, ElevatorDirection.DOWN);
                  }}
                >
                  {React.createElement(ArrowSmallDownIcon, {
                    width: 20,
                    height: 20,
                  })}
                </button>
              ) : null}

              {floor !== 6 ? (
                <button
                  className={
                    isActiveUp
                      ? "border-2 border-gray-900 bg-yellow-400"
                      : "border-2 border-gray-900"
                  }
                  onClick={() => {
                    onExternalClick(floor, ElevatorDirection.UP);
                  }}
                >
                  {React.createElement(ArrowSmallUpIcon, {
                    width: 20,
                    height: 20,
                  })}
                </button>
              ) : null}
            </div>
            {floor === currentFloor ? (
              <div className="flex justify-center border-2 col-span-3 border-gray-950 ml-10">
                <div
                  className="grid grid-cols-2 content-between gap-1 m-1"
                  key={floor}
                >
                  {floors.map((f) => {
                    const isActive = internalCommands.includes(f);
                    return (
                      <button
                        key={f}
                        onClick={() => onInternalClick(f)}
                        className={`border-2 rounded-full w-6 h-6 border-gray-900 flex justify-center items-center ${
                          isActive ? "bg-yellow-300" : ""
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Floors;
