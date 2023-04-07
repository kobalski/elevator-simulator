import IQueue from "./IQueue";

class Queue<T> implements IQueue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  peek(): T | undefined {
    return this.storage[0];
  }

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }

  dequeue(): T | undefined {
    return this.storage.shift();
  }

  size(): number {
    return this.storage.length;
  }

  empty(): void {
    this.storage = [];
  }

  getItems(): T[] {
    return this.storage;
  }

  deleteItem(index: number): void {
    if (index > -1) {
      this.storage.splice(index, 1);
    } else {
      throw Error("Invalid index value: " + index);
    }
  }
}

export default Queue;
