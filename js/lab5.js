function createResultForLab5() {
    // ошибочные значения параметров заменятся значениями по умолчанию
    // поэтому происходит обновление после ввода
    let calcParams = getParametersForCalculate();
    updateParametersOnSite(calcParams);

    // создание матриц M1 и M2
    let m1 = generateMatrixWithRandomNumbers(calcParams.m1_N, calcParams.m1_M, calcParams.leftRandomBorder, calcParams.rightRandomBorder);
    let m2 = generateMatrixWithRandomNumbers(calcParams.m2_N, calcParams.m2_M, calcParams.leftRandomBorder, calcParams.rightRandomBorder);

    addMatrixOnSite(m1, 1);
    addMatrixOnSite(m2, 2);

    let notIncludeRowsPairs = getAllPairsWithNotIncludeEachOtherRows(m1, m2);
    addNotIncludedPairsOnSite(notIncludeRowsPairs);

    let unionNotIncludeRowsVector = getUnionNotIncludeRowsVector(notIncludeRowsPairs);
    addUnionNotIncludedRowsVectorOnSite(unionNotIncludeRowsVector, 'lab5_union_not_include_row_vector');

    let unionVectorAfterReplace = [];
    let dublicatesCount = replaceDublicatesOnInfinity(unionNotIncludeRowsVector, unionVectorAfterReplace);
    addUnionNotIncludedRowsVectorOnSite(unionVectorAfterReplace, 'lab5_union_vector_after_replace');
    document.getElementById('lab5_duclicates_count').innerText = dublicatesCount;
}

function replaceDublicatesOnInfinity(sourceVector, resultVector) {
    // прохожу по всему массиву и считаю число всех элементов
    // потом удаляю те, у которых оно больше 1
    let dublicates = {};
    // поиск количества элементов
    sourceVector.forEach(item => {
        dublicates[item] = (dublicates.hasOwnProperty(item) ? dublicates[item] + 1 : 1);
    });

    // замещение повторений и их подсчёт
    let count = 0;
    sourceVector.forEach(item => {
        if (dublicates[item] > 1) {
            item = Infinity;
            count++;
        }
        resultVector.push(item);
    });
    return count;
}

function addUnionNotIncludedRowsVectorOnSite(unionVector, resultTableId) {
    let tableOnSite = document.getElementById(resultTableId);
    tableOnSite.innerHTML = "";
    if (unionVector.length === 0) {
        tableOnSite.innerText = "Пусто, так как в матрицах нет строк, не включающих друг друга";
    } else {
        let tbody = document.createElement('tbody');
        let tr = tbody.appendChild(document.createElement('tr'));
        tr.appendChild(document.createElement('td')).innerText = '(';
        unionVector.forEach(item => tr.appendChild(document.createElement('td')).innerText = (item !== Infinity) ? item : '∞');
        tr.appendChild(document.createElement('td')).innerText = ')';

        tbody.appendChild(tr);
        tableOnSite.appendChild(tbody);
    }
}

function getUnionNotIncludeRowsVector(rowPairs) {
    let result = [];
    rowPairs.forEach(pair => result = result.concat(pair.m1Row.concat(pair.m2Row)));
    return result;
}

function addNotIncludedPairsOnSite(rowPairs) {
    let tableOnSite = document.getElementById("lab5_unincluded_rows");
    tableOnSite.innerHTML = "";
    if (rowPairs.length === 0) {
        tableOnSite.innerText = "В матрицах нет строк, не включающих друг друга";
    } else {
        // создание заголовков таблицы
        let thead = document.createElement('thead');
        thead.appendChild(document.createElement('th')).innerText = 'Матрица';
        thead.appendChild(document.createElement('th')).innerText = 'Строка';
        thead.appendChild(document.createElement('th')).innerText = 'Индекс строки';
        tableOnSite.appendChild(thead);

        let tbody = document.createElement('tbody');
        rowPairs.forEach(pair => {
            let addRow = (addedRow, elementToResult) => {
                let row = document.createElement('table');
                row.setAttribute('class', 'lab5_matrix_row');
                let tr = document.createElement('tr');
                tr.appendChild(document.createElement('td')).innerText = '(';
                addedRow.forEach(item => {
                    tr.appendChild(document.createElement('td')).innerText = item;
                });
                tr.appendChild(document.createElement('td')).innerText = ')';

                row.appendChild(tr);
                elementToResult.appendChild(document.createElement('td')).appendChild(row);
            };

            let tr1 = document.createElement('tr');
            tr1.appendChild(document.createElement('td')).innerText = 'M1';
            addRow(pair.m1Row, tr1);
            tr1.appendChild(document.createElement('td')).innerText = '[' + pair.m1RowIndex + ']';

            let tr2 = document.createElement('tr');
            tr2.appendChild(document.createElement('td')).innerText = 'M2';
            addRow(pair.m2Row, tr2);
            tr2.appendChild(document.createElement('td')).innerText = '[' + pair.m2RowIndex + ']';

            tbody.appendChild(tr1);
            tbody.appendChild(tr2);
            tbody.appendChild(document.createElement('br')); // пустая строка для красоты
        });
        tbody.removeChild(tbody.lastChild); // стирается последняя пустая строка

        tableOnSite.appendChild(tbody);
    }
}

function getAllPairsWithNotIncludeEachOtherRows(matrix1, matrix2) {
    let resultPairs = [];
    matrix1.forEach((row1, index1) => matrix2.forEach((row2, index2) => {
        if (checkVectorsOnInclude(row1, row2) === 3) {
            resultPairs.push({
                m1RowIndex: index1,
                m1Row: row1,
                m2RowIndex: index2,
                m2Row: row2
            });
        }
    }));
    return resultPairs;
}

