let objectsOnSite = [];

function buttonAddObjectClick() {
    let creationFunctions = {
        circle: getCircle,
        rectangle: getRectangle,
        triangle: getTriangle
    };
    let type = document.querySelector("input[name='lab8_object_type']:checked").value;
    addObjectToSite(creationFunctions[type]());
}

function printFiguresActions() {
    getSelectedObjects().forEach(o => {
        console.log(`\tФигура: ${o.toString()}`);
        o.printActionsToConsole();
    });
}

function clearFiguresActions() {
    getSelectedObjects().forEach(o => o.clearRegisteredActions());
}

function moveFiguresOnVector() {
    [xMove, yMove] = [].map.call(document.querySelectorAll("input[id ^= 'lab8_vector_'"), i => parseFloat(i.value));
    getSelectedObjects().forEach(o => o.moveOnVector(xMove, yMove));
    refreshSelectedObjectsOnSite();
}

function rotateFiguresAroundPoint() {
    [xRotate, yRotate, angleDegree] = [].map.call(document.querySelectorAll("input[id ^= 'lab8_rotate_'"), i => parseFloat(i.value));
    getSelectedObjects().forEach(o => o.rotateOnAngleAroundPoint(xRotate, yRotate, angleDegree));
    refreshSelectedObjectsOnSite();
}

function getFiguresArea() {
    let result = "Площади выбранных фигур (по порядку):\n";
    getSelectedObjects().forEach(o => result += `${o.getArea()}\n`);
    alert(result);
}

function getFiguresPerimeter() {
    let result = "Периметры выбранных фигур (по порядку):\n";
    getSelectedObjects().forEach(o => result += `${o.getPerimeter()}\n`);
    alert(result);
}

function getCircle() {
    [xCenter, yCenter, radius] = [].map.call(document.querySelectorAll("input[id ^= 'lab8_circle_'"), i => parseFloat(i.value));
    return new Circle(xCenter, yCenter, radius);
}

function getRectangle() {
    [xLeftUp, yLeftUp, width, height] = [].map.call(document.querySelectorAll("input[id ^= 'lab8_rectangle_'"), i => parseFloat(i.value));
    return new Rectangle(xLeftUp, yLeftUp, width, height);
}

function getTriangle() {
    [x1, y1, x2, y2, x3, y3] = [].map.call(document.querySelectorAll("input[id ^= 'lab8_triangle_'"), i => parseFloat(i.value));
    return new Triangle(x1, y1, x2, y2, x3, y3);
}

