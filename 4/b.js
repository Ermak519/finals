/*
    отчет: https://contest.yandex.ru/contest/24414/run-report/112603139/

    Принцип работы:
        1) класс HashMap реализован с динамическим размером, поскольку поддерживать рехеширование и масштабирование хеш-таблицы не требуется.
        2) функция hash возвращает нужный индекс в массиве
        3) для решения коллизий используется метод открытой адресации, квадратичное пробирование

        Пусть 
            n - количество элементов хранящиеся в массиве
            m - количество входных команд
            
            Временная сложность
                Выполнение программы 
                    методы put, get и delete в среднем работают за O(1) времени, в случае если будет много коллизий то O(n)      
                    обработка входных команд - O(m)                 
                Итоговое - O(m), в худшем случае - O(n + m)

            Пространственная сложность (доп. память)
                Выполнение программы
                    в худшем случае на вход будут подаваться команды put, тем самым придётся хранить все данные - O(n)
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

const DELETED = 'Deleted'
const NONE = 'None'

// константы для решения коллизий квадратичным пробированием
// выбраны случайные простые числа
const C1 = 6661
const C2 = 9973

class HashMap {
    constructor(size) {
        this.map = []
        this.size = size
    }

    static isEmpty(elem) {
        return !elem || elem === DELETED
    }

    hash(key, i) {
        return (Number(key) + i * C1 + i * i * C2) % this.size;
    }

    getCellAndIndex(key, i) {
        const index = this.hash(key, i)
        const cell = this.map[index]

        return { index, cell }
    }

    put(key, value) {
        let i = 0
        while (true) {
            const { index, cell } = this.getCellAndIndex(key, i)

            if (HashMap.isEmpty(cell)) {
                this.map[index] = [key, value]
                return
            }

            const [findKey] = cell

            if (key === findKey) {
                this.map[index] = [key, value]
                return
            }

            i++
        }
    }

    get(key) {
        let i = 0
        while (true) {
            const { cell } = this.getCellAndIndex(key, i)

            if (!cell) throw Error(NONE)

            const [findKey, findValue] = cell
            if (key === findKey) return findValue;

            i++
        }
    }

    delete(key) {
        let i = 0
        while (true) {
            const { index, cell } = this.getCellAndIndex(key, i)

            if (!cell) throw Error(NONE)

            const [findKey, findValue] = cell

            if (key === findKey) {
                this.map[index] = DELETED
                return findValue;
            }
            i++
        }
    }
}

function solution(arr, size) {
    const map = new HashMap(size)

    let res = ''

    arr.forEach((commandStr, index) => {
        const [commandType, key, value] = commandStr.split(' ')

        try {
            if (!value) {
                res += `${map[commandType](key)}\n`
            } else {
                map[commandType](key, value)
            }
        } catch (error) {
            res += `${error.message}\n`
        }

        if (arr.length - 1 === index) {
            process.stdout.write(`${res}\n`);
        }
    })
}

function solve() {
    const count = readNum()
    const commands = arrayOfCommands(count);
    solution(commands, count)
}

function readNum() {
    const num = Number(_inputLines[_curLine])
    _curLine++;
    return num;
}

function readCommand() {
    const command = _inputLines[_curLine].trim()
    _curLine++;
    return command;
}

function arrayOfCommands(rowsCount) {
    const arr = [];
    for (let i = 0; i < rowsCount; i++) {
        arr.push(readCommand())
    }
    return arr;
}
