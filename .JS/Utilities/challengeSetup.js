"use strict";
let CURRENT_CHALLENGE = () => { }; //holds the current challenge's callback
const InitBackButton = () => {
    const backButton = document.getElementById("back");
    backButton.onclick = () => {
        location.href = "/Src/index.html";
    };
};
const LinkSliderToKey = (parameters, key, sliderID, labelID, template) => {
    const slider = document.getElementById(sliderID);
    const label = document.getElementById(labelID);
    const UpdateValue = (sliderValue) => {
        slider.value = sliderValue;
        parameters[key] = Number(sliderValue);
        const text = template.replace("X", String(parameters[key]));
        label.innerText = text;
        CURRENT_CHALLENGE();
    };
    UpdateValue(String(parameters[key]));
    slider.addEventListener('input', () => {
        UpdateValue(slider.value);
    });
};
const InitSliderForKey = (parameters, key, template, sliderOptions) => {
    //add a input:range into the div with class 'parameters'
    const parent = document.getElementById("parameters");
    const row = document.createElement("div");
    row.className = "parameterWrapper";
    const label = document.createElement("label");
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = key;
    slider.min = String(sliderOptions.min);
    slider.max = String(sliderOptions.max);
    slider.step = String(sliderOptions.step);
    //add label and slider into row
    row.append(label);
    row.append(slider);
    parent.append(row);
    //link slider value, parameter key and label
    const UpdateValue = (sliderValue) => {
        slider.value = sliderValue;
        parameters[key] = Number(sliderValue);
        const text = template.replace("X", String(parameters[key]));
        label.innerText = text;
        CURRENT_CHALLENGE();
    };
    UpdateValue(String(parameters[key]));
    slider.addEventListener('input', () => {
        UpdateValue(slider.value);
    });
};
const AddKey = (key) => {
    //create a key wrapper, then add key elements within it
    const main = document.getElementsByClassName("main")[0];
    let keyContainer = document.getElementById("key");
    if (keyContainer == null) {
        keyContainer = document.createElement("div");
        keyContainer.id = "key";
        main.append(keyContainer);
    }
    keyContainer.innerHTML = "";
    for (const item of key) {
        const element = document.createElement("div");
        element.className = "keyItem";
        element.innerHTML = `<div class="line" style="background-color: ${item.colour}; "></div> ${item.label}`;
        keyContainer.append(element);
    }
};
const AddLabel = (key, template) => {
    //add a input:range into the div with class 'parameters'
    const parent = document.getElementById("labels");
    let keyContainer = document.getElementById(key);
    if (keyContainer == null) {
        const label = document.createElement("label");
        label.id = key;
        if (parent.children.length >= 1) {
            label.innerText = ", " + template;
        }
        else {
            label.innerText = template;
        }
        parent.append(label);
    }
};
const UpdateLabelText = (key, template, value) => {
    //add a input:range into the div with class 'parameters'
    const label = document.getElementById(key);
    const text = template.replace("X", String(value.toFixed(1)));
    // @ts-expect-error
    label.innerText = text + " ";
};
const InitChallengeToggle = (challenges) => {
    const buttons = [];
    for (const challenge of challenges) {
        buttons.push(document.getElementById(challenge.buttonID));
    }
    ;
    const RemoveKeyIfPresent = () => {
        const keyContainer = document.getElementById("key");
        if (keyContainer == null) {
            return;
        }
        keyContainer.remove();
    };
    const ResetAllButtonsCSS = () => {
        for (const button of buttons) {
            button.className = "button";
        }
    };
    for (const [i, challenge] of challenges.entries()) {
        const button = buttons[i]; //same index since buttons array is mapped to by challenges
        button.onclick = () => {
            ResetAllButtonsCSS();
            RemoveKeyIfPresent();
            button.className += " selected"; //to show the current challenge selected
            CURRENT_CHALLENGE = challenge.challengeCallback;
            CURRENT_CHALLENGE();
        };
    }
};
const InitAxisTitle = (x, y) => {
    const xAxis = document.getElementById("xAxis");
    xAxis.innerText = x;
    const yAxis = document.getElementById("yAxis");
    yAxis.innerText = y;
};
const InitInfo = (info) => {
    const infoButton = document.createElement("button");
    infoButton.className = "button";
    infoButton.innerText = "ⓘ";
    const rightBarButtonContainer = document.getElementsByClassName("rightButtons")[0];
    rightBarButtonContainer.append(infoButton);
    infoButton.onclick = () => {
        alert(info);
    };
};
InitBackButton();
