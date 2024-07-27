# Development README

## Instructions for adding new challenges to this project

Follow these steps to add a new challenge to the project, e.g. Challenge X

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
        <!-- Page content goes here -->

        <!-- Every page comes within an inbuilt canvas -->
        <canvas id="canvas"></canvas>
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
CURRENT_CHALLENGE();
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

For some parameters, you will also want the user to be able to edit them. To add a slider to allow the user to do this, add a range element within the challengeX.html main element.
```html
<label id="angleLabel">Launch Angle (30 degrees)</label>
<input type="range" id="angleSlider" min="0" max="90" step="0.01"> <!-- Remember to set the boundary conditions -->
```

Then to link this slider element with the TypeScript parameter, use the LinkSliderToKey function.\
Every slider should have an associated label, and you can define the text template as shown below.
```typescript
//LinkSliderToKey(parameters, key, sliderID, labelID, template)
LinkSliderToKey(ChallengeXParameters, "angle", "angleSlider", "angleLabel", "Launch Angle (X degrees)");
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
```

With these functions, you can process and plot the data supplied by parameters within the CURRENT_CHALLENGE function and subsequently complete a new challenge.

Look at the code within [Challenge 1](Src/Challenges/Challenge1) as an example.

### Running locally

To run the webpage locally and build to dist, follow the instructions [here](https://github.com/AryaaSk/Vanilla-Template)