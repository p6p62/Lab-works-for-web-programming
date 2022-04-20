function createDynamicTable(tableSize, divForResult) {
    var tableSizeNum = getRightSize(tableSize);
    var dynamicTableArray = getDynamicTableArray(tableSizeNum);
    addDynamicTableToSite(dynamicTableArray, divForResult);
}

function addDynamicTableToSite(dynamicTableArray, divForResult) {
    divForResult.innerHTML = "";

    // создание каркаса таблицы
    tableWithResult = document.createElement("table");
    tableHeader = document.createElement("thead");
    tableBody = document.createElement("tbody");

    // заполнение тела таблицы
    for (let row = 0; row < dynamicTableArray.length; row++) {
        tableRow = document.createElement("tr");
        for (let col = 0; col < dynamicTableArray[row].length; col++) {
            tableRowCell = document.createElement("td");

            let valueFromTable = dynamicTableArray[row][col];
            if (valueFromTable != undefined)
                tableRowCell.innerText = valueFromTable;
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
    // создание каркаса двумерного массива
    var dynamicTable = Array(tableSizeNumber);
    for (let i = 0; i < tableSizeNumber; i++)
        dynamicTable[i] = Array(tableSizeNumber);

    // заполнение таблицы данными
    for (let i = 0; i < tableSizeNumber / 2; i++) {
        // элемент главной диагонали, направление сверху вниз
        dynamicTable[i][i] = i + 1;

        // элемент побочной диагонали, направление сверху вниз
        dynamicTable[i][tableSizeNumber - i - 1] = i + 1;

        // элемент побочной диагонали, направление снизу вверх
        dynamicTable[tableSizeNumber - i - 1][i] = tableSizeNumber - i;

        // элемент главной диагонали, направление снизу вверх
        dynamicTable[tableSizeNumber - i - 1][tableSizeNumber - i - 1] = tableSizeNumber - i;

        // заполнение промежуточных элементов
        for (let j = i + 1; j < tableSizeNumber - i - 1; j++) {
            dynamicTable[i][j] = i + 2; // сверху
            dynamicTable[tableSizeNumber - i - 1][j] = tableSizeNumber - i - 1; // снизу
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