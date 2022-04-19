// смещение основного содержания страницы для отступа от меню
const INTERVAL_PX = 10;
var mainElem = document.getElementsByTagName("main")[0];
var newMargin = document.getElementById("lab-work-menu").clientWidth + INTERVAL_PX;
mainElem.style.marginLeft = newMargin + "px";

// активация отображения первой лабораторки
changeLabWorkOnPage("content_lab_1");