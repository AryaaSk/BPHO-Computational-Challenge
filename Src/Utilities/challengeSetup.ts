let CURRENT_CHALLENGE = () => {}; //holds the current challenge's callback

const InitBackButton = () => {
    const backButton = document.getElementById("back")!;
    backButton.onclick = () => {
        location.href = "/Src/index.html"
    }
}

const LinkSliderToKey = (parameters: { [key: string]: number }, key: string, sliderID: string, labelID: string, template: string) => {
    const slider = document.getElementById(sliderID)! as HTMLInputElement;
    const label = document.getElementById(labelID)!;

    const UpdateValue = (sliderValue: string) => {
        slider.value = sliderValue;
        parameters[key] = Number(sliderValue);
        const text = template.replace("X", String(parameters[key]));
        label.innerText = text;
        CURRENT_CHALLENGE();
    }

    UpdateValue(String(parameters[key]))
    slider.addEventListener('input', () => {
        UpdateValue(slider.value);
    })
}

const InitSliderForKey = (parameters: { [key: string]: number }, key: string, template: string, sliderOptions: { min: number, max: number, step: number }) => {
    //add a input:range into the div with class 'parameters'
    const parent = document.getElementById("parameters")!;
    
    const row = document.createElement("div");
    row.className = "parameterWrapper"
    const label = document.createElement("label");
    const slider = document.createElement("input") as HTMLInputElement;

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
    const UpdateValue = (sliderValue: string) => {
        slider.value = sliderValue;
        parameters[key] = Number(sliderValue);
        const text = template.replace("X", String(parameters[key]));
        label.innerText = text;
        CURRENT_CHALLENGE();
    }
    UpdateValue(String(parameters[key]))
    slider.addEventListener('input', () => {
        UpdateValue(slider.value);
    })
}

const AddKey = (key: { colour: string, label: string }[]) => {
    //create a key wrapper, then add key elements within it
    const main = document.getElementsByClassName("main")[0];

    let keyContainer = document.getElementById("key") as HTMLElement | null;

    if (keyContainer == null) {
        keyContainer = document.createElement("div");
        keyContainer.id = "key";
        main.append(keyContainer)
    }

    keyContainer.innerHTML = "";
    for (const item of key) {
        const element = document.createElement("div");
        element.className = "keyItem";
        element.innerHTML = `<div class="line" style="background-color: ${item.colour}; "></div> ${item.label}`;
        keyContainer!.append(element);
    }
}

const AddLabel = (key: string, template: string) => {
    //add a input:range into the div with class 'parameters'
    const parent = document.getElementById("labels")!;
    
    let keyContainer = document.getElementById(key) as HTMLElement | null;

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
}

const UpdateLabelText = (key: string, template: string, value: number) => {
    //add a input:range into the div with class 'parameters'

    const label = document.getElementById(key);
    const text = template.replace("X", String(value.toFixed(1)));
    // @ts-expect-error
    label.innerText = text + " ";
}

const InitChallengeToggle = (challenges: { buttonID: string, challengeCallback: () => void }[]) => {
    const buttons: HTMLButtonElement[] = [];
    for (const challenge of challenges) {
        buttons.push(document.getElementById(challenge.buttonID)! as HTMLButtonElement);
    };

    const RemoveKeyIfPresent = () => { //if there is a key present from a previous challenge, we should remove it
        const keyContainer = document.getElementById("key");
        if (keyContainer == null) {
            return;
        }

        keyContainer.remove();
    }

    const ResetAllButtonsCSS = () => {
        for (const button of buttons) {
            button.className = "button";
        }
    }

    for (const [i, challenge] of challenges.entries()) {
        const button = buttons[i]; //same index since buttons array is mapped to by challenges
        button.onclick = () => {
            ResetAllButtonsCSS();
            RemoveKeyIfPresent();
            button.className += " selected"; //to show the current challenge selected
            CURRENT_CHALLENGE = challenge.challengeCallback;
            CURRENT_CHALLENGE();
        }
    }
}

const InitAxisTitle = (x: string, y: string) => {
    const xAxis = document.getElementById("xAxis")!;
    xAxis.innerText = x;

    const yAxis = document.getElementById("yAxis")!;
    yAxis.innerText = y;
}

const InitInfo = (info: string) => {
    const infoButton = document.createElement("button");
    infoButton.className = "button";
    infoButton.innerText = "ⓘ";

    const rightBarButtonContainer = document.getElementsByClassName("rightButtons")[0];
    rightBarButtonContainer.append(infoButton);

    infoButton.onclick = () => {
        alert(info);
    }
}



InitBackButton();