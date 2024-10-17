/*
    отчет: https://contest.yandex.ru/contest/25070/run-report/114860496/

    Принцип работы:
        1) Формирование графа в виде списка смежности 
        2) Буква "R" указывает направление дороги из города i в город j ("B" - наоборот)
        3) Используем поиск в глубину, если в графе присутствуют циклы (из города i в город j (и наоборот) можно попасть по путям типа "R" и "И") то карта неоптимальная 

        Пусть 
            V - количество вершин
            E - количество рёбер
            
            Временная сложность
                Выполнение программы 
                    Используя алогоритм DFS с представлением графа в виде списка смежности, 
                    необходимо пройтись по всему списку смежности - O(|V|) 
                    необходимо пройтись по каждому ребру - O(|E|)                 
                Итоговое - O(|V| + |E|) / если граф плотный то в худшем случае O(|V|^2)

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения вершин - O(|V|)
                    память требуемая для хранения рёбер - O(|E|)
                Итоговое - O(|V| + |E|) / если граф плотный то в худшем случае O(|V|^2)
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

const PATH = 'R'

const STATE = {
    NOT_VISITED: -1,
    VISITED: 1,
    IN_PROCESS: 0,
}

const VALID_RES = 'YES'
const UNVALID_RES = 'NO'

function railways(n, graph, colors) {
    const { NOT_VISITED, IN_PROCESS, VISITED } = STATE

    for (let i = 1; i <= n; i++) {
        const stack = [i];

        while (stack.length > 0) {
            const v = stack.pop();

            if (colors[v] === NOT_VISITED) {
                colors[v] = 0;
                stack.push(v);

                for (let j = 0; j < graph[v].length; j++) {
                    const u = graph[v][j];

                    if (colors[u] === IN_PROCESS) return UNVALID_RES

                    if (colors[u] === NOT_VISITED) stack.push(u);
                }

                continue
            }

            colors[v] = VISITED;
        }
    }

    return VALID_RES
}

function buildGraph(map, graph) {
    map.forEach((str, index) => {
        const i = index + 1

        for (let j = 0; j < str.length; j++) {
            const char = str[j]
            if (char === PATH) {
                graph[i].push(i + j + 1);
                continue
            }

            graph[i + j + 1].push(i);
        }
    })
}

function solve() {
    const n = readNum()
    const { NOT_VISITED } = STATE

    const graph = new Array(n + 1).fill(null).map(() => []);
    const colors = new Array(n + 1).fill(NOT_VISITED);

    const map = readArray(n - 1)
    buildGraph(map, graph)

    const res = railways(n, graph, colors)

    process.stdout.write(`${res}`);
}

function readNum() {
    const str = _inputLines[_curLine]
    _curLine++;
    return Number(str);
}

function readStr() {
    const str = _inputLines[_curLine].trim()
    _curLine++;
    return str;
}

function readArray(rows) {
    const arr = [];
    for (let i = 0; i !== rows; i++) {
        arr.push(readStr())
    }
    return arr;
}