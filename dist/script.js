"use strict";
const CHALLENGES = [
    { name: "Challenge 1", HTMLFilePath: "challenge1.html" },
    { name: "Challenge 2", HTMLFilePath: "challenge2.html" },
    { name: "Challenge 3", HTMLFilePath: "challenge3.html" },
    { name: "Challenge 8", HTMLFilePath: "challenge8.html" },
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
