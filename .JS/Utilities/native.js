"use strict";
//Native is in light mode by default, to switch it to dark mode we just have to change a few of the colours
const LoadDarkMode = () => {
    const body = document.body;
    body.style.setProperty('--textColour', '#ffffff');
    body.style.setProperty('--secondaryTextColour', '#c4c4c4');
    body.style.setProperty('--systemBackgroundColour', 'rgb(0, 0, 0)');
    body.style.setProperty('--systemGroupedBackgroundColour', 'rgb(0, 0, 0)');
    body.style.setProperty('--systemHighlightBackgroundColour', 'rgb(50, 50, 50)');
    body.style.setProperty('--navigationTabBarBackgroundColour', 'rgb(18, 18, 18)');
    body.style.setProperty('--systemObjectBackgroundColour', 'rgb(21, 21, 21)');
    body.style.setProperty('--systemBorder', '1px solid rgb(35, 35, 35)');
};
let TAB_BAR_CONFIG = [];
const InitTabBar = async () => {
    const currentPage = location.href.split("/").pop(); //find the current page which we are on to change the icon's colour
    const tabBar = document.getElementsByClassName("tab-bar")[0];
    for (const item of TAB_BAR_CONFIG) {
        const element = document.createElement("div");
        element.className = "item";
        //check whether current page is a subpage of current item or is the specified path
        let currentPageSelected = item.path.endsWith(currentPage);
        if (item.subpaths != undefined) {
            for (const subpath of item.subpaths) {
                if (subpath.endsWith(currentPage)) {
                    currentPageSelected = true;
                }
            }
        }
        const fillColour = (currentPageSelected) ? "#0a84ff" : "#878787";
        const svg = await ChangeSVGFill(item.iconSrc, fillColour);
        element.innerHTML = `
        ${svg}
        <label style="color: ${fillColour}">${item.title}</label>
        `;
        tabBar.append(element);
        element.onclick = () => { location.href = item.path; };
    }
    //we also want to check if the user is in fullscreen mode and add padding to the bottom
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
        document.body.style.setProperty('--tabBarHeight', 'calc(50px + 1.8rem)');
        document.body.style.setProperty('--tabBarPaddingBottom', '1.8rem');
    }
};
const ChangeSVGFill = async (src, colourHex) => {
    const hex = colourHex.replace("#", "");
    const response = await fetch(src);
    const text = await response.text();
    const lines = text.split("\n");
    let i = 0; //remove code injected by live-server
    while (i != lines.length) {
        if (lines[i] == "<!-- Code injected by live-server -->") {
            while (lines[i] != "</script>") {
                lines.splice(i, 1);
            }
            lines.splice(i, 1); //to remove the "</script>"
        }
        else {
            //find a '#', since it is only used in hex codes, and change the next 6 digits to the colour requested to change fill
            const hastagIndex = lines[i].indexOf("#");
            if (hastagIndex != -1) {
                //convert lines[i] to a list so we can modify substrings
                const svgLineList = [...lines[i]];
                svgLineList[hastagIndex + 1] = hex[0];
                svgLineList[hastagIndex + 2] = hex[1];
                svgLineList[hastagIndex + 3] = hex[2];
                svgLineList[hastagIndex + 4] = hex[3];
                svgLineList[hastagIndex + 5] = hex[4];
                svgLineList[hastagIndex + 6] = hex[5];
                const svgLine = svgLineList.join(""); //merge back into original lines array
                lines[i] = svgLine;
            }
            i += 1;
        }
    }
    const svg = lines.join("\n"); //change the image from <img> to an <svg> element
    return svg;
};
