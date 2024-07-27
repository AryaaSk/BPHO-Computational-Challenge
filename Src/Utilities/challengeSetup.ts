let CURRENT_CHALLENGE = () => {}; //holds the current challenge's callback

const InitBackButton = () => {
    const backButton = document.getElementById("back")!;
    backButton.onclick = () => {
        window.history.go(-1);
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

InitBackButton();