function BaseObject() {
    this.registeredActions = [];
}
// для регистрации, очистки и вывода действий
BaseObject.prototype.clearRegisteredActions = function () { this.registeredActions = []; };
BaseObject.prototype.printActionsToConsole = function () { this.registeredActions.forEach(a => console.log(a.toString())); };
BaseObject.prototype.registerAnAction = function (action, args) {
    let currentDate = new Date();
    let callTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}.${currentDate.getMilliseconds()}`;
    let argsStr = (args.length > 0) ? [].join.call(args, " ") : "не переданы";

    this.registeredActions.push({
        action: action,
        callTime: callTime,
        args: argsStr,

        toString: function () { return `[Действие: ${this.action}\nВремя вызова: ${this.callTime}\nАргументы: ${this.args}]`; }
    });
}

function Shape() {
    BaseObject.call(this);

    this._points = [];

    Object.defineProperty(this, "points", {
        get() {
            return this._points;
        },

        set(value) {
            // проверка типов: вершины фигуры могут представляться только набором точек двумерного пространства с числовыми координатами
            // (массив массивов чисел длины 2)
            if (value instanceof Array && value.every(p => p instanceof Array && p.length === 2 && p.every(coord => isFinite(coord))))
                this._points = value;
        }
    });
}
Shape.prototype = Object.create(BaseObject.prototype);
Object.defineProperty(Shape.prototype, "constructor", {
    value: Shape,
    enumerable: false,
    writable: true,
    configurable: true
});

Shape.prototype.toString = function () {
    return `Вершины (x, y):\n${this._points.map((p, i) => `№${i + 1}: (${p[0]}, ${p[1]})\n`).join("")}`;
};

// общие методы фигур
Shape.prototype.moveOnVector = function (x, y) {
    this.registerAnAction("Перемещение", arguments);
    this._points.forEach((p, i, arr) => {
        arr[i][0] += x;
        arr[i][1] += y;
    });
};
Shape.prototype.rotateOnAngleAroundPoint = function (xRot, yRot, angleDegree) {
    this.registerAnAction("Поворот", arguments);
    angleInRadian = angleDegree * Math.PI / 180.0;
    this._points.forEach((p, i, arr) => {
        [x, y] = [p[0], p[1]];
        arr[i][0] = xRot + (x - xRot) * Math.cos(angleInRadian) - (y - yRot) * Math.sin(angleInRadian);
        arr[i][1] = yRot + (x - xRot) * Math.sin(angleInRadian) + (y - yRot) * Math.cos(angleInRadian);
    });
}
// площадь считаю по формуле Гаусса. Для точечно заданных на плоскости многоугольников, не пересекающих
// себя, она будет универсальной. Для других видов фигур (здесь - круг) можно переопределить
Shape.prototype.getArea = function () {
    this.registerAnAction("Площадь", arguments);
    let n = this._points.length;
    let sumAllWithoutLast = 0;
    for (let i = 0; i < n - 1; i++) {
        sumAllWithoutLast += (this._points[i][0] * this._points[i + 1][1] - this._points[i + 1][0] * this._points[i][1]);
    }
    sumAllWithoutLast += (this._points[n - 1][0] * this._points[0][1] - this._points[0][0] * this._points[n - 1][1]);
    return Math.abs(sumAllWithoutLast) / 2;
};
Shape.prototype.getPerimeter = function () {
    this.registerAnAction("Периметр", arguments);
    return this._points.reduce((perimeter, point, index, arr) => {
        // для первой точки в соответствие берется последняя, а для любой другой - предыдущая
        let secondPointIndex = (index != 0) ? index - 1 : arr.length - 1;
        let currentSideLength = Math.sqrt(Math.pow(point[0] - arr[secondPointIndex][0], 2) + Math.pow(point[1] - arr[secondPointIndex][1], 2));
        return perimeter + currentSideLength;
    }, 0);
};

function Circle(xCenter, yCenter, radius) {
    Shape.call(this);

    this.points = [[xCenter, yCenter]];
    this.radius = radius;
}
setRightPrototypeAndConstructor(Circle);
// в круге дополнительно переопределяю методы из Shape, которые для него неприменимы
Circle.prototype.getArea = function () {
    this.registerAnAction("Площадь", arguments);
    return Math.PI * this.radius * this.radius
};
Circle.prototype.getPerimeter = function () {
    this.registerAnAction("Периметр", arguments);
    return 2 * Math.PI * this.radius;
};
Circle.prototype.toString = function () {
    return `КРУГ\nРадиус: ${this.radius}\nЦентр (x, y): (${this.points[0][0]}, ${this.points[0][1]})`;
};

// направление осей координат декартово: положительное направление оси x - вправо, положительное направление оси y - вверх
function Rectangle(xLeftUp, yLeftUp, width, height) {
    Shape.call(this);

    this.points = [
        [xLeftUp, yLeftUp],
        [xLeftUp + width, yLeftUp],
        [xLeftUp + width, yLeftUp - height],
        [xLeftUp, yLeftUp - height]
    ];
}
setRightPrototypeAndConstructor(Rectangle);
Rectangle.prototype.toString = function () {
    return "ПРЯМОУГОЛЬНИК\n" + Object.getPrototypeOf(Object.getPrototypeOf(this)).toString.call(this);
};

function Triangle(x1, y1, x2, y2, x3, y3) {
    Shape.call(this);

    this.points = [
        [x1, y1],
        [x2, y2],
        [x3, y3]
    ];
}
setRightPrototypeAndConstructor(Triangle);
Triangle.prototype.toString = function () {
    return "ТРЕУГОЛЬНИК\n" + Object.getPrototypeOf(Object.getPrototypeOf(this)).toString.call(this);
};

function setRightPrototypeAndConstructor(classConstructor) {
    classConstructor.prototype = Object.create(Shape.prototype);
    Object.defineProperty(classConstructor.prototype, "constructor", {
        value: classConstructor,
        enumerable: false,
        writable: true,
        configurable: true
    });
}

function addObjectToSite(obj) {
    let getId = (value) => `lab8_figure_${value}`;

    objectsOnSite.push(obj); // добавление на сайт

    // для выделения объекта вместе с другими
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", getId(objectsOnSite.length));

    let divWithFigure = document.createElement("div");
    divWithFigure.style.display = "table-cell";
    divWithFigure.style.border = "solid";
    divWithFigure.style.margin = "5px";
    divWithFigure.style.padding = "3px";
    divWithFigure.appendChild(document.createElement("td")).appendChild(checkBox);

    let objLabel = divWithFigure.appendChild(document.createElement("td")).appendChild(document.createElement("label"))
    objLabel.setAttribute("for", getId(objectsOnSite.length));
    objLabel.innerText = obj.toString();

    document.getElementById("lab8_objects_div").appendChild(divWithFigure);
}

function getSelectedObjects() {
    let allSelectedObjectsIndexes = [].map.call(document.querySelectorAll("input[id ^= 'lab8_figure_']:checked"), e => parseInt(e.id.slice('lab8_figure_'.length)) - 1);
    return allSelectedObjectsIndexes.map(i => objectsOnSite[i]);
}

function refreshSelectedObjectsOnSite() {
    let allSelectedObjectsId = [].map.call(document.querySelectorAll("input[id ^= 'lab8_figure_']:checked"), e => e.id);
    let allSelectedObjectsIndexes = allSelectedObjectsId.map(e => parseInt(e.slice('lab8_figure_'.length)) - 1);

    // получаю все id у нажатых checkbox для объектов, выделяю индексы, а потом обновляю напрямую по ним на сайте новыми данными
    allSelectedObjectsId.forEach((id, index) => document.querySelector(`label[for = '${id}'`).innerText = objectsOnSite[allSelectedObjectsIndexes[index]]);
}