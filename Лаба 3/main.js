function calculatingFunction(x, y, aValue, nm1Value, nm2Value) {
    var functionValue;

    if (Math.abs(x) <= aValue) {
        functionValue = 0;

        let powerValue = x;
        let factorialValue = 1;
        for (let n = 1; n <= nm1Value; n++) {
            let addedValue = (powerValue + factorialValue) / (y * n) * ((n % 2 === 1) ? -1 : 1);
            functionValue += addedValue;

            powerValue *= x;
            factorialValue *= (n+1);
        }
    } else {
        functionValue = 1;

        let sinValue = Math.pow(Math.sin(x), 2);
        let powerValue = x * x;
        for (let n = 1; n <= nm2Value; n++) {
            let multipliedValue = sinValue + Math.pow(Math.cos(y * powerValue + 1), 3);
            functionValue *= multipliedValue;

            powerValue *= x;
        }
    }

    return functionValue;
}

/**
 * 
 * @param {Массив строк с параметрами табулирования функции. Порядок значений:
 * x0, xn, y0, yn, step, a, nm1, nm2} parametersArray 
 */
function tabulate(parametersArray) {
    var divForResult = document.getElementById("tabResult");

    // чтение данных
    var tabParametersValues = getParsedParameters(parametersArray);
    if (tabParametersValues === null) {
        divForResult.innerText = "Проверь заполнение значений параметров табуляции!\n";
        return;
    }
    
    var xStart = tabParametersValues[0];
    var xEnd = tabParametersValues[1];
    var yStart = tabParametersValues[2];
    var yEnd = tabParametersValues[3];
    var step = tabParametersValues[4];
    var aValue = tabParametersValues[5];
    var nm1Value = tabParametersValues[6];
    var nm2Value = tabParametersValues[7];

    // проверка данных
    var errorMessage = checkTabParameters(xStart, xEnd, yStart, yEnd, step, aValue, nm1Value, nm2Value);
    if (errorMessage.length > 0) {
        divForResult.innerText = errorMessage;
        return;
    }

    // вызов табуляции
    var tabulatingResult = getTableWithResults(xStart, xEnd, yStart, yEnd, step, aValue, nm1Value, nm2Value);
    console.log(tabulatingResult);

    // печать ответа
    printTabulatingResult(divForResult, tabulatingResult);
}

function printTabulatingResult(divForResult, tabulatingResultTable) {
    divForResult.innerHTML = "";

    // создание каркаса таблицы
    tableWithResult = document.createElement("table");
    tableHeader = document.createElement("thead");
    tableBody = document.createElement("tbody");

    // заполнение заголовка таблицы
    xHeader = document.createElement("th");
    xHeader.innerText = "x";
    yHeader = document.createElement("th");
    yHeader.innerText = "y";
    fHeader = document.createElement("th");
    fHeader.innerText = "f(x, y)";
    tableHeader.appendChild(xHeader);
    tableHeader.appendChild(yHeader);
    tableHeader.appendChild(fHeader);

    // заполнение тела таблицы
    let max = tabulatingResultTable[0][2];
    let min = max;
    for (let i = 0; i < tabulatingResultTable.length; i++) {
        if (max < tabulatingResultTable[i][2]) {
            max = tabulatingResultTable[i][2];
        }

        if (min > tabulatingResultTable[i][2]) {
            min = tabulatingResultTable[i][2];
        }

        tableRow = document.createElement("tr");
        
        xCell = document.createElement("td");
        yCell = document.createElement("td");
        fCell = document.createElement("td");
        xCell.innerText = tabulatingResultTable[i][0];
        yCell.innerText = tabulatingResultTable[i][1];
        fCell.innerText = tabulatingResultTable[i][2];
        tableRow.appendChild(xCell);
        tableRow.appendChild(yCell);
        tableRow.appendChild(fCell);

        tableBody.appendChild(tableRow);
    }

    divForResult.innerText = "Максимальное значение функции: " + max + '\n';
    divForResult.innerText += "Максимальное значение функции: " + min;

    // заполнение всего блока таблицы и добавление к div-контейнеру
    tableWithResult.appendChild(tableHeader);
    tableWithResult.appendChild(tableBody);
    divForResult.appendChild(tableWithResult);
}

function getTableWithResults(xStart, xEnd, yStart, yEnd, step, aValue, nm1Value, nm2Value) {
    // число различных значений по X, умноженное на число различных значений Y
    var rowsCount = (Math.floor((xEnd - xStart) / step) + 1) * (Math.floor((yEnd - yStart) / step) + 1);
    
    var resultTable = Array(rowsCount);
    for (let i = 0; i < resultTable.length; i++) {
        resultTable[i] = Array(3);
    }

    var rowIndex = 0;
    for (let x = xStart; x <= xEnd; x += step) {
        for (let y = yStart; y <= yEnd; y += step, rowIndex++) {
            resultTable[rowIndex][0] = x;
            resultTable[rowIndex][1] = y;
            resultTable[rowIndex][2] = calculatingFunction(x, y, aValue, nm1Value, nm2Value);
        }
    }

    return resultTable;
}

function checkTabParameters(xStart, xEnd, yStart, yEnd, step, aValue, nm1Value, nm2Value) {
    function nmValueCheck(nmV) {
        return (nmV >= 2 && nmV <= 6 && Number.isInteger(nmV));
    }

    if (xEnd - xStart <= 0 || yEnd - yStart <= 0 || step <= 0) {
        return "Табуляция невозможна, диапазоны аргументов или шаг имеют неверные значения!";
    }
    if (!nmValueCheck(nm1Value) || !nmValueCheck(nm2Value)) {
        return "Значения nm-параметров должны находиться в отрезке [2, 6] и быть целыми";
    }
    return "";
}

function getParsedParameters(stringTabParameters) {
    if (stringTabParameters.every(
        (item, index, array) => isFinite(parseFloat(item)) && item.length > 0)
    ) {
        // все числа
        var resultParsedParameters = Array(stringTabParameters.length);

        for (let i = 0; i < stringTabParameters.length; i++) {
            resultParsedParameters[i] = parseFloat(stringTabParameters[i]);
        }

        return resultParsedParameters;
    } else {
        // не все числа
        return null;
    }
}