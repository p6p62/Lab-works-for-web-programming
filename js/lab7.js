var functionOnPage = null;

function calculateButtonClick() {
    // получение параметров для расчёта
    let parameters = getCalculationParameters();

    // получение функции для расчёта
    let configuredFunction = getSpecifiedFunction();

    // сохранение настроенной функции
    functionOnPage = configuredFunction;

    // расчёт значений функции по равноотстоящим точкам
    let functionCalculatingResult = calculateFunctionInPoints(configuredFunction, parameters.a, parameters.b, parameters.h);

    // вывод на сайт
    printTabulatingResult(document.getElementById("lab7_function_calculate_result"), functionCalculatingResult);
}

function getSpecifiedFunction() {
    let functionNumberStr = document.querySelector('input[name="lab7_function_number"]:checked').value;
    let isMemoized = document.getElementById('lab7_checkbox_memoized').checked;
    let isDebugging = document.getElementById('lab7_checkbox_for_debug').checked;
    let isCallSaved = document.getElementById('lab7_checkbox_save_calls').checked;

    let f = getSelectedFunction(functionNumberStr);

    // Если isNeedWrap истинно, возвращает функцию wrappedF, обёрнутую оборачивающей
    // функцией wrappingFunction, "поднимая" при этом все собственные методы и свойства
    // wrappedF, чтобы они были доступны в возвращаемой функции
    // Если isNeedWrap ложно, то возвращает исходную функцию wrappedF
    let getWrapFunction = (wrappedF, wrappingFunction, isNeedWrap) => {
        let result = wrappedF;
        if (isNeedWrap) {
            result = wrappingFunction(wrappedF);
            Object.keys(wrappedF).forEach(key => result[key] = wrappedF[key]);
        }
        return result;
    };

    f = getWrapFunction(f, makeMemoized, isMemoized);
    f = getWrapFunction(f, makeDebugging, isDebugging);
    f = getWrapFunction(f, makeCallSaved, isCallSaved);

    return f;
}

function makeMemoized(f) {
    var cache = {};
    var memoizedF = function () {
        let key = arguments.length + ':' + [].join.call(arguments, ' ');
        cache[key] = f.apply(null, arguments);
        return cache[key];
    };
    memoizedF.getCacheSize = () => Object.keys(cache).length;
    memoizedF.getCachedValue = (index) => {
        let firstArgNum = (argsStr) => parseFloat(argsStr.slice(argsStr.indexOf(':') + 1).split(' ')[0]);
        let sortedCachedArgs = Object.keys(cache).sort((a, b) => {
            return firstArgNum(a) - firstArgNum(b);
        });

        let resultCachedArg = sortedCachedArgs[index];
        let cachedArgValue = firstArgNum(resultCachedArg);
        return [cachedArgValue, cache[resultCachedArg]]; // массив из 2 чисел "[аргумент, значение]"
    }
    return memoizedF;
}

function makeDebugging(f) {
    return function () {
        let currentDate = new Date();
        console.log("Время вызова: " + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + '.' + currentDate.getMilliseconds());

        let argsStr = (arguments.length > 0) ? arguments[0] : "не переданы";
        for (let i = 1; i < arguments.length; i++)
            argsStr += " " + arguments[i];
        console.log("Аргумент(ы): " + argsStr);

        let result = f.apply(null, arguments);
        console.log("Значение: " + result);
        console.log("");
        return result;
    }
}

function makeCallSaved(f) {
    var callCount = 0;
    let callSavedF = function () {
        callCount++;
        return f.apply(null, arguments);
    };
    callSavedF.resetCallCount = () => callCount = 0;
    callSavedF.getCallCount = () => callCount;
    return callSavedF;
}

function getSelectedFunction(functionNumberStr) {
    if (functionNumberStr === '1')
        return f1;
    if (functionNumberStr === '2')
        return f2;
    if (functionNumberStr === '3')
        return f3;
}

function f1(x) {
    return (Math.pow(x, 3) + 2 * x) / (4 * Math.sin(4 * x)) + Math.pow(Math.tan(4 * x), 3);
}

function f2(x) {
    return Math.pow(Math.sin(x), 2) - Math.abs(Math.log(x) + Math.exp(x)) / 4;
}

function f3(x) {
    return Math.sqrt(Math.pow(x, 3) + 6 * x) / (Math.pow(x, 5) - 4 * x);
}

function calculateFunctionInPoints(f, a, b, h) {
    let result = { args: [], results: [] };
    while (a < b) {
        result.args.push(a);
        result.results.push(f(a));
        a += h;
    }
    return result;
}

