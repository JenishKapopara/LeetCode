/**
 * @param {number} n
 * @param {number[][]} meetings
 * @return {number}
 */
class Heap {
    constructor(comparator) {
        this._data = [];
        this._heapSize = 0;
        this._comparator = comparator;
    }
    parent(i) {
        return Math.floor((i-1)/2);
    }
    lchild(i) {
        return (i*2) + 1;
    }
    rchild(i) {
        return (i*2) + 2;
    }
    maxHeapify(i) {
        let largest = i;
        const l = this.lchild(i);
        const r = this.rchild(i);

        if (l < this.curSize() && this._comparator(this._data[l], this._data[i]))
            largest = l;
        
        if (r < this.curSize() && this._comparator(this._data[r], this._data[largest]))
            largest = r;
        if (largest !== i) {
            const tmp = this._data[i];
            this._data[i] = this._data[largest];
            this._data[largest] = tmp;
            this.maxHeapify(largest);
        }
    }
    removeMax() {
        if (this.curSize() == 0)
            return null;
        if (this.curSize() == 1) {
            this._heapSize--;
            return this._data.pop();
        }
        this._heapSize--;
        
        const root = this._data[0];
        this._data[0] = this._data.pop();
        this.maxHeapify(0);

        return root;
    }
    increaseKey(i, newVal) {
        this._data[i] = newVal;

        while (i !== 0 && this._comparator(this._data[i], this._data[this.parent(i)])) {
            const temp = this._data[i];
            this._data[i] = this._data[this.parent(i)];
            this._data[this.parent(i)] = temp;
            i = this.parent(i);
        }
    }
    getMax() {
        if (this.curSize() == 0) return null;
        return this._data[0];
    }
    curSize() {
        return this._heapSize;
    }
    deleteKey(i) {
        this.increaseKey(i, Infinity);
        this.removeMax();
    }
    insertKey(x) {
        this._data.push(x);
        this._heapSize++;

        let i = this._heapSize - 1;
        while (i !== 0 && this._comparator(this._data[i], this._data[this.parent(i)])) {
            const tmp = this._data[i];
            this._data[i] = this._data[this.parent(i)];
            this._data[this.parent(i)] = tmp;
            i = this.parent(i);
        }
    }
 }
const meetingsComparator = (x,y) => x[0] < y[0];
const roomsComparator = (x,y) => {
    if (x[1] < y[1]) return true;
    if (y[1] < x[1]) return false;
    if (x[0] < y[0]) return true;
    return false;
}
var mostBooked = function(n, meetings) {
    let maxRoomUsage = 0;
    const roomsUsage = new Array(n).fill(0);
    const rooms = new Array(n).fill(-Infinity);
    const meetingsHeap = new Heap(meetingsComparator);
    const getNextAvailableRoom = startTime => {
        let earliestAvailableStartTime = Infinity;
        let earliestAvailableRoom = n;

        for (let i = 0; i < n; i++) {
            if (startTime >= rooms[i])
                return i;
            if (rooms[i] < earliestAvailableStartTime) {
                earliestAvailableStartTime = rooms[i];
                earliestAvailableRoom = i;
            }
        }
        return earliestAvailableRoom;
    }

    for (const [startTime, endTime] of meetings) {
        meetingsHeap.insertKey([startTime, endTime]);
    } 
    while (meetingsHeap.curSize() > 0) {
        const [currStartTime, currEndTime] = meetingsHeap.removeMax();
        const nextAvailableRoom = getNextAvailableRoom(currStartTime);

        const nextEndTime = currStartTime >= rooms[nextAvailableRoom] 
            ? currEndTime
            : rooms[nextAvailableRoom] + (currEndTime - currStartTime);
        
        rooms[nextAvailableRoom] = nextEndTime;
        roomsUsage[nextAvailableRoom]++;
    
        if (roomsUsage[nextAvailableRoom] > roomsUsage[maxRoomUsage]
            || (roomsUsage[nextAvailableRoom] == roomsUsage[maxRoomUsage]
                && nextAvailableRoom < maxRoomUsage))
                    maxRoomUsage = nextAvailableRoom;
    }
    return maxRoomUsage;
};