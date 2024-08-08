interface Challenge {
    name: string;
    HTMLFilePath: string;
}

const CHALLENGES: Challenge[] = [
    { name: "Challenge 1", HTMLFilePath: "/Src/Challenges/Challenge1/challenge1.html" },
    { name: "Challenge 2", HTMLFilePath: "/Src/Challenges/Challenge2/challenge2.html" },
    { name: "Challenge 3", HTMLFilePath: "/Src/Challenges/Challenge3/challenge3.html" },
    { name: "Challenge 4", HTMLFilePath: "/Src/Challenges/Challenge4/challenge4.html" },
    { name: "Challenge 5", HTMLFilePath: "/Src/Challenges/Challenge5/challenge5.html" },
    { name: "Challenge 6", HTMLFilePath: "/Src/Challenges/Challenge6/challenge6.html" },
    { name: "Challenge 8", HTMLFilePath: "/Src/Challenges/Challenge8/challenge8.html" },
];


const LoadChallenges = (challenges: Challenge[]) => {
    //populate tableview with rows, with each row being a button to access a challenge
    const section = document.getElementById("challenges")!;
    section.innerHTML = "";

    for (const challenge of challenges) {
        const row = document.createElement("div");
        row.className = "row";
        row.innerText = challenge.name;
        row.onclick = () => {
            location.href = challenge.HTMLFilePath;
        }

        section.append(row);
    }
}

LoadChallenges(CHALLENGES);