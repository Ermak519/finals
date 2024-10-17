/*
    отчет: https://contest.yandex.ru/contest/26133/run-report/115705094/

    Принцип работы:
        1. Создание префиксного дерева и доавбление туда все слова. 
            Последнюю букву слова обозначаем как терминальный узел. 
            Переходы по дереву хранятся в объекте.
        2. Проверка разбиения текста на отдельные слова из набора.
        3. Проходим по всем буквам исходного текста и ищем совпадения в дереве.
        4. Ответом является последний элемент массива dp.

        Пусть 
            n - количество входных слов
            L - суммарная длина слов
            M - длина самого длинного слова
            ∣Σ∣ - размер алфавита
            
            Временная сложность
                Выполнение программы 
                    построение бора - O(L)
                    необходимо пройтись по всем словам - O(n)                    
                    необходимо учитывать сложность при самом длинном слове, чтобы найти его в словаре - O(M)
                Итоговое - O(L) + O(n) * O(M) -> O(L + n * M) 

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения массива dp - O(n)
                    память требуемая для хранения алфавита - O(∣Σ∣ ^ M)
                Итоговое - O(∣Σ∣ ^ M) + O(n) -> O(∣Σ∣ ^ M + n)
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

class TrieNode {
    constructor(value = null, last = 0) {
        this.value = value;
        this.last = last;
        this.next = {};
    }
}

const LAST_LETTER = 1 // переменная для обозначения последней буквы в слове в префиксном дереве

const SUCCESS = 'YES'
const WRONG = 'NO'

function addString(str, trie) {
    for (let i = 0; i < str.length; i++) {
        if (!trie.next[str[i]]) {
            trie.next[str[i]] = new TrieNode(str[i])
        }

        trie = trie.next[str[i]];
    }

    trie.last = LAST_LETTER;
}

function crib(str, trie) {
    const dp = new Array(str.length + 1).fill(0);
    dp[0] = LAST_LETTER;

    for (let i = 0; i < str.length; i++) {
        if (!dp[i]) continue

        let tmpTrie = trie;
        let shift = 0;
        let j = i + shift

        while (j < str.length) {
            const shiftStr = str[j];

            if (!tmpTrie.next[shiftStr]) break;

            tmpTrie = tmpTrie.next[shiftStr];
            j++;

            if (tmpTrie.last) dp[j] = LAST_LETTER;
        }
    }

    return dp[dp.length - 1] ? SUCCESS : WRONG
}

function solve() {
    const initText = readStr()
    const rows = readNumber()
    const data = readArray(rows)

    const trie = new TrieNode();

    data.forEach((str) => addString(str, trie))

    const result = crib(initText, trie)

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