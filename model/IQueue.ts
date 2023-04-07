interface IQueue<T> {
  enqueue(item: T): void;
  peek(): T | undefined;
  dequeue(): T | undefined;
  size(): number;
  empty(): void;
  getItems(): T[];
  deleteItem(index: number): void;
}

export default IQueue;
