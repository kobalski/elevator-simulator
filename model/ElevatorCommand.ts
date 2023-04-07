import ElevatorDirection from "./ElevatorDirection";
import ElevatorCommandType from "./ElevatorCommandType";

class ElevatorCommand {
  private _direction: ElevatorDirection;
  private _commandType: ElevatorCommandType;
  private _destinationFloor: number;

  constructor(
    direction: ElevatorDirection,
    commandType: ElevatorCommandType,
    destinationFloor: number
  ) {
    this._direction = direction;
    this._destinationFloor = destinationFloor;
    this._commandType = commandType;
  }

  public get direction() {
    return this._direction;
  }

  public set direction(direction: ElevatorDirection) {
    this._direction = direction;
  }

  public get destinationFloor() {
    return this._destinationFloor;
  }

  public set destinationFloor(destinationFloor: number) {
    this._destinationFloor = destinationFloor;
  }

  public get commandType() {
    return this._commandType;
  }

  public set commandType(commandType: ElevatorCommandType) {
    this._commandType = commandType;
  }
}

export default ElevatorCommand;
