function createResultForLab5() {
    // ошибочные значения параметров заменятся значениями по умолчанию
    // поэтому происходит обновление после ввода
    let calcParams = getParametersForCalculate();
    updateParametersOnSite(calcParams);

    // создание матриц M1 и M2
    let m1 = generateMatrixWithRandomNumbers(calcParams.m1_N, calcParams.m1_M, calcParams.leftRandomBorder, calcParams.rightRandomBorder);
    let m2 = generateMatrixWithRandomNumbers(calcParams.m2_N, calcParams.m2_M, calcParams.leftRandomBorder, calcParams.rightRandomBorder);
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
            row[index] = parseInt(leftRandomBorder + Math.random() * (rightRandomBorder - leftRandomBorder + 1)));
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