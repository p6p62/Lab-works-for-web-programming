function createHumans() {
    // чтение параметров генерации
    let parameters = getParameters();

    // перезапись параметров обратно (если вдруг были неверные)
    rewriteParametersOnSite(parameters);

    // создание объектов людей и добавление на сайт
    let humanArray = getHumansArray(parameters);
    addHumansOnSite(humanArray);
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
            td.textContent = humanArray[i][key].toString();
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

function BitrhDate(day, month, year) {
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

    let getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    return new FIO(getRandomElement(lastNames), getRandomElement(names), getRandomElement(patronymics));
}

function getBirthDateRandom(leftBorder, rightBorder) {
    let randTimeNumber = Math.floor((rightBorder.getTime() - leftBorder.getTime()) * Math.random() + 1) + leftBorder.getTime();
    let date = new Date();
    date.setTime(randTimeNumber);
    return new BitrhDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
}

function getPhoneNumberRandom() {
    return "+79" + (Math.floor(Math.random() * 99999999) + 100000000);
}

function getLiveAddressRandom() {
    return new LiveAddress("Рязань", "Щедрина", 43, 13);
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