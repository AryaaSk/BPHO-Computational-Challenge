"use strict";
const InitBackButton = () => {
    const backButton = document.getElementById("back");
    backButton.onclick = () => {
        window.history.go(-1);
    };
};
