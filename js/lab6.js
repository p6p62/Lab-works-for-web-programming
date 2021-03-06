var humansArrayOnPage;

function createHumans() {
    // чтение параметров генерации
    let parameters = getParameters();

    // перезапись параметров обратно (если вдруг были неверные)
    rewriteParametersOnSite(parameters);

    // создание объектов людей и добавление на сайт
    humansArrayOnPage = getHumansArray(parameters);
    addHumansOnSite(humansArrayOnPage);
}

function addInformationAboutLiveAddress() {
    if (humansArrayOnPage == null || humansArrayOnPage == undefined)
        return;

    let maskPhoneNumber = document.getElementById("lab6_phone_search_mask").value;
    let humansForAddressSetting = [];

    // определение режима установки адреса
    // если установка один раз - то функция поиска даст только 1 элемент, иначе массив всех подходящих
    let isOneSet = document.getElementsByName("radio_buttons_phone_search_mode")[0].checked;

    if (isOneSet) {
        humansForAddressSetting.push(humansArrayOnPage.find(element => element.phoneNumber.startsWith(maskPhoneNumber)));
    } else {
        humansArrayOnPage.filter(element => element.phoneNumber.startsWith(maskPhoneNumber)).forEach(element => humansForAddressSetting.push(element));
    }

    // чтение данных об адресе
    let city = document.getElementById("lab6_add_city").value;
    let street = document.getElementById("lab6_add_street").value;
    let houseNumber = parseInt(document.getElementById("lab6_add_house").value);
    let apartmentNumber = parseInt(document.getElementById("lab6_add_apartment").value);

    humansForAddressSetting.forEach(element => {
        element.liveAddress = new LiveAddress(city, street, houseNumber, apartmentNumber);
    });

    addHumansOnSite(humansArrayOnPage);
}

function deleteBirthDateByUpCuttingBorder() {
    if (humansArrayOnPage == null || humansArrayOnPage == undefined)
        return;
    let maxSavedYear = parseInt(document.getElementById("lab6_year_delete_border").value);
    humansArrayOnPage.forEach(element => {
        if (element.birthDate.year > maxSavedYear) {
            // можно было бы удалить всё свойство через delete, как в строке ниже, но тогда пришлось бы переделывать вывод, поэтому так
            // delete element.birthDate;

            delete element.birthDate.day;
            delete element.birthDate.month;
            delete element.birthDate.year;

            element.birthDate.toString = () => "";
        }
    });
    addHumansOnSite(humansArrayOnPage);
}

function filterHumans() {
    if (humansArrayOnPage == null || humansArrayOnPage == undefined)
        return;
    // чтение данных
    let strCity = document.getElementById("lab6_search_city").value;
    let floorStr = document.getElementById("lab6_search_floor").value;
    let leftYearStr = document.getElementById("lab6_year_range_left").value;
    let rightYearStr = document.getElementById("lab6_year_range_right").value;

    // если был задан город
    if (strCity != "") {
        humansArrayOnPage = humansArrayOnPage.filter(element => element.liveAddress.city == strCity);
    }

    // если был задан пол
    if (floorStr != "") {
        humansArrayOnPage = humansArrayOnPage.filter(element => element.isWoman.isWoman == (floorStr == "female"));
    }

    // если была задана одна из границ для года рождения
    if (leftYearStr != "") {
        humansArrayOnPage = humansArrayOnPage.filter(element => element.birthDate.year >= parseInt(leftYearStr));
    }
    if (rightYearStr != "") {
        humansArrayOnPage = humansArrayOnPage.filter(element => element.birthDate.year <= parseInt(rightYearStr));
    }

    addHumansOnSite(humansArrayOnPage);
}

