import ElevatorDirection from "./ElevatorDirection";
import ElevatorState from "./ElevatorState";

class Elevator {
  private _currentDirection: ElevatorDirection = ElevatorDirection.UP;
  private _currentState: ElevatorState = ElevatorState.IDLE;
  private _currentFloor: number = 0;
  private _internalTimer: number = 0;

  constructor(
    currentDirection: ElevatorDirection,
    currentState: ElevatorState,
    currentFloor: number,
    internalTimer: number
  ) {
    this._currentDirection = currentDirection;
    this._currentState = currentState;
    this._currentFloor = currentFloor;
    this._internalTimer = internalTimer;
  }

  public get currentDirection() {
    return this._currentDirection;
  }

  public set currentDirection(currentDirection: ElevatorDirection) {
    this._currentDirection = currentDirection;
  }
  public get internalTimer() {
    return this._internalTimer;
  }

  public set internalTimer(internalTimer: number) {
    this._internalTimer = internalTimer;
  }

  public get currentState() {
    return this._currentState;
  }

  public set currentState(currentState: ElevatorState) {
    this._currentState = currentState;
  }

  public get currentFloor() {
    return this._currentFloor;
  }

  public set currentFloor(currentFloor: number) {
    this._currentFloor = currentFloor;
  }
}

export default Elevator;
