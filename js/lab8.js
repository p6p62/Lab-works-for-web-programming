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

function Shape() {
    this._points = [];
}
// для регистрации, очистки и вывода действий
// (!) свойство специально сделал в прототипе, так как посчитал, что по заданию класс должен знать о всех действиях с производными объектами
Shape.prototype.registeredActions = [];
Shape.prototype.clearRegisteredActions = () => Shape.prototype.registeredActions = [];
Shape.prototype.printActionsToConsole = () => Shape.prototype.registeredActions.forEach(a => console.log(a));

// общие методы фигур
Shape.prototype.moveOnVector = (x, y) => this._points.forEach((p, i, arr) => {
    arr[i][0] += x;
    arr[i][1] += y;
});
Shape.prototype.rotateOnAngleAroundPoint = (xRot, yRot, angleDegree) => {
    angleInRadian = angleDegree * Math.PI / 180.0;
    this._points.forEach((p, i, arr) => {
        arr[i][0] = (p[0] - xRor) * Math.cos(angleInRadian) - (p[1] - yRot) * Math.sin(angleInRadian);
        arr[i][1] = (p[0] - xRot) * Math.sin(angleInRadian) + (p[1] - yRot) * Math.cos(angleInRadian);
    });
}
// площадь считаю по формуле Гаусса. Для точечно заданных на плоскости многоугольников, не пересекающих
// себя, она будет универсальной. Для других видов фигур (здесь - круг) можно переопределить
Shape.prototype.getArea = () => {
    let n = this._points.length;
    let sumAllWithoutLast = 0;
    for (let i = 0; i < n - 1; i++) {
        sumAllWithoutLast += (this._points[i][0] * this._points[i + 1][1] - this._points[i + 1][0] * this._points[i][1]);
    }
    sumAllWithoutLast += (this._points[n - 1][0] * this._points[0][1] - this._points[0][0] * this._points[n - 1][1]);
    return Math.abs(sumAllWithoutLast) / 2;
};
Shape.prototype.getPerimeter = () => this._points.reduce((perimeter, point, index, arr) => {
    // для первой точки в соответствие берется последняя, а для любой другой - предыдущая
    let secondPointIndex = (index != 0) ? index - 1 : arr.length - 1;
    let currentSideLength = Math.sqrt(Math.pow(point[0] - arr[secondPointIndex][0], 2) + Math.pow(point[1] - arr[secondPointIndex][1], 2));
    return perimeter + currentSideLength;
}, 0);

function Circle(xCenter, yCenter, radius) {
    Shape.call(this);

    this._points.push([xCenter, yCenter]);
    this.radius = radius;
}
setRightPrototypeAndConstructor(Circle);
// в круге дополнительно переопределяю методы из Shape, которые для него неприменимы
Circle.prototype.getArea = () => Math.PI * this.radius * this.radius;
Circle.prototype.getPerimeter = () => 2 * Math.PI * this.radius;

// направление осей координат декартово: положительное направление оси x - вправо, положительное направление оси y - вверх
function Rectangle(xLeftUp, yLeftUp, width, height) {
    Shape.call(this);

    this._points.push(
        [xLeftUp, yLeftUp],
        [xLeftUp + width, yLeftUp],
        [xLeftUp + width, yLeftUp - height],
        [xLeftUp, yLeftUp - height]
    );
}
setRightPrototypeAndConstructor(Rectangle);

function Triangle(x1, y1, x2, y2, x3, y3) {
    Shape.call(this);

    this._points.push(
        [x1, y1],
        [x2, y2],
        [x3, y3]
    );
}
setRightPrototypeAndConstructor(Triangle);

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
    objectsOnSite.push(obj); // добавление на сайт

    // для выделения объекта вместе с другими
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", objectsOnSite.length);

    let tr = document.createElement("tr");
    tr.appendChild(document.createElement("td")).appendChild(checkBox);
    // TODO вывод типа
    // TODO вывод координат и свойств

    document.getElementById("lab8_objects_table_body").appendChild(tr);
}