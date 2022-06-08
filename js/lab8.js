let objectsOnSite = [];

function butttonAddObjectClick() {
    addObjectToSite({});
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