function checkVectorsOnInclude(vector1, vector2) {
    // проверка на равенство
    if (vector1.join() === vector2.join())
        return 2
    else
        if (vector1.length === vector2.length) // если векторы не равны, но при этом
            return 3; // они имеют равную длину, то они точно не включают друг друга

    // проверка на включение одного вектора другим
    // так как меньший вектор точно не может включать больший,
    // то достаточно одной проверки с упорядочиванием
    let bigVector = vector1;
    let smallVector = vector2;
    let possibleResult = 0; // для учета порядка, в котором векторы пришли в параметры
    if (vector1.length < vector2.length) {
        bigVector = vector2;
        smallVector = vector1;
        possibleResult = 1;
    }

    // массив из первых элементов большого вектора без последних (smallVector.length - 1) элементов
    let startCheckingBase = bigVector.slice(0, bigVector.length - smallVector.length + 1);

    // начиная каждого элемента из startCheckingBase для всех его элементов выбирается
    // массив-маска длиной smallVector.length, которая сравнивается с вектором smallVector
    // после работы find оценивается результат поиска, если undefined, то "маска" пробежала
    // до конца и не совпала ни с одним подмассивом
    let firstIncludingIndex = startCheckingBase.find((item, index, vector) => {
        let movingMask = bigVector.slice(index, index + smallVector.length);
        return movingMask.join() == smallVector.join();
    });

    return (firstIncludingIndex !== undefined) ? possibleResult : 3;
}

function addMatrixOnSite(matrix, matrixNumber) {
    let tableOnSite = document.getElementById('lab5_matrix' + matrixNumber);
    // очистка старой матрицы (удаление tbody)
    tableOnSite.removeChild(tableOnSite.children[1]);

    let tbodyNew = document.createElement('tbody');
    matrix.forEach(row => {
        let tr = document.createElement('tr');
        row.forEach(item => {
            let td = document.createElement('td');
            td.innerText = item;
            tr.appendChild(td);
        });
        tbodyNew.appendChild(tr);
    });
    tableOnSite.appendChild(tbodyNew);
}

function generateMatrixWithRandomNumbers(rowsCount, colsCount, leftRandomBorder, rightRandomBorder) {
    // для задания начальной длины
    let resultMatrix = Array(rowsCount);

    // fill для начальной инициализации, чтобы работал forEach
    // так как переданный в него массив будет общим на всю матрицу, потом переназначаю его
    resultMatrix.fill([]);

    resultMatrix.forEach((row, rowIndex, matrix) => {
        // переназначение ссылки на общий элемент на новый, отдельный объект
        matrix[rowIndex] = Array(colsCount);

        // начальное заполнение для forEach
        matrix[rowIndex].fill(0);

        matrix[rowIndex].forEach((item, index, row) =>
            row[index] = Math.floor(leftRandomBorder + Math.random() * (rightRandomBorder - leftRandomBorder + 1)));
    });
    return resultMatrix;
}

function updateParametersOnSite(parameters) {
    document.getElementById('lab5_left_random_border').value = parameters.leftRandomBorder;
    document.getElementById('lab5_right_random_border').value = parameters.rightRandomBorder;
    document.getElementById('lab5_M1_N').value = parameters.m1_N;
    document.getElementById('lab5_M2_N').value = parameters.m2_N;
    document.getElementById('lab5_M1_M').value = parameters.m1_M;
    document.getElementById('lab5_M2_M').value = parameters.m2_M;
}

function getParametersForCalculate() {
    // параметры расчета по умолчанию
    // если не удастся прочесть данные c сайта, то соответствующие поля не изменятся
    let defaultParameters = {
        leftRandomBorder: 0,
        rightRandomBorder: 5,
        m1_N: 3,
        m1_M: 3,
        m2_N: 3,
        m2_M: 3
    };

    // чтение данных из полей
    let leftRandomBorder = parseInt(document.getElementById('lab5_left_random_border').value);
    let rightRandomBorder = parseInt(document.getElementById('lab5_right_random_border').value);
    let m1_N = parseInt(document.getElementById('lab5_M1_N').value);
    let m2_N = parseInt(document.getElementById('lab5_M2_N').value);
    let m1_M = parseInt(document.getElementById('lab5_M1_M').value);
    let m2_M = parseInt(document.getElementById('lab5_M2_M').value);

    // заполнение результата
    // если какое-то поле не прочиталось, то останется поле из пришедших параметров
    let getSizeValue = (readedSize, defaultSize) => (isNaN(readedSize) || readedSize === 0) ? defaultSize : Math.abs(readedSize);

    let readedParameters = {
        leftRandomBorder: (!isNaN(leftRandomBorder)) ? leftRandomBorder : defaultParameters.leftRandomBorder,
        rightRandomBorder: (!isNaN(rightRandomBorder)) ? rightRandomBorder : defaultParameters.rightRandomBorder,
        m1_N: getSizeValue(m1_N, defaultParameters.m1_N),
        m1_M: getSizeValue(m1_M, defaultParameters.m1_M),
        m2_N: getSizeValue(m2_N, defaultParameters.m2_N),
        m2_M: getSizeValue(m2_M, defaultParameters.m2_M)
    };

    // если левая граница диапазона случайных чисел меньше правой, то меняем местами
    if (readedParameters.leftRandomBorder > readedParameters.rightRandomBorder) {
        let t = readedParameters.leftRandomBorder;
        readedParameters.leftRandomBorder = readedParameters.rightRandomBorder;
        readedParameters.rightRandomBorder = t;
    }

    return readedParameters;
}