/*
    отчет: https://contest.yandex.ru/contest/26133/run-report/115771658/

    Принцип работы:
        0. Раскрываем все сткроки
        1. В качестве базового элемента берётся первая строка.
        2. Следующие строки сравниваются с базовой пока не встретятся символы, которые отличаются.
        3. В итоговом результате хранятся минимум количества одинаковых символов.
        4. Итоговой строкой будет подстрока из базовой строки от 0 до итогового результата

        Пусть 
            n - количество строк
            M - длина исходной строки
            T - длина полной строки
            k - коэффициент повтора строки

            Временная сложность
                Выполнение программы 
                    распаковка строк - O(k ^ M)
                    необходимо обработать все строки - O(n)
                Итоговое - O(n * k ^ M), поскольку T ограничена сверху k ^ M, т.е. худшая длина распаковки строки -> O(n * T)

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения полной строки - O(T)
                Итоговое - O(T)
*/

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const inputLines = [];
let curLine = 0;

reader.on('line', line => {
    inputLines.push(line);
});

process.stdin.on('end', solve);

function isOneData(data) {
    return data.length === 1
}

function getMin(ans, tmp) {
    if (!ans) return tmp

    return Math.min(ans, tmp);
}

function isNumber(str) {
    const num = Number(str)

    return !isNaN(num)
}

function isOpenBrackets(str) {
    return str === '['
}

function isCloseBrackets(str) {
    return str === ']'
}

function unpackStr(str) {
    const nums = [];
    const letters = [];
    let result = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (isNumber(char)) {
            nums.push(Number(char));
            continue;
        }

        if (isOpenBrackets(char)) {
            letters.push('');
            continue;
        }

        if (isCloseBrackets(char)) {
            const tmpLetters = letters.pop();
            const numberOnTop = nums.pop();

            let subString = '';

            for (let j = 0; j < numberOnTop; j++) {
                subString += tmpLetters
            }

            if (letters.length) {
                letters[letters.length - 1] += subString
            } else {
                result += subString
            }

            continue
        }

        if (!letters.length) {
            result += char
        } else {
            letters[letters.length - 1] += char
        }
    }

    return result
}

function packedPrefix(data) {
    const first = unpackStr(data[0])

    if (isOneData(data)) return first

    let res = 0;

    for (let i = 1; i < data.length; i++) {
        const currStr = unpackStr(data[i])
        let tmp = 0;

        for (let j = 0; j < currStr.length; j++) {
            if (first[j] !== currStr[j]) break;
            tmp++;
        }

        res = getMin(res, tmp)
    }

    return first.substring(0, res)
}

function solve() {
    const rows = readNumber()
    const data = readArray(rows)

    const result = packedPrefix(data)

    process.stdout.write(`${result}\n`);
}

function readNumber() {
    const num = inputLines[curLine]
    curLine++;

    return Number(num)
}

function readStr() {
    const str = inputLines[curLine].trim()
    curLine++;

    return str
}

function readArray(rows) {
    const arr = [];
    for (let i = 0; i !== rows; i++) {
        arr.push(readStr())
    }
    return arr;
}