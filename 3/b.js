/*
    отчет: https://contest.yandex.ru/contest/23815/run-report/111848201/

    Принцип работы:
        Для работы необходимо создать дополнительную функцию compared, для упращения сравнения массивов с результатами конкурса
            если compared возвращает отрицательно число то первый элемент идет первый
            если compared возвращает 0 то элементы сохраняют свою позицию

        Основная функция сортирует массив arrToSortInPlace на месте, т.е. перезаписывая значения, 
        поскольку sorting сортирует на месте пришлось сделать её часть основной функции inPlaceQuickSort

        принцип сортировки остался прежним, выбор случайного элемента, смещение индексов слева и справа до того пока работает функция compare
        уйти в рекурсию пока указатели не пересекутся

        Пусть 
            n - количество элементов           
            
            Временная сложность
                Выполнение программы
                    на каждом шаге произовдится шагов -> O(n)
                    количество шагов составляет -> O(log n)                
                итоговое - O(n) * O(log n) = O(n log n)

                худший случай:
                    в худшем случае каждый раз выбирая неудачно опорный элемент каждое разделение даёт два подмассива размерами 1 и n-1, 
                    поэтому потребуется n-1 операция, а общее время может составить O(n^2)

            Пространственная сложность (доп. память)
                выполнение программы
                    поскольку соратировка происходит на месте, доп памяти на хранение правых и левых массивов не требуется -> О(1)
                    выполнение самой рекурсии займет О(log n) для хранения стека, в наиболее лучшем варианте при каждой операции массив делится на две одинаковые части
                    
                итоговое - O(log n)
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

function compared(a, b) {
    const [aName, aTasks, aFine] = a
    const [bName, bTasks, bFine] = b

    if (bTasks - aTasks !== 0) {
        return bTasks - aTasks
    } else if (aFine - bFine !== 0) {
        return aFine - bFine
    }

    if (aName > bName) {
        return 1
    }
    if (aName < bName) {
        return -1
    }
    return 0
}

function inPlaceQuickSort(arrToSortInPlace, callback) {
    function sorting(arrToSortInPlace, start = 0, end = arrToSortInPlace.length - 1) {
        if (start >= end) {
            return;
        }

        let left = start
        let right = end;

        let pivot = arrToSortInPlace[Math.floor((start + end) / 2)];

        while (left <= right) {
            while (callback(arrToSortInPlace[left], pivot) < 0) {
                left++;
            }

            while (callback(arrToSortInPlace[right], pivot) > 0) {
                right--;
            }

            if (left <= right) {
                swap(arrToSortInPlace, left, right)

                left++;
                right--;
            }
        }

        sorting(arrToSortInPlace, start, right);
        sorting(arrToSortInPlace, left, end);
    }

    sorting(arrToSortInPlace);


    return arrToSortInPlace;
}

function swap(arr, index1, index2) {
    let temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

function solve() {
    const n = readInt()
    const participans = readMatrix(n);
    inPlaceQuickSort(participans, compared).forEach(([participan]) => {
        process.stdout.write(`${participan}\n`);
    })
}

function isNumber(value) {
    const elem = Number(value)
    return isNaN(elem) !== true
}

function readInt() {
    const num = Number(_inputLines[_curLine])
    _curLine++;
    return num;
}

function readParticipant() {
    const arr = _inputLines[_curLine].trim().split(" ").map((elem) => {
        return isNumber(elem) ? Number(elem) : elem
    });
    _curLine++;
    return arr;
}

function readMatrix(rowsCount) {
    const arr = [];
    for (let i = 0; i !== rowsCount; i++) {
        arr.push(readParticipant())
    }
    return arr;
}