function makeSingleCalculate() {
    const accuracy = 3;
    let xFromSite = parseFloat(document.getElementById("lab7_one_call_arg").value);
    let result = (functionOnPage != null) ? functionOnPage(xFromSite) : NaN;
    document.getElementById("lab7_one_call_result").value = numberToStringByAccuracy(result, accuracy);
}

function getMemoizedValuesCount() {
    if (!("getCachedValue" in functionOnPage)) {
        alert("Мемоизация не включена");
        return;
    }
    alert('Число предрасчитанных значений: ' + functionOnPage.getCacheSize());
}

function getCachedValueByIndex() {
    let index = parseInt(document.getElementById("lab7_cache_index").value);
    if (isNaN(index))
        index = 0;

    if (!("getCachedValue" in functionOnPage)) {
        alert("Мемоизация не включена");
        return;
    }

    if (functionOnPage.getCacheSize() === 0) {
        alert("Предрасчитанных значений нет");
        return;
    }

    if (index >= functionOnPage.getCacheSize())
        index = functionOnPage.getCacheSize() - 1;
    else
        if (index < 0)
            index = 0;
    document.getElementById("lab7_cache_index").value = index;

    let cacheRecord = functionOnPage.getCachedValue(index);

    let arg = cacheRecord[0].toString();
    let value = (!isNaN(cacheRecord[1])) ? cacheRecord[1].toString() : "Расчёт невозможен";
    alert(`Сохранённое значение с индексом ${index}:\nx = ${arg}\nf(x) = ${value}`);
}

function getCallCount() {
    if (!("getCallCount" in functionOnPage)) {
        alert("Сохранение числа вызовов не включено");
    }
    alert('Количество вызовов: ' + functionOnPage.getCallCount());
}

function resetCallCount() {
    if (!("resetCallCount" in functionOnPage)) {
        alert("Сохранение числа вызовов не включено");
    }
    functionOnPage.resetCallCount();
    alert("Сброшено!");
}

function printTabulatingResult(divForResult, calculatingFunctionResult) {
    const accuracy = 3; // точность (число знаков после запятой в числах)

    divForResult.innerHTML = "";

    // создание каркаса таблицы
    tableWithResult = document.createElement("table");
    tableHeader = document.createElement("thead");
    tableBody = document.createElement("tbody");

    // заполнение заголовка таблицы
    xHeader = document.createElement("th");
    xHeader.innerText = "x";
    fHeader = document.createElement("th");
    fHeader.innerText = "f(x)";
    tableHeader.appendChild(xHeader);
    tableHeader.appendChild(fHeader);

    // заполнение тела таблицы
    for (let i = 0; i < calculatingFunctionResult.args.length; i++) {
        tableRow = document.createElement("tr");

        xCell = document.createElement("td");
        fCell = document.createElement("td");
        xCell.innerText = numberToStringByAccuracy(calculatingFunctionResult.args[i], accuracy);
        fCell.innerText = numberToStringByAccuracy(calculatingFunctionResult.results[i], accuracy);
        tableRow.appendChild(xCell);
        tableRow.appendChild(fCell);

        tableBody.appendChild(tableRow);
    }

    // заполнение всего блока таблицы и добавление к div-контейнеру
    tableWithResult.appendChild(tableHeader);
    tableWithResult.appendChild(tableBody);
    divForResult.appendChild(tableWithResult);
}

function numberToStringByAccuracy(numberValue, accuracy) {
    if (!isFinite(numberValue))
        return 'Расчет невозможен';
    let numStrArr = numberValue.toString().split('.');
    if (numStrArr.length > 1 && accuracy > 0)
        return parseInt(numberValue).toString().concat('.').concat(numStrArr[1].substr(0, accuracy))
    else
        return numStrArr[0];
}

function getCalculationParameters() {
    // параметры со значениями по умолчанию
    let parameters = {
        a: -3,
        b: 5,
        h: 0.5
    };

    let a = parseFloat(document.getElementById('lab7_calc_a').value);
    let b = parseFloat(document.getElementById('lab7_calc_b').value);
    let h = parseFloat(document.getElementById('lab7_calc_step').value);

    if (!isNaN(a))
        parameters.a = Math.min(a, b);

    if (!isNaN(b))
        parameters.b = Math.max(a, b);

    if (!isNaN(h) && h != 0)
        parameters.h = Math.abs(h);

    rewriteParametersOnSite(parameters);
    return parameters;
}

function rewriteParametersOnSite(parameters) {
    document.getElementById('lab7_calc_a').value = parameters.a;
    document.getElementById('lab7_calc_b').value = parameters.b;
    document.getElementById('lab7_calc_step').value = parameters.h;
}