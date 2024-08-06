"use strict";
let CURRENT_CHALLENGE = () => { }; //holds the current challenge's callback
const InitBackButton = () => {
    const backButton = document.getElementById("back");
    backButton.onclick = () => {
        location.href = "index.html";
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
    const label = document.createElement("label");
    const slider = document.createElement("input");
    slider.type = "range";
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
InitBackButton();
