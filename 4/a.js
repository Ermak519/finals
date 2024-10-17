/*
    отчет: https://contest.yandex.ru/contest/24414/run-report/112682985/

    Принцип работы:
        1) составление БД со словами в каждом документе (для этого создана функция dbMap)
        2) необходимо пройтись по всем запроам и составить релевантность индексов слов
            индекс слова нужно брать из БД 
            для каждого запроса составить релевантность слов в документах

        Пусть 
            n - количество документов в БД 
            m - количество слов в документах в БД 

            p - количество запросов
            k - количество слов в запросе
            
            Временная сложность
                Выполнение программы 
                    для составление БД необходимо пройтись покаждому слову в каждом документе - O(n * m)
                    для составления таблицы релевантности индексов необходимо - O(p * k * n) + O(1)
                        пройтись по каждому запросу - O(p)
                        составить таблицу с уникальными словами - O(k)                        
                        для каждого слово  может найтись до n документов - O(n)                        
                        определить релевантность из БД - O(1)                        
                Итоговое - O(n * m + p * k * n)

            Пространственная сложность (доп. память)
                Выполнение программы
                    память требуемая для хранения слов для БД - O(n * m)
                    память требуемая для составления релевантность - O(p + k * n)
                        количество запросов - O(p)
                        количество слов в запросе - O(k)
                        количество документов где встречается слово, в худжем случае все слова будут во всех документах - O(n)
                Итоговое - O((m * n) + (p + k * n))
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

const OUTPUT_LIMIT = 5

function dbMap(documents) {
    const map = new Map();

    documents.forEach((document, indexDoc) => {
        const text = document.split(' ')
        const docNumber = indexDoc + 1

        text.forEach((word) => {
            if (!map.has(word)) map.set(word, {})

            const wordObj = map.get(word)

            if (!wordObj[docNumber]) {
                wordObj[docNumber] = 1
                return
            }

            wordObj[docNumber] += 1
        })
    })

    return map;
}

function searchSystem(documents, queries) {
    const db = dbMap(documents);
    const results = [];

    queries.forEach((query, queryIndex) => {
        const setWords = new Set(query.split(' '));
        const relevance = {};

        setWords.forEach(word => {
            if (!db.has(word)) return

            const wordData = db.get(word)

            Object.keys(wordData).forEach((docNumber) => {
                if (!relevance[docNumber]) relevance[docNumber] = 0
                relevance[docNumber] += wordData[docNumber]
            })
        })

        const arr = Object.entries(relevance).filter(([_, rel]) => rel > 0)

        if (!arr.length) return
        results[queryIndex] = [];

        let i = 0
        while (i < OUTPUT_LIMIT) {
            if (!arr.length) break

            let max = arr[0]
            let indexForSplice = 0
            if (arr.length === 1) {
                results[queryIndex].push(max[0]);
                break
            }

            for (let j = 1; j < arr.length; j++) {
                const [doc, rel] = arr[j]
                const diffDoc = doc - max[0]
                const diffRel = rel - max[1]

                if (diffRel > 0) {
                    max = arr[j]
                    indexForSplice = j
                    continue
                }

                if (diffDoc < 0) {
                    max = arr[j]
                    indexForSplice = j
                }
            }

            results[queryIndex].push(max[0]);
            arr.splice(indexForSplice, 1)
            i++
        }

        results[queryIndex] = results[queryIndex].join(' ');
    })

    return results;
}

function solve() {
    const docsCount = readNum();
    const text = readArray(docsCount);

    const queryCount = readNum();
    const queries = readArray(queryCount);

    searchSystem(text, queries).forEach((elem) => {
        process.stdout.write(`${elem}\n`);
    })
}

function readNum() {
    const n = Number(_inputLines[_curLine]);
    _curLine++;
    return n;
}

function readLine() {
    const n = _inputLines[_curLine];
    _curLine++;
    return n;
}

function readArray(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(readLine())
    }
    return arr;
}


