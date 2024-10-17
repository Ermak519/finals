/*
    отчет: https://contest.yandex.ru/contest/25597/run-report/115208097/

    Принцип работы:
        Задача решена с использованием алгоритма Вагнера—Фишера
        1. Инициализация двух массивов - result и dp размером m
        2. С помощью вложенных циклов проходимся по строкам. 
            - добавление символа result[j] + 1
            - удаление символа dp[j - 1] + 1
            - если символы в строках по индексами не равны, увеличиваем distance на 1
            В конце каждой итерации производим замену массивов dp и result, в dp[0] записываем номер следующей итерации.
        3. Ответом будет является последнийэлемент в массиве result.

        Пусть 
            n - количество символов длинной строки
            m - количество символов короткой строки
            
            Временная сложность
                Выполнение программы 
                    необходимо пройтись по всем символам длинной строки - O(n)
                    необходимо пройтись по всем символам короткой строки - O(m)                    
                    лучше в первую очередь проходить по длинной строке, и на каждой итерации проходить по короткой
                Итоговое - O(n * m) 

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения результирующего массива - O(m)
                    память требуемая для хранения массива dp - O(m)
                Итоговое - O(m) + O(m) -> O(m)
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

const ARRAY_FILL = 0

function getMinNumber(...rest) {
    return Math.min(...rest)
}

function livenshtaneDistance(s, t) {
    const longStr = s.length >= t.length ? s : t
    const shortStr = s.length < t.length ? s : t

    const INIT_ARRAY_LENGTH = shortStr.length + 1

    let result = new Array(INIT_ARRAY_LENGTH).fill(ARRAY_FILL).map((_, index) => index)
    let dp = new Array(INIT_ARRAY_LENGTH).fill(ARRAY_FILL);

    dp[0] = 1;

    for (let i = 1; i <= longStr.length; i++) {
        for (let j = 1; j <= shortStr.length; j++) {
            let distance = result[j - 1];

            if (longStr[i - 1] !== shortStr[j - 1]) distance++;

            dp[j] = getMinNumber(result[j] + 1, dp[j - 1] + 1, distance)
        }

        [result, dp] = [[...dp], [...result]]
        dp[0] = i + 1;
    }

    return result[result.length - 1]
}

function solve() {
    const str1 = readStr()
    const str2 = readStr()

    const result = livenshtaneDistance(str1, str2)

    process.stdout.write(`${result}\n`);
}

function readStr() {
    const str = _inputLines[_curLine].trim()
    _curLine++;

    return str
}