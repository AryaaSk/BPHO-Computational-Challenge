interface Challenge {
    name: string;
    HTMLFilePath: string;
}

const CHALLENGES: Challenge[] = [
    { name: "Challenge 1, 2 and 4", HTMLFilePath: "/Src/Challenges/Challenge124/challenge124.html" },
    { name: "Challenge 3, 5 and 6", HTMLFilePath: "/Src/Challenges/Challenge356/challenge356.html" },
    { name: "Challenge 8", HTMLFilePath: "/Src/Challenges/Challenge8/challenge8.html" },
    { name: "Challenge 9", HTMLFilePath: "/Src/Challenges/Challenge9/challenge9.html" },
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