function serializeToJSON() {
    if (humansArrayOnPage != null && humansArrayOnPage != undefined) {
        let jsonStr;
        if (document.getElementById("lab6_str_format_checkbox").checked) {
            jsonStr = JSON.stringify(humansArrayOnPage, null, "    ");
        } else {
            jsonStr = JSON.stringify(humansArrayOnPage);
        }
        document.getElementById("lab6_JSON_output").value = jsonStr;
    }
}

function loadFromJSON() {
    let jsonStr = document.getElementById("lab6_JSON_input").value;
    let parsedArray = JSON.parse(jsonStr);
    convertRawArrayToHumanArray(parsedArray);
    humansArrayOnPage = parsedArray;
    addHumansOnSite(humansArrayOnPage);
}

function convertRawArrayToHumanArray(parsedArray) {
    parsedArray.forEach(element => {
        element.fio.toString = (key) => key.lastName + ' ' + key.firstName + ' ' + key.patronymic;
        element.isWoman.toString = (key) => (key.isWoman) ? "Ж" : "М";
        element.birthDate.toString = (key) => {
            let strDate = key.day + '.' + ((('0' + key.month).length > 2) ? key.month : '0' + key.month) + '.' + key.year;
            if (strDate.includes("undefined"))
                strDate = "";
            return strDate;
        };
        element.liveAddress.toString = (key) => key.city + ', ул. ' + key.street + ', д. ' + key.houseNumber + ', кв. ' + key.apartmentNumber;
    });
}

function addHumansOnSite(humanArray) {
    let divForResult = document.getElementById("lab6_result");
    divForResult.innerHTML = "";

    // создание структуры таблицы с объектами
    let table = document.createElement("table");
    let thead = table.appendChild(document.createElement("thead"));
    let tbody = table.appendChild(document.createElement("tbody"));

    // заполнение заголовков
    let thFio = document.createElement("th");
    thFio.textContent = "ФИО";
    let thFloor = document.createElement("th");
    thFloor.textContent = "Пол";
    let thBirthDate = document.createElement("th");
    thBirthDate.textContent = "Дата рождения";
    let thPhoneNumber = document.createElement("th");
    thPhoneNumber.textContent = "Номер телефона";
    let thLiveAddress = document.createElement("th");
    thLiveAddress.textContent = "Адрес проживания";
    thead.appendChild(thFio);
    thead.appendChild(thFloor);
    thead.appendChild(thBirthDate);
    thead.appendChild(thPhoneNumber);
    thead.appendChild(thLiveAddress);

    // добавление людей в таблицу
    for (let i = 0; i < humanArray.length; i++) {
        let tr = tbody.appendChild(document.createElement("tr"));

        for (const key in humanArray[i]) {
            let td = tr.appendChild(document.createElement("td"));
            td.textContent = humanArray[i][key].toString(humanArray[i][key]);
        }
    }

    //добавление таблицы на сайт
    divForResult.appendChild(table);
}

function Human(fio, isWoman, birthDate, phoneNumber, liveAddress) {
    this.fio = fio;
    this.isWoman = isWoman;
    this.birthDate = birthDate;
    this.phoneNumber = phoneNumber;
    this.liveAddress = liveAddress;
}

function FIO(lastName, firstName, patronymic) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.patronymic = patronymic;

    this.toString = () => lastName + ' ' + firstName + ' ' + patronymic;
}

function BirthDate(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;

    this.toString = () => day + '.' + ((('0' + month).length > 2) ? month : '0' + month) + '.' + year;
}

function LiveAddress(city, street, houseNumber, apartmentNumber) {
    this.city = city;
    this.street = street;
    this.houseNumber = houseNumber;
    this.apartmentNumber = apartmentNumber;

    this.toString = () => city + ', ул. ' + street + ', д. ' + houseNumber + ', кв. ' + apartmentNumber;
}

