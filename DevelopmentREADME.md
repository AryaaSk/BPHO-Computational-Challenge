# Development README

## Instructions for adding new challenges to this project

Follow these steps to add a new challenge to the project, e.g. Challenge X.

You can watch a demonstration of adding a simple challenge which allows the user to input an x and y coordinate and plots the result on a screen [here](https://youtu.be/3Zx_rxW8xsA)

### Files

Create new files under the **Src/Challenges** directory
```
Src/Challenges/ChallengeX/challengeX.html
Src/Challenges/ChallengeX/challengeX.ts
```

Add a new entry into the CHALLENGES array within [script.ts](Src/script.ts)
```typescript
const CHALLENGES: Challenge[] = [
    { name: "Challenge 1", HTMLFilePath: "/Src/Challenges/Challenge1/challenge1.html" },
    { name: "Challenge 2", HTMLFilePath: "/Src/Challenges/Challenge2/challenge2.html" },
    ...
    { name: "Challenge X", HTMLFilePath: "/Src/Challenges/Challenge2/challengeX.html" }
];
```

### HTML boilerplate

Place this HTML code within challengeX.html (commented where to change)
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Challenge X</title> <!-- Change here -->

    <script src="/.JS/Utilities/native.js"></script>
    <script src="/.JS/Utilities/canvasUtilities.js"></script>
    <script src="/.JS/Challenges/challengeUtilities.js"></script>
    <script src="/.JS/Utilities/challengeSetup.js" defer></script>
    
    <link rel="stylesheet" href="/Src/Utilities/native.css">
    <link rel="stylesheet" href="/Src/Utilities/challenge.css">

    <!-- Replace X with the the actual challenge's number -->
    <script src="/.JS/Challenges/ChallengeX/challengeX.js" defer></script>
</head>
<body ontouchstart class="noTabBar">
    <div class="navigation-bar">
        <div class="leftButtons">
            <button class="button" id="back">Back</button>
        </div>
        <div><label>Challenge X</label></div> <!-- Change the title of the page -->
        <div class="rightButtons"></div>
    </div>
    
    <div class="main">
        <div id="parameters">
            <!-- Parameters added dynamically within JS -->
        </div>

        <!-- Every page comes within an inbuilt canvas -->
        <div class="canvasWrapper">
            <label id="yAxis">Y Axis</label>
            <canvas id="canvas"></canvas>
            <div></div>
            <label id="xAxis">X Axis</label>
        </div>
    </div>
</body>
</html>
```

### TypeScript boilerplate

Add this TypeScript code within challengeX.ts
```typescript
const ChallengeXParameters = {
    //Parameters required for challenge
}

//@ts-expect-error
const canvas = new Canvas();
canvas.linkCanvas("canvas");
canvas.CalculateConversionFactors();

CURRENT_CHALLENGE = () => {
    //Code for challenge goes here
}

InitAxisTitle("x/m", "y/m");

setTimeout(CURRENT_CHALLENGE);
```

### Parameters

You will likely need to use numerical parameter values to complete the challenge.

To do this, add a key within the parameter object.
```typescript
const ChallengeXParameters = {
    angle: 30,
    timeStep: 0.001
};
```

For some parameters, you will also want the user to be able to edit them. To do this, you can use the InitSliderForKey function which will create an input type range for the numerical slider.
Every slider should have an associated label, and you can define the text template as shown below.
```typescript
InitSliderForKey(parameters, key, template: string, sliderOptions)

//example linking a slider for an angle input
InitSliderForKey(ChallengeXParameters, "angle", "Launch Angle (X degrees)", { min: 0, max: 90, step: 1 });
```

### Plotting Graphs

All challenges involve some form of graph plotting, and to do so you can use the inbuilt canvas API.
 
Here are the functions available using the canvas object alongside examples.
```typescript
canvas.clearCanvas(); //clears the canvas

PlotPoint(point, colour, label?, offset?);
canvas.PlotPoint([0, 0], "black", "Origin", { x: 10, y: 10 });

DrawLine(points, colour, thickness);
canvas.DrawLine([[0, 0], [30, 30], "blue", 3]);

canvas.DrawAxis(); //draws positive x and y axis dependant on view window

//To adjust the view window, you can adjust the MIN_X, MIN_Y, MAX_X and MAX_Y attributes of the canvas
canvas.MAX_X = 30;
canvas.CalculateConversionFactors(); //whenever adjusting the view window, you need to call this method to re-calculate the conversion factors used when displaying points

const points: number[][] = [[100, 100], [50, 50]];
canvas.MaximiseViewWindow(points); //this function will update the MAX_X and MAX_Y attributes on the canvas to include all the points passed. Will also call CalculateConversionfactors within it.

canvas.AdjustIntervals(); //to declutter the intervals by deciding on a good step size
```

With these functions, you can process and plot the data supplied by parameters within the CURRENT_CHALLENGE function and subsequently complete a new challenge.

Look at the code within [Challenge 9](Src/Challenges/Challenge9) as an example.

For a few challenges you will plot multiple lines and should label them individually with a key. An example from challenge 3 is shown below, you just need to the pass the colour and name of the line.
```typescript
AddKey([
    { colour: "blue", label: "High ball" },
    { colour: "grey", label: "Min u" },
    { colour: "orange", label: "Low ball" }
]);
```

Finally, make sure all graphs have an axis label. This can be done when the challenge is called or simply once when the scene is loaded.
```typescript
InitAxisTitle("x/m", "y/m")
```


### Instructions for adding multiple challenges in the same scene
Some challenges such as 1,2,4 and 3,5,6 take in the same inputs and output marginally different results. For these, it's best to reduce clutter and display them in a single scene.

I will use the scene for challenges 1,2,4 as an example.

First create a new scene as if you were adding as new challenge (challenge124.html and challenge124.ts), importing all boilerplate as usual.

Create a challenge toggle HTML element within the 'main' container.
```html
<br>
<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
    <button class="button selected" id="challenge1">Challenge 1</button>
    <button class="button" id="challenge2">Challenge 2</button>
    <button class="button" id="challenge4">Challenge 4</button>
</div>
```

Create separate callbacks for each challenge (you can use the same code as you would put in the CURRENT_CHALLENGE function).
```typescript
const Challenge1 = () => {
    //code for challenge 1...
}
const Challenge2 = () => {
    //code for challenge 2...
}
const Challenge4 = () => {
    //code for challenge 4...
}
```

Right before CURRENT_CHALLENGE is called, call the InitChallengeToggle() function, which takes in an array of objects specifying the ids of the buttons created earlier and their respective callbacks.
```typescript
InitChallengeToggle([
    { buttonID: "challenge1", challengeCallback: Challenge1 },
    { buttonID: "challenge2", challengeCallback: Challenge2 },
    { buttonID: "challenge4", challengeCallback: Challenge4 },
]);

CURRENT_CHALLENGE = Challenge1; //Challenge1 is run by default
setTimeout(CURRENT_CHALLENGE);
```

You can look at the code within [Challenge 1,2,4](Src/Challenges/Challenge124) as an example

### Running locally
To run the webpage locally and build to dist, follow the instructions [here](https://github.com/AryaaSk/Vanilla-Template)