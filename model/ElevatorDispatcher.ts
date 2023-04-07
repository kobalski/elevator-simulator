import Elevator from "./Elevator";
import ElevatorCommand from "./ElevatorCommand";
import ElevatorState from "./ElevatorState";
import ElevatorDirection from "./ElevatorDirection";
import IQueue from "./IQueue";
import Queue from "./Queue";
import { ElevatorCommandData } from "@/types/ElevatorCommandData";
import ElevatorCommandType from "./ElevatorCommandType";
import { ElevatorData } from "@/types/ElevatorData";
import _ from "lodash";

class ElevatorDispatcher {
  private _testMode: boolean;
  private _elevator: Elevator;
  private _commandQueue: IQueue<ElevatorCommand> = new Queue();
  private _logs: string[] = [];

  private readonly _lastFloor: number = 6;
  private readonly _firstFloor: number = 1;

  private _floorWaitTime: number = 4;
  private _floorTravelTime: number = 3;

  constructor() {
    this._elevator = new Elevator(
      ElevatorDirection.UP,
      ElevatorState.IDLE,
      1,
      0
    );
    this._testMode = false;
  }

  public addCommand(command: ElevatorCommand) {
    if (this._testMode) {
      this._commandQueue.enqueue(command);
      return;
    }

    if (
      command.destinationFloor > this._lastFloor ||
      command.destinationFloor < this._firstFloor ||
      command.destinationFloor === this._elevator.currentFloor
    ) {
      throw Error(
        `Destination floor must be smaller than ${this._lastFloor} and bigger than ${this._firstFloor} and cannot be current floor.`
      );
    }
    this._commandQueue.enqueue(command);
  }

  public get elevator() {
    return this._elevator;
  }

  public get commandQueue() {
    return this._commandQueue;
  }

  public get logs() {
    return this._logs;
  }

  public set logs(logs: string[]) {
    this._logs = logs;
  }

  public get testMode() {
    return this._testMode;
  }

  public set testMode(testMode: boolean) {
    this._testMode = testMode;
  }

  public get floorWaitTime() {
    return this._floorWaitTime;
  }

  public get floorTravelTime() {
    return this._floorTravelTime;
  }

  public set floorWaitTime(floorWaitTime: number) {
    this._floorWaitTime = floorWaitTime;
  }

  public set floorTravelTime(floorTravelTime: number) {
    this._floorTravelTime = floorTravelTime;
  }

  public setCommandQueueFromData(data: ElevatorCommandData[]) {
    const commandQueue: IQueue<ElevatorCommand> = new Queue();
    data.forEach((command) => {
      let direction: ElevatorDirection = ElevatorDirection.NO_DIRECTION;
      if (command.direction === ElevatorDirection.UP) {
        direction = ElevatorDirection.UP;
      }
      if (command.direction === ElevatorDirection.DOWN) {
        direction = ElevatorDirection.DOWN;
      }
      if (command.direction === ElevatorDirection.NO_DIRECTION) {
        direction = ElevatorDirection.NO_DIRECTION;
      }
      let commandType: ElevatorCommandType =
        command.commandType === ElevatorCommandType.EXTERNAL
          ? ElevatorCommandType.EXTERNAL
          : ElevatorCommandType.INTERNAL;

      const elevatorCommand = new ElevatorCommand(
        direction,
        commandType,
        command.destinationFloor
      );
      commandQueue.enqueue(elevatorCommand);
    });
    this._commandQueue = commandQueue;
  }

  public setElevatorFromData(data: ElevatorData) {
    let currentDirection = ElevatorDirection.NO_DIRECTION;
    if (data.currentDirection === ElevatorDirection.UP) {
      currentDirection = ElevatorDirection.UP;
    }
    if (data.currentDirection === ElevatorDirection.DOWN) {
      currentDirection = ElevatorDirection.DOWN;
    }
    if (data.currentDirection === ElevatorDirection.NO_DIRECTION) {
      currentDirection = ElevatorDirection.NO_DIRECTION;
    }

    let currentState = ElevatorState.IDLE;
    if (data.currentState === ElevatorState.IDLE) {
      currentState = ElevatorState.IDLE;
    }
    if (data.currentState === ElevatorState.MOVING) {
      currentState = ElevatorState.MOVING;
    }
    if (data.currentState === ElevatorState.STOPPED) {
      currentState = ElevatorState.STOPPED;
    }

    this._elevator = new Elevator(
      currentDirection,
      currentState,
      data.currentFloor,
      data.internalTimer
    );
  }

  private reCalculateCommandQueue(direction: ElevatorDirection) {
    let destinationFloorToBeDeleted = -1;

    this.commandQueue.getItems().forEach((command, index) => {
      if (
        (this._elevator.currentFloor === command.destinationFloor &&
          !this.isThereAnyCommandInCurrentDirection(direction)) ||
        (this._elevator.currentFloor === command.destinationFloor &&
          command.commandType === ElevatorCommandType.INTERNAL) ||
        (this._elevator.currentFloor === command.destinationFloor &&
          command.commandType === ElevatorCommandType.EXTERNAL &&
          command.direction === direction)
      ) {
        this._elevator.currentState = ElevatorState.STOPPED;
        this._logs.push(
          "Reached destination floor. Elevator is going to " +
            this._elevator.currentState +
            " state."
        );
        destinationFloorToBeDeleted = command.destinationFloor;
      }
    });

    if (destinationFloorToBeDeleted > -1) {
      const commandQueueWithoutRemovedCommands = _.remove(
        this._commandQueue.getItems(),
        (command) => {
          return command.destinationFloor !== destinationFloorToBeDeleted;
        }
      );
      this._commandQueue.empty();
      commandQueueWithoutRemovedCommands.forEach((command) => {
        this._commandQueue.enqueue(command);
      });
    }
  }

