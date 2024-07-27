"use strict";
const CHALLENGES = [
    { name: "Challenge 1", HTMLFilePath: "/Src/Challenges/Challenge1/challenge1.html" },
    { name: "Challenge 2", HTMLFilePath: "/Src/Challenges/Challenge2/challenge2.html" }
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
