/*
    отчет: https://contest.yandex.ru/contest/24810/run-report/113814580/

    Принцип работы:
        1) инициализация экземпляра кучи с помощью класса Heap
        2) при добавлении элемента в кучу, происходит просеивание вверх, что приводит к тому, что на вершине кучи хранится наибольший элемент
        3) сортировка: при сортировке в результирующий массив кладется верхний элемент кучи, после чего на место верхнего элемента
            кладется последний и происходит просеивание вниз, что приводит к тому что после этих операций наверху кучи снова находится наибольший элемент

        Пусть 
            n - количество участников
            
            Временная сложность
                Выполнение программы
                    просеивание: O(log n)
                    добавление элемента в кучу: необходимо просеить вверх n элементов -> O(n) * O(log n) ->  O(n*log n)                          
                    извлечение элемента из кучи: необходимо просеить вниз n элементов -> O(n) * O(log n) ->  O(n*log n)           
                Итоговое - O(n*log n) + O(n*log n) -> O(n*log n)

            Пространственная сложность (доп. память)
                Выполнение программы
                    в куче необхдимо хранить весь набор участников -> O(n)
                Итоговое - O(n)
*/

const _readline = require('readline');

const _reader = _readline.createInterface({
    input: process.stdin
});

const _inputLines = [];
let _curLine = 0;

_reader.on('line', line => {
    _inputLines.push(line);
});

process.stdin.on('end', solve);


function swap(heap, a, b) {
    [heap[a], heap[b]] = [heap[b], heap[a]];
}

function sorting(a, b) {
    const [aName, aTasks, aFine] = a
    const [bName, bTasks, bFine] = b

    if (Number(aTasks) < Number(bTasks)) return -1
    if (Number(aTasks) > Number(bTasks)) return 1

    if (Number(aFine) > Number(bFine)) return -1
    if (Number(aFine) < Number(bFine)) return 1

    if (aName > bName) return -1
    if (aName < bName) return 1

    return 0

}

class Heap {
    constructor(callback) {
        this.heap = [-1]
        this.callback = callback
    }

    siftDown(idx) {
        while (2 * idx < this.heap.length) {
            let maxIdx = 2 * idx

            if (maxIdx + 1 < this.heap.length && this.callback(this.heap[maxIdx], this.heap[maxIdx + 1]) < 0) {
                maxIdx += 1
            }

            if (this.callback(this.heap[idx], this.heap[maxIdx]) >= 0) break

            swap(this.heap, idx, maxIdx)
            idx = maxIdx
        }
    }

    siftUp(idx) {
        let parent = Math.floor(idx / 2)

        while (idx !== 1 && this.callback(this.heap[idx], this.heap[parent]) > 0) {
            swap(this.heap, parent, idx);
            idx = parent
            parent = Math.floor(idx / 2)
        }
    }

    add(item) {
        this.heap.push(item)
        if (this.heap.length === 2) return

        const index = this.heap.length - 1;
        this.siftUp(index);
    }

    pop() {
        const max = this.heap[1]

        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.siftDown(1)

        return max
    }
}


function heapSort(participants) {
    const heap = new Heap(sorting)
    const res = [];

    participants.forEach((participant) => heap.add(participant))

    while (heap.heap.length > 1) {
        let max = heap.pop(heap);
        res.push(max);
    }

    return res;
}


function solve() {
    const n = readNum()
    const participants = readArray(n);

    heapSort(participants).forEach(([name]) => {
        process.stdout.write(`${name}\n`);
    })
}

function readStr() {
    const str = _inputLines[_curLine]
    _curLine++;
    return str;
}

function readNum() {
    const num = Number(_inputLines[_curLine])
    _curLine++;
    return num;
}

function readArray(rowsCount) {
    const arr = [];
    for (let i = 0; i !== rowsCount; i++) {
        const strArr = readStr().trim().split(' ')
        arr.push(strArr)
    }
    return arr;
}