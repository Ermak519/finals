/*
    отчет: https://contest.yandex.ru/contest/25070/run-report/114858979/

    Принцип работы:
        Остовное дерево строится с использованием алгоритма Прима
        Хранение рёбер исходящие из уже собранного подмножества остова в куче с поддержанием максимума

        1. Составление дерева происходит с произвольной вершины, добавляем в кучу все ребра со смежными вершинами (если они не были посещены).
        2. Извлекаем из кучи ребро с максимальным весом, обновляем в массиве результатов максимальный вес вершины и делаем такие же действия начиная с п.1 для этой вершины.

        Пусть 
            V - количество вершин
            E - количество рёбер
            
            Временная сложность
                Выполнение программы 
                    необходимо пройтись по всем ребрам - O(|E|)
                    обработка вершин с помощью кучи - O(log(|V|))                    
                Итоговое - O(|E| * log(|V|))

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения вершин - O(|V|)
                    память требуемая для хранения рёбер - O(|E|)
                Итоговое - O(|V| + |E|)
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

const ERROR_MSG = 'Oops! I did it again'
const EMPTY_READ_STR = '0 0 0'
const START = 1 // начальначя позиция для работы с приоритетной очередью

function getWeightKey(key1, key2) {
    return `${key1}->${key2}`
}

function buildGraphWithWeight(weight, graph, list) {
    list.forEach((data) => {
        const [u, v, w] = data.split(' ').map(Number)
        graph[u].push(v);
        graph[v].push(u);

        const key1 = getWeightKey(u, v)
        const key2 = getWeightKey(v, u)

        if (!weight.has(key1) || weight.get(key1) < w) {
            weight.set(key1, w);
        }

        if (!weight.has(key2) || weight.get(key2) < w) {
            weight.set(key2, w);
        }
    })
}

function compare(vertex1, vertex2) {
    const [, w1] = vertex1
    const [, w2] = vertex2

    if (w1 < w2) {
        return -1;
    }
    if (w1 > w2) {
        return 1;
    }

    return 0;
}

function swap(heap, a, b) {
    [heap[a], heap[b]] = [heap[b], heap[a]];
}

class Heap {
    constructor(compare) {
        this.store = [-1]
        this.compare = compare
    }

    siftDown(idx) {
        while (2 * idx < this.store.length) {
            let maxIdx = 2 * idx

            if (maxIdx + 1 < this.store.length && this.compare(this.store[maxIdx], this.store[maxIdx + 1]) < 0) {
                maxIdx += 1
            }

            if (this.compare(this.store[idx], this.store[maxIdx]) >= 0) break

            swap(this.store, idx, maxIdx)
            idx = maxIdx
        }

        return idx
    }

    siftUp(idx) {
        let parent = Math.floor(idx / 2)

        while (idx !== 1 && this.compare(this.store[idx], this.store[parent]) > 0) {
            swap(this.store, parent, idx);
            idx = parent
            parent = Math.floor(idx / 2)
        }

        return idx
    }

    add(item) {
        this.store.push(item)
        if (this.store.length === 2) return

        const index = this.store.length - 1;
        this.siftUp(index);
    }

    pop() {
        const max = this.store[1]

        this.store[1] = this.store[this.store.length - 1];
        this.store.pop();
        this.siftDown(1)

        return max
    }

    isEmptyHeap() {
        return this.store.length <= 1
    }
}

function maxSpanningTree(dist, visited, graph, weight) {
    const heap = new Heap(compare)

    const stack = [START];
    dist[START] = 0;

    while (stack.length) {
        const v = stack.pop();

        if (visited[v]) continue

        visited[v] = true;

        graph[v].forEach((u) => {
            if (visited[u]) return

            heap.add([u, weight.get(getWeightKey(v, u))])
        })

        if (heap.isEmptyHeap()) continue

        let maxDist = heap.pop();

        while (maxDist && visited[maxDist[0]]) {
            maxDist = heap.pop();
        }

        if (!maxDist) continue

        if (maxDist[1] > dist[maxDist[0]]) {
            dist[maxDist[0]] = maxDist[1];
        }

        stack.push(maxDist[0])
    }

    const result = dist.reduce((acc, curr) => {
        acc += curr
        return acc
    }, 0)

    const isValid = visited.slice(START).every((vertex) => vertex)

    return isValid ? result : ERROR_MSG
}

function solve() {
    const [n, m] = readMatrixSize()
    const list = readArray(m);

    const weight = new Map();
    const graph = new Array(n + 1).fill(null).map(() => []);
    const dist = new Array(n + 1).fill(0);
    const visited = new Array(n + 1).fill(false);

    buildGraphWithWeight(weight, graph, list)

    const result = maxSpanningTree(dist, visited, graph, weight)

    process.stdout.write(`${result}\n`);
}

function readMatrixSize() {
    const [n, m] = _inputLines[_curLine].trim().split(' ')
    _curLine++;
    return [Number(n), Number(m)];
}

function readStr() {
    const str = _inputLines[_curLine]
    _curLine++;

    if (!str) return EMPTY_READ_STR

    return str.trim()
}

function readArray(rowsCount) {
    const arr = [];
    for (let i = 0; i !== rowsCount; i++) {
        arr.push(readStr())
    }
    return arr;
}