  private calculateElevatorDirection() {
    if (this._commandQueue.getItems().length === 0) {
      return ElevatorDirection.NO_DIRECTION;
    }

    if (this._commandQueue.getItems().length === 0) {
      return this._commandQueue.getItems()[0].direction;
    }

    const sortedCommands = [...this._commandQueue.getItems()].sort((c1, c2) => {
      return c1.destinationFloor > c2.destinationFloor
        ? 1
        : c1.destinationFloor < c2.destinationFloor
        ? -1
        : 0;
    });

    const isThereDownCommand =
      sortedCommands.filter(
        (command) => this._elevator.currentFloor > command.destinationFloor
      ).length !== 0;

    const isThereUpCommand =
      sortedCommands.filter(
        (command) => this._elevator.currentFloor < command.destinationFloor
      ).length !== 0;

    const currentDirection = this._elevator.currentDirection;
    if (currentDirection === ElevatorDirection.DOWN && isThereDownCommand) {
      return ElevatorDirection.DOWN;
    }
    if (currentDirection === ElevatorDirection.DOWN && isThereUpCommand) {
      return ElevatorDirection.UP;
    }
    if (currentDirection === ElevatorDirection.UP && isThereUpCommand) {
      return ElevatorDirection.UP;
    }
    if (currentDirection === ElevatorDirection.UP && isThereDownCommand) {
      return ElevatorDirection.DOWN;
    }
    return ElevatorDirection.NO_DIRECTION;
  }

  private isThereAnyCommandInCurrentDirection(
    currentDirection: ElevatorDirection
  ) {
    if (
      this._commandQueue.getItems().length === 0 ||
      this._commandQueue.getItems().length === 1
    ) {
      return false;
    }

    const sortedCommands = [...this._commandQueue.getItems()].sort((c1, c2) => {
      return c1.destinationFloor > c2.destinationFloor
        ? 1
        : c1.destinationFloor < c2.destinationFloor
        ? -1
        : 0;
    });
    const currentFloor = this._elevator.currentFloor;
    if (
      (currentDirection === "Up" &&
        currentFloor <
          sortedCommands[sortedCommands.length - 1].destinationFloor) ||
      (currentDirection === "Down" &&
        currentFloor >
          sortedCommands[sortedCommands.length - 1].destinationFloor)
    ) {
      return true;
    }
    {
      return false;
    }
  }

  public step() {
    if (this._commandQueue.size() > 0) {
      if (this._elevator.currentState === ElevatorState.STOPPED) {
        if (this._elevator.internalTimer < this._floorWaitTime) {
          this._elevator.internalTimer++;
          this._logs.push(
            `Elevator will wait in floor ${this._elevator.currentFloor} ${
              this._floorWaitTime - this._elevator.internalTimer
            } seconds.`
          );
          return;
        } else {
          this._elevator.internalTimer = 0;
        }
      }
      const calculatedDirection = this.calculateElevatorDirection();

      if (calculatedDirection === ElevatorDirection.UP) {
        this._elevator.currentState = ElevatorState.MOVING;
        this._elevator.currentDirection = ElevatorDirection.UP;
      } else if (calculatedDirection === ElevatorDirection.DOWN) {
        this._elevator.currentState = ElevatorState.MOVING;
        this._elevator.currentDirection = ElevatorDirection.DOWN;
      } else if (calculatedDirection === ElevatorDirection.NO_DIRECTION) {
        this._elevator.currentState = ElevatorState.STOPPED;
        this._elevator.currentDirection = ElevatorDirection.NO_DIRECTION;
      }

      if (
        this._elevator.currentState === ElevatorState.MOVING &&
        this._elevator.currentDirection === ElevatorDirection.UP
      ) {
        if (calculatedDirection === ElevatorDirection.UP) {
          if (this._elevator.internalTimer < this._floorTravelTime) {
            this.elevator.internalTimer++;
            this._logs.push(
              `Elevator moving to floor ${this._elevator.currentFloor} to ${
                this._elevator.currentFloor + 1
              }.`
            );
            return;
          } else {
            this.elevator.internalTimer = 0;
          }
          this._elevator.currentFloor++;
          this._logs.push(
            "Elevator reached to floor " + this._elevator.currentFloor + "."
          );
        }
        this.reCalculateCommandQueue(calculatedDirection);
      } else if (
        this._elevator.currentState === ElevatorState.MOVING &&
        this._elevator.currentDirection === ElevatorDirection.DOWN
      ) {
        if (calculatedDirection === ElevatorDirection.DOWN) {
          if (this._elevator.internalTimer < this._floorTravelTime) {
            this.elevator.internalTimer++;
            this._logs.push(
              `Elevator moving to floor ${this._elevator.currentFloor} to ${
                this._elevator.currentFloor - 1
              }.`
            );
            return;
          } else {
            this.elevator.internalTimer = 0;
          }
          this._elevator.currentFloor--;
          this._logs.push(
            "Elevator reached to floor " + this._elevator.currentFloor + "."
          );
        }
        this.reCalculateCommandQueue(calculatedDirection);
      }
    } else {
      this._elevator.currentState = ElevatorState.IDLE;
      this._logs.push(
        "No command to be processed. Elevator is in waiting for input."
      );
    }
  }

  public stop() {
    this._commandQueue.empty();
    this._logs = [];
  }
}

export default ElevatorDispatcher;
