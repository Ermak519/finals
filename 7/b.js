/*
    отчет: https://contest.yandex.ru/contest/25597/run-report/115213803/

        1. Проверка суммы элементов на четность
        2. Инициализируем массив dp размером половины суммы элементов 
        3. Ищем все подмножества сумм через цикл i от 1 до sum/2 внутри которого цикл j по всем исходным элементам.
        4. Ответом будет является последний элемент в массиве dp.

        Пусть 
            n - количество партий
            m - сумма очков всех партий
            
            Временная сложность
                Выполнение программы 
                    необходимо пройтись по всем партиям - O(n)
                    обработка половины всех очков партий - O(m / 2)                    
                Итоговое - O(n * m / 2) -> O(n * m)

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения половины всех очков партий - O(m / 2)
                Итоговое - O(m/2) -> O(m)
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

const WRONG_ANSWER = 'False'
const CORRECT_ANSWER = 'True'

const ARRAY_FILL = 0

function sameAmounts(data) {
    const sum = data.reduce((acc, cur) => acc += cur);

    const INIT_LOOP = sum / 2
    const DP_ARRAY_LENGTH = INIT_LOOP + 1

    const isOdd = Boolean(sum % 2)

    if (isOdd) return WRONG_ANSWER

    const dp = new Array(DP_ARRAY_LENGTH).fill(ARRAY_FILL);

    dp[0] = 1;

    for (let i = 0; i < data.length; i++) {
        for (let j = INIT_LOOP; j >= data[i]; j--) {
            if (!dp[j - data[i]]) continue

            dp[j] = 1;
        }
    }

    return dp[dp.length - 1] ? CORRECT_ANSWER : WRONG_ANSWER
}

function solve() {
    const n = readNumber()
    const data = readArr()

    const result = sameAmounts(data)

    process.stdout.write(`${result}\n`);
}

function readNumber() {
    const str = _inputLines[_curLine].trim()
    _curLine++;

    return Number(str)
}

function readArr() {
    const arr = _inputLines[_curLine].trim().split(' ').map(Number)
    _curLine++;

    return arr
}