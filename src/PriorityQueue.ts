class PriorityQueueNode<T> {
    public value: T;
    public priority: number;

    constructor(value: T, priority: number) {
        this.value = value
        this.priority = priority
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class PriorityQueue<T> {
    public values: PriorityQueueNode<T>[];

    constructor() {
        this.values = []
    }

    private swap(index1: number, index2: number) {
        const temp = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = temp;
    }

    private bubbleUp() {
        let index = this.values.length - 1
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.values[parentIndex].priority > this.values[index].priority) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
        return 0;
    }

    enqueue(value: T, priority: number) {
        this.values.push({ value, priority });
        this.bubbleUp();
    }

    private bubbleDown() {
        let parentIndex = 0;
        const length = this.values.length;
        const elementPriority = this.values[0].priority;

        while (true) {

            const leftChildIndex = (2 * parentIndex) + 1;
            const rightChildIndex = (2 * parentIndex) + 2;
            let leftChildPriority: number = 0;
            let rightChildPriority: number = 0;
            let indexToSwap = null;

            if (leftChildIndex < length) {
                leftChildPriority = this.values[leftChildIndex].priority
                if (leftChildPriority < elementPriority) {
                    indexToSwap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChildPriority = this.values[rightChildIndex].priority

                if (
                    (rightChildPriority < elementPriority && indexToSwap === null) ||
                    (rightChildPriority < leftChildPriority && indexToSwap !== null)) {
                    indexToSwap = rightChildIndex
                }
            }

            if (indexToSwap === null) {
                break;
            }
            this.swap(parentIndex, indexToSwap);
            parentIndex = indexToSwap;
        }
    }

    dequeue(): T | undefined {
        this.swap(0, this.values.length - 1);
        const poppedNode = this.values.pop();
        if (this.values.length > 1)
            this.bubbleDown();

        return poppedNode.value;
    }

    clear() {
        this.values = [];
    }
}