function getFIORandom(isWoman) {
    let maleNames = ["Сергей", "Михаил", "Петр", "Александр", "Дмитрий"];
    let maleLastNames = ["Волков", "Петров", "Зайцев", "Иванов"];
    let malePatronymics = ["Александрович", "Семёнович", "Дмитриевич", "Константинович"];

    let femaleNames = ["Алла", "Анна", "Екатерина", "Виктория"];
    let femaleLastNames = ["Смирнова", "Котова", "Макарова"];
    let femalePatronymics = ["Александровна", "Сергеевна", "Константиновна", "Викторовна", "Николаевна"];

    let names, lastNames, patronymics;
    if (isWoman) {
        names = femaleNames;
        lastNames = femaleLastNames;
        patronymics = femalePatronymics;
    } else {
        names = maleNames;
        lastNames = maleLastNames;
        patronymics = malePatronymics;
    }

    return new FIO(getRandomElement(lastNames), getRandomElement(names), getRandomElement(patronymics));
}

function getBirthDateRandom(leftBorder, rightBorder) {
    let randTimeNumber = Math.floor((rightBorder.getTime() - leftBorder.getTime()) * Math.random() + 1) + leftBorder.getTime();
    let date = new Date();
    date.setTime(randTimeNumber);
    return new BirthDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
}

function getPhoneNumberRandom() {
    return "+79" + (Math.floor(Math.random() * 99999999) + 100000000);
}

function getLiveAddressRandom() {
    let cities = ["Рязань", "Москва", "Новосибирск", "Мурманск"];
    let streets = ["Щедрина", "Ленина", "Пушкина", "Гагарина"];

    const HOUSE_MAX_NUMBER = 100;
    const APARTMENT_MAX_NUMBER = 150;

    return new LiveAddress(getRandomElement(cities), getRandomElement(streets), Math.floor(Math.random() * HOUSE_MAX_NUMBER) + 1, Math.floor(Math.random() * APARTMENT_MAX_NUMBER) + 1);
}

function getHumansArray(parameters) {
    let humanArray = Array(parameters.peopleCount);
    for (let i = 0; i < parameters.peopleCount; i++) {
        let isWoman = Math.round(Math.random()) == 0; // случайное bool-значение
        humanArray[i] = new Human(
            getFIORandom(isWoman),
            {
                isWoman: isWoman,
                toString: () => (isWoman) ? "Ж" : "М"
            },
            getBirthDateRandom(parameters.leftBorderBirthDate, parameters.rightBorderBirthDate),
            getPhoneNumberRandom(),
            getLiveAddressRandom()
        );
    }
    return humanArray;
}

function rewriteParametersOnSite(parameters) {
    document.getElementById("lab6_people_count").value = parameters.peopleCount;
    document.getElementById("lab6_left_birth_date").value = parameters.leftBorderBirthDate.toISOString().substring(0, 10);
    document.getElementById("lab6_right_birth_date").value = parameters.rightBorderBirthDate.toISOString().substring(0, 10);
}

function getParameters() {
    let defaultParameters = {
        peopleCount: 5,
        leftBorderBirthDate: new Date(1960, 0, 1),
        rightBorderBirthDate: new Date(2021, 11, 31)
    }

    let peopleCountFromSite = parseInt(document.getElementById("lab6_people_count").value);
    if (Math.abs(peopleCountFromSite) > 0) {
        defaultParameters.peopleCount = Math.abs(peopleCountFromSite);
    }
    let leftBDateFromSite = new Date(document.getElementById("lab6_left_birth_date").value);
    let rightBDateFromSite = new Date(document.getElementById("lab6_right_birth_date").value);
    if (!isNaN(leftBDateFromSite.getTime()) && !isNaN(rightBDateFromSite.getTime())) {
        if (leftBDateFromSite > rightBDateFromSite) {
            let t = rightBDateFromSite;
            rightBDateFromSite = leftBDateFromSite;
            leftBDateFromSite = t;
        }
        defaultParameters.leftBorderBirthDate = leftBDateFromSite;
        defaultParameters.rightBorderBirthDate = rightBDateFromSite;
    }

    return defaultParameters;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}