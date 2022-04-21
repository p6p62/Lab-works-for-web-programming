// смещение основного содержания страницы для отступа от меню
const INTERVAL_PX = 10;
var mainElem = document.getElementsByTagName("main")[0];
var newMargin = document.getElementById("lab-work-menu").clientWidth + INTERVAL_PX;
mainElem.style.marginLeft = newMargin + "px";

// активация отображения пятой лабораторки
changeLabWorkOnPage("content_lab_5");

// установка одинаковой ширины кнопкам меню
let allButtons = document.getElementById('lab-work-menu').getElementsByTagName('button');
if (allButtons.length > 1) {
    let maxWidth = allButtons[0].offsetWidth;
    for (let i = 1; i < allButtons.length; i++) {
        if (allButtons[i].offsetWidth > maxWidth)
            maxWidth = allButtons[i].offsetWidth;
    }
    for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].style.width = maxWidth + 1 + 'px';
    }
}