import ElevatorDispatcher from "@/model/ElevatorDispatcher";
import ElevatorCommand from "@/model/ElevatorCommand";
import ElevatorDirection from "@/model/ElevatorDirection";
import ElevatorCommandType from "@/model/ElevatorCommandType";

test("Dispatcher should move elevator to a floor with external command", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();
  elevatorDispatcher.testMode = true;
  let command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    3
  );

  elevatorDispatcher.addCommand(command);
  command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    1
  );
  elevatorDispatcher.addCommand(command);
  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }
  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(6);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[2]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[3]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[4]).toBe("Elevator reached to floor 1.");
  expect(filteredLogs[5]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should move elevator to a floor with internal command", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();
  let command = new ElevatorCommand(
    ElevatorDirection.NO_DIRECTION,
    ElevatorCommandType.INTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);
  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }
  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(3);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[2]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should move elevator with multiple commands", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();

  let command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);
  command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    5
  );
  elevatorDispatcher.addCommand(command);

  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }

  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(6);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[2]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[3]).toBe("Elevator reached to floor 4.");
  expect(filteredLogs[4]).toBe("Elevator reached to floor 5.");
  expect(filteredLogs[5]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should remove a command if elevator reaches to that floor", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();

  let command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    5
  );
  elevatorDispatcher.addCommand(command);

  command = new ElevatorCommand(
    ElevatorDirection.NO_DIRECTION,
    ElevatorCommandType.INTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);

  command = new ElevatorCommand(
    ElevatorDirection.NO_DIRECTION,
    ElevatorCommandType.INTERNAL,
    2
  );
  elevatorDispatcher.addCommand(command);

  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }

  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(7);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[2]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[3]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[4]).toBe("Elevator reached to floor 4.");
  expect(filteredLogs[5]).toBe("Elevator reached to floor 5.");
  expect(filteredLogs[6]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should not stop on a floor if the elevator direction does not match to command direction", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();

  let command = new ElevatorCommand(
    ElevatorDirection.DOWN,
    ElevatorCommandType.EXTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);

  command = new ElevatorCommand(
    ElevatorDirection.DOWN,
    ElevatorCommandType.EXTERNAL,
    2
  );
  elevatorDispatcher.addCommand(command);

  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }

  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(5);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[2]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[3]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[4]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should not change direction until all floors satisfied in that direction", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();
  elevatorDispatcher.elevator.currentFloor = 4;
  elevatorDispatcher.elevator.currentDirection = ElevatorDirection.DOWN;

  let command = new ElevatorCommand(
    ElevatorDirection.DOWN,
    ElevatorCommandType.EXTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);

  command = new ElevatorCommand(
    ElevatorDirection.DOWN,
    ElevatorCommandType.INTERNAL,
    6
  );
  elevatorDispatcher.addCommand(command);

  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }

  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(6);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[1]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[2]).toBe("Elevator reached to floor 4.");
  expect(filteredLogs[3]).toBe("Elevator reached to floor 5.");
  expect(filteredLogs[4]).toBe("Elevator reached to floor 6.");
  expect(filteredLogs[5]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});

test("Dispatcher should stop a floor if the current direction is same with an external command", async () => {
  let elevatorDispatcher = new ElevatorDispatcher();

  let command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.EXTERNAL,
    3
  );
  elevatorDispatcher.addCommand(command);

  command = new ElevatorCommand(
    ElevatorDirection.UP,
    ElevatorCommandType.INTERNAL,
    2
  );
  elevatorDispatcher.addCommand(command);

  while (elevatorDispatcher.commandQueue.size() > 0) {
    elevatorDispatcher.step();
  }

  const filteredLogs = elevatorDispatcher.logs.filter((log) => {
    return (
      !log.includes("Elevator moving to floor") &&
      !log.includes("Elevator will wait in floor")
    );
  });

  expect(filteredLogs.length).toBe(4);
  expect(filteredLogs[0]).toBe("Elevator reached to floor 2.");
  expect(filteredLogs[1]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );
  expect(filteredLogs[2]).toBe("Elevator reached to floor 3.");
  expect(filteredLogs[3]).toBe(
    "Reached destination floor. Elevator is going to Stopped state."
  );

  elevatorDispatcher.stop();
});
