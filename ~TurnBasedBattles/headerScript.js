function buildHeader() {
    const header = document.createElement("header");

    const returnLink = document.createElement("a");
    returnLink.classList.add("btn", "btn-secondary");
    returnLink.href = "../tbbindex.html";
    returnLink.textContent = "Back to the Projects Page";
    header.appendChild(returnLink);

    const musicBtn = document.createElement("a");
    musicBtn.classList.add("btn", "btn-secondary");
    musicBtn.id = "music-btn";
    musicBtn.addEventListener("click", () => toggleSong(musicBtn));
    musicBtn.style.color = "rgb(150, 150, 150)";
    const musicIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    musicIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    musicIcon.setAttribute("width", "24");
    musicIcon.setAttribute("height", "24");
    musicIcon.setAttribute("fill", "currentColor");
    musicIcon.setAttribute("class", "bi bi-music-note");
    musicIcon.setAttribute("viewBox", "0 0 16 16");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("d", "M9 3v10H8V3z");
    const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5z");
    musicIcon.appendChild(path1);
    musicIcon.appendChild(path2);
    musicIcon.appendChild(path3);
    musicBtn.appendChild(musicIcon);
    header.appendChild(musicBtn);

    const music = document.createElement("audio");
    music.addEventListener("error", () => {
        musicBtn.style.display = "none";
    });
    music.src = "src/music.mp3";
    music.loop = true;
    music.volume = 0.5;
    header.appendChild(music);

    const head = document.head;
    const headerStyle = document.createElement("link");
    headerStyle.rel = "stylesheet";
    headerStyle.href = "../headerstyle.css";
    head.appendChild(headerStyle);

    document.body.insertBefore(header, document.body.firstChild);

}

function toggleSong(button) {
    const music = document.querySelector("header audio");
    if (music.paused) {
        music.currentTime = 0.5;
        music.play();

        button.style.color = "rgb(233, 223, 38)";
    } else {
        music.pause();
        button.style.color = "rgb(150, 150, 150)";

    }
}

buildHeader();