/*
    отчет: https://contest.yandex.ru/contest/24810/run-report/113876727/

    Принцип работы:
        1) поиск узла в дереве с сохранением родительского узла
        2) если найденый элемент является листом, то у родителя удаляем найденный узел, если елемент является root, то null
        3) если найденый элемент с одним потомком, то у родителя меняем элемент на потомка элемента
        4) если у элемента два потомка, ищет в правом потомке самый левый узел + родительскую ноду узла.
            меняем значение удаляемого узла на найденный узел,  родительской ноде присваиваем слева или справа левую часть найденного левого узла.

        Пусть 
            h - высота дерева
            
            Временная сложность
                Выполнение программы            
                    для удаления узла необходимо найти нужный узел, в худшем случае он может быть листом на самом нижнем уровне дерева -> O(h)            
                Итоговое - O(h)

            Пространственная сложность (доп. память)
                Выполнение программы
                    при выполнении программы требуется всегда хранить минимум 2 указателя на родителя и найденый узел, максимум 4 при удалении узла с двумя потомками -> O(1)
                Итоговое - O(1)
*/

function searchNode(node, parent, value) {
    while (node && node.value !== value) {
        parent = node;

        if (value >= node.value) {
            node = node.right;
        } else {
            node = node.left;
        }
    }

    return [node, parent]
}

function findReplaceNode(node, parent) {
    while (node.left) {
        parent = node;
        node = node.left;
    }

    return [node, parent];
}

function deleteLeaf(node, parent) {
    if (parent.left === node) {
        parent.left = null
    } else {
        parent.right = null
    }
}

function deleteOneChild(root, node, parent) {
    const current = node.left ? node.left : node.right
    if (node === root) return current

    if (node === parent.left) {
        parent.left = current;
    } else {
        parent.right = current;
    }

    return root
}

function deleteTwoChild(node) {
    const [findNode, parent] = findReplaceNode(node.right, node);

    node.value = findNode.value;

    if (parent.left === findNode) {
        parent.left = findNode.left;
    } else {
        parent.right = findNode.left;
    }
}

function remove(root, key) {
    const [findNode, parent] = searchNode(root, null, key);

    if (!findNode) return root;

    if (!findNode.left && !findNode.right) {
        if (findNode === root) return null;

        deleteLeaf(findNode, parent)

        return root;
    }

    if (!findNode.left || !findNode.right) {
        return deleteOneChild(root, findNode, parent)
    }

    deleteTwoChild(findNode)

    return root;
}