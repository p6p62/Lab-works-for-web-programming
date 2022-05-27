function calculateButtonClick() {
    // получение параметров для расчёта
    let parameters = getCalculationParameters();

    // получение функции для расчёта
    let configuredFunction = getSpecifiedFunction();
}

function getSpecifiedFunction() {
    let functionNumberStr = document.querySelector('input[name="lab7_function_number"]:checked').value;
    let isMemoized = document.getElementById('lab7_checkbox_memoized').checked;
    let isDebugging = document.getElementById('lab7_checkbox_for_debug').checked;
    let isCallSaved = document.getElementById('lab7_checkbox_save_calls').checked;

    let f = getSelectedFunction(functionNumberStr);

    // если была задана отладка
    if (isDebugging)
        f = makeDebugging(f);
    return f;
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
        return result;
    }
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