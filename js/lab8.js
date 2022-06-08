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
    return new Circle(1, 2, 5)
}

function getRectangle() {
    return new Rectangle();
}

function getTriangle() {
    return new Triangle();
}

function Shape() {
    this.registeredActions = [];
    this.clearRegisteredActions = () => this.registeredActions = [];
    this.printActionsToConsole = () => this.registeredActions.forEach(a => console.log(a));

    this._points = [];
    this.moveOnVector = (x, y) => this._points.forEach((p, i, arr) => {
        arr[i][0] += x;
        arr[i][1] += y;
    });
    this.rotateOnAngleAroundPoint = (xRot, yRot, angleDegree) => {
        angleInRadian = angleDegree * Math.PI / 180.0;
        this._points.forEach((p, i, arr) => {
            arr[i][0] = (p[0] - xRor) * Math.cos(angleInRadian) - (p[1] - yRot) * Math.sin(angleInRadian);
            arr[i][1] = (p[0] - xRot) * Math.sin(angleInRadian) + (p[1] - yRot) * Math.cos(angleInRadian);
        });
    }
    this.getArea;
    this.getPerimeter = () => this._points.reduce((perimeter, point, index, arr) => {
        // для первой точки в соответствие берется последняя, а для любой другой - предыдущая
        let secondPointIndex = (index != 0) ? index - 1 : arr.length - 1;
        let currentSideLength = Math.sqrt(Math.pow(point[0] - arr[secondPointIndex][0], 2) + Math.pow(point[1] - arr[secondPointIndex][1], 2));
        return perimeter + currentSideLength;
    }, 0);
}

function Circle(xCenter, yCenter, radius) {
    Object.setPrototypeOf(this, new Shape());

    Object.getPrototypeOf(this)._points.push([xCenter, yCenter]);
    this.radius = radius;
}

function Rectangle(xLeftUp, yLeftUp, length, width) {
    Object.setPrototypeOf(this, new Shape());
}

function Triangle(x1, y1, x2, y2, x3, y3) {
    Object.setPrototypeOf(this, new Shape());
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