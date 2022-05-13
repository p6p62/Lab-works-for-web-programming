function createHumans() {
    // чтение параметров генерации
    let parameters = getParameters();

    // перезапись параметров обратно (если вдруг были неверные)
    rewriteParametersOnSite(parameters);
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
}

function BitrhDate(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;
}

function LiveAddress(city, street, houseNumber, apartmentNumber) {
    this.city = city;
    this.street = street;
    this.houseNumber = houseNumber;
    this.apartmentNumber = apartmentNumber;
}

function getFIORandom(isWoman) {

}

function getBirthDateRandom(leftBorder, rightBorder) {

}

function getPhoneNumberRandom() {

}

function getLiveAddressRandom() {

}

function getHumansArray(parameters) {
    let humanArray = Array(parameters.peopleCount);
    for (let i = 0; i < parameters.peopleCount; i++) {
        let isWoman = Math.round(Math.random()) == 0; // случайное bool-значение
        humanArray[i] = new Human(
            getFIORandom(isWoman),
            isWoman,
            getBirthDateRandom(parameters.leftBorderBirthDate, parameters.rightBorderBirthDate),
            getPhoneNumberRandom(),
            getLiveAddressRandom()
        );
    }
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