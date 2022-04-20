var tableArrayOnPage = null;

function createDynamicTable(tableSize, divForResult) {
    var tableSizeNum = getRightSize(tableSize);
    var dynamicTableArray = getDynamicTableArray(tableSizeNum);
    tableArrayOnPage = dynamicTableArray;
    addDynamicTableToSite(dynamicTableArray, divForResult);
}

function action1CollumnsDelete(cutoffByNumbersProduct, divForResult) {
    let cutoffNum = parseFloat(cutoffByNumbersProduct);
    if (isNaN(cutoffNum))
        return;
    if (tableArrayOnPage === null || tableArrayOnPage === undefined)
        return;

    // поиск произведений столбцов
    let colProducts = Array(tableArrayOnPage.length);
    for (let col = 0; col < tableArrayOnPage.length; col++) {
        colProducts[col] = 1;
        for (let row = 0; row < tableArrayOnPage.length; row++) {
            let tableCellObj = tableArrayOnPage[row][col];
            if (tableCellObj !== undefined) {
                colProducts[col] *= tableCellObj.cellNumber;
            }
        }
    }

    // удаление столбцов с произведением элементов меньше cutoffNum
    for (let col = 0; col < tableArrayOnPage.length; col++) {
        if (colProducts[col] < cutoffNum)
            for (let row = 0; row < tableArrayOnPage.length; row++)
                delete tableArrayOnPage[row][col];
    }

    // перерисовка таблицы
    addDynamicTableToSite(tableArrayOnPage, divForResult);
}

function action2CalcAverageOrAllCount(divForResult) {
    if (tableArrayOnPage === null || tableArrayOnPage === undefined)
        return;
    // определение типа расчёта
    let isAllCount = document.getElementById('button_all_count').checked;

    // расчет чисел для заполнения
    let averageValue = 0;
    let allCount = 0;
    for (let i = 0; i < tableArrayOnPage.length; i++)
        for (let j = 0; j < tableArrayOnPage[i].length; j++) {
            let tableCellObj = tableArrayOnPage[i][j];
            if (tableCellObj !== undefined) {
                averageValue += tableCellObj.cellNumber;
                allCount++;
            }
        }
    averageValue /= allCount;

    // установка нужного числа в красные ячейки
    for (let i = 0; i < tableArrayOnPage.length; i++)
        for (let j = 0; j < tableArrayOnPage[i].length; j++) {
            let tableCellObj = tableArrayOnPage[i][j];
            if (tableCellObj !== undefined) {
                if (tableCellObj.cellColor === 'red')
                    tableCellObj.cellNumber = (isAllCount) ? allCount : averageValue;
            }
        }

    // перерисовка таблицы
    addDynamicTableToSite(tableArrayOnPage, divForResult);
}

function addDynamicTableToSite(dynamicTableArray, divForResult) {
    divForResult.innerHTML = "";

    // создание каркаса таблицы
    tableWithResult = document.createElement("table");
    tableHeader = document.createElement("thead");
    tableBody = document.createElement("tbody");

    // отключение отступов
    tableWithResult.style['border-collapse'] = 'collapse';

    // заполнение тела таблицы
    for (let row = 0; row < dynamicTableArray.length; row++) {
        tableRow = document.createElement("tr");
        for (let col = 0; col < dynamicTableArray[row].length; col++) {
            tableRowCell = document.createElement("td");

            let cellFromTable = dynamicTableArray[row][col];
            if (cellFromTable != undefined) {
                let cellNumber = cellFromTable.cellNumber;
                let cellColor = cellFromTable.cellColor;
                tableRowCell.innerText = cellNumber;
                tableRowCell.style['background-color'] = cellColor;
            }

            tableRow.appendChild(tableRowCell);
        }
        tableBody.appendChild(tableRow);
    }
    tableWithResult.appendChild(tableHeader);
    tableWithResult.appendChild(tableBody);

    // добавление таблицы на сайт
    divForResult.appendChild(tableWithResult);
}

function getDynamicTableArray(tableSizeNumber) {
    const DIAGONAL_CELL_COLOR = 'cyan';
    const OTHER_CELL_COLOR = 'red';

    // создание каркаса двумерного массива
    var dynamicTable = Array(tableSizeNumber);
    for (let i = 0; i < tableSizeNumber; i++)
        dynamicTable[i] = Array(tableSizeNumber);

    // заполнение таблицы данными
    for (let i = 0; i < tableSizeNumber / 2; i++) {
        // элемент главной диагонали, направление сверху вниз
        let elem1 = { cellNumber: i + 1, cellColor: DIAGONAL_CELL_COLOR };
        dynamicTable[i][i] = elem1;

        // элемент побочной диагонали, направление сверху вниз
        let elem2 = { cellNumber: i + 1, cellColor: DIAGONAL_CELL_COLOR };
        dynamicTable[i][tableSizeNumber - i - 1] = elem2;

        // элемент побочной диагонали, направление снизу вверх
        let elem3 = { cellNumber: tableSizeNumber - i, cellColor: DIAGONAL_CELL_COLOR };
        dynamicTable[tableSizeNumber - i - 1][i] = elem3;

        // элемент главной диагонали, направление снизу вверх
        let elem4 = { cellNumber: tableSizeNumber - i, cellColor: DIAGONAL_CELL_COLOR };
        dynamicTable[tableSizeNumber - i - 1][tableSizeNumber - i - 1] = elem4;

        // заполнение промежуточных элементов
        for (let j = i + 1; j < tableSizeNumber - i - 1; j++) {
            let elemUp = { cellNumber: i + 2, cellColor: OTHER_CELL_COLOR };
            dynamicTable[i][j] = elemUp; // сверху

            let elemDown = { cellNumber: tableSizeNumber - i - 1, cellColor: OTHER_CELL_COLOR }
            dynamicTable[tableSizeNumber - i - 1][j] = elemDown; // снизу
        }
    }

    return dynamicTable;
}

function getRightSize(tableSize) {
    const DEFAULT_VALUE = 6;
    var sizeInputField = document.getElementById("lab4_table_size");
    var numSize = parseInt(tableSize);

    if (isNaN(numSize))
        numSize = DEFAULT_VALUE;
    if (numSize < 1) {
        numSize = 1
    } else {
        if (numSize > 50)
            numSize = 50;
    }
    sizeInputField.value = numSize;
    return numSize;
}