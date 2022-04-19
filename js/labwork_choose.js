function changeLabWorkOnPage(divLabWorkId) {
    let allLabContentBlocks = document.getElementsByClassName("lab-work-content");

    var allMenuButtons = document.getElementById("lab-work-menu").getElementsByTagName("button");

    for (let i = 0; i < allLabContentBlocks.length; i++) {
        if (allLabContentBlocks.item(i).getAttribute("id") !== divLabWorkId) {
            allLabContentBlocks.item(i).setAttribute("hidden", "true");
            allMenuButtons[i].style.backgroundColor = '#755C48';
        } else {
            allLabContentBlocks.item(i).removeAttribute("hidden");
            allMenuButtons[i].style.backgroundColor = '#34C924';
        }
    }
}