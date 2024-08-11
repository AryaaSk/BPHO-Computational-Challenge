"use strict";
const CHALLENGES = [
    { name: "Challenge 1, 2, 4 and 6", HTMLFilePath: "/Src/Challenges/Challenge1246/challenge1246.html" },
    { name: "Challenge 3 and 5", HTMLFilePath: "/Src/Challenges/Challenge35/challenge35.html" },
    { name: "Challenge 7", HTMLFilePath: "/Src/Challenges/Challenge7/challenge7.html" },
    { name: "Challenge 8", HTMLFilePath: "/Src/Challenges/Challenge8/challenge8.html" },
    { name: "Challenge 9", HTMLFilePath: "/Src/Challenges/Challenge9/challenge9.html" },
    { name: "Extension: Spherical Planet", HTMLFilePath: "/Src/Challenges/SphericalPlanet/sphericalPlanet.html" },
];
const LoadChallenges = (challenges) => {
    //populate tableview with rows, with each row being a button to access a challenge
    const section = document.getElementById("challenges");
    section.innerHTML = "";
    for (const challenge of challenges) {
        const row = document.createElement("div");
        row.className = "row";
        row.innerText = challenge.name;
        row.onclick = () => {
            location.href = challenge.HTMLFilePath;
        };
        section.append(row);
    }
};
LoadChallenges(CHALLENGES);
