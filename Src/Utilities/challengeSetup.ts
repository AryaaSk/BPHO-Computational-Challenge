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
    const label = document.createElement("label");
    const slider = document.createElement("input") as HTMLInputElement;

    slider.type = "range";
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
    const main = document.getElementsByClassName("main")[0]

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



InitBackButton();
