const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const levelLabel = document.getElementById("levelLabel");
const moveCountEl = document.getElementById("moveCount");

const overlay = document.getElementById("levelOverlay");
const overlayTitle = document.getElementById("levelOverlay");
const overlayMessage = document.getElementById("overlayMessage");
const btnNext = document.getElementById("btnNext");
const btnRetry = document.getElementById("btnRetry");

//How to play
document.addEventListener("DOMcontentLoaded", () => {
    const howOverlay = document.getElementById("howOverlay");
    const howBtn = document.getElementById("howToPlayBtn");
    const closeHow = document.getElementById("closeHowBtn");
    
    howBtn.onclick = () => howOverlay.classList.remove("hidden");
    closeHow.onclick = () => howOverlay.classList.add("hidden");
    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") howOverlay.classList.add("hidden");
    });

    howOverlay.addEventListener("click", (e) => {
        if (e.target === howOverlay) {
            howOverlay.classList.add("hidden");
        }
    });
});

const TILE = 40;
const GAP = 40;

const levels = [
    {
        name: "Split and Start",
        real: [
            "##########",
            "#@....R..#",
            "#....R.G.#",
            "#........#",
            "#..S..D..#",
            "#........#",
            "##########"
        ],
        mirror: [
            "##########",
            "#..X.....#",
            "#.X..g..@#",
            "#........#",
            "#..s..d..#",
            "#........#",
            "##########"
        ]
    },

    {
        name: "Reflection of the Doors",
        real: [
            "##########",
            "#@...S.D.#",
            "#..###...#",
            "#........#",
            "#....G...#",
            "#........#",
            "##########"
        ],
        mirror: [
            "##########",
            "#@...S.D.#",
            "#..###...#",
            "#........#",
            "#....G...#",
            "#........#",
            "##########"
        ]
    },
    {
        name: "Mirror walls",
        real: [
            "##########",
            "#@....R..#",
            "#....R.G.#",
            "#........#",
            "#..S..D..#",
            "#........#",
            "##########"
        ],
        mirror: [
            "##########",
            "#..X.....#",
            "#.X..g..@#",
            "#........#",
            "#..s..d..#",
            "#........#",
            "##########"
        ]
    },
];

//game state
let currentLevel = 0;
let height, width;
let moveCount = 0;

let realGrid = [];
let mirrorGrid = [];

let playerR = {x: 0, y: 0};
let playerM = {x: 0, y: 0};

let goalR = {x: 0, y: 0};
let goalM = {x: 0, y: 0};

let realDoorOpen = false;
let mirrorDoorOpen = false;

function tite(grid, x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return "#";
    return grid[y][x];
}
function isWallReal(t){
    if(t === "#" || t === "R") return true;
    if(t === "D" && !realDoorOpen) return true;
    return false;
}
function isWallMirror(t){
    if(t === "#" || t === "X") return true;
    if(t === "d" && !mirrorDoorOpen) return true;
    return false;
}
function updateDoors(){
    mirrorDoorOpen = tile(realGrip, playerR.x, playerR.y) === "S";
    realDoorOpen = tile(mirrorGrid, playerM.x, playerM.y) === "s";
}

//load level
function loadLevel(i){
    currentLevel = i;

    const L = levels[i];
    realGrid = L.real.map(r => r.split(""));
    mirrorGrid = L.mirror.map(r => r.split(""));

    height = realGrid.length;
    width = realGrid[0].length;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            const R = realGrid[y][x];
            const M = mirrorGrid[y][x];

            if(R === "@") {playerR = {x, y}; realGrid[y][x] = ".";}
            if(M === "@") {playerM = {x, y}; mirrorGrid[y][x] = ".";}
            if(R === "G") {goalR = {x, y}; realGrid[y][x] = ".";}
            if(M === "g") {goalM = {x, y}; mirrorGrid[y][x] = ".";}
        }
    }

    moveCount = 0;
    moveCountEl.textContent = 0;
    levelLabel.textContent = `${i + 1} / ${levels.length}`;

    updateDoors();
    resize();
    hideOverlay();
}
function resize(){
    canvas.width = width * TILE * 2 + GAP;
    canvas.height = height * TILE;
}
window.addEventListener("resize", resize);

//movement
document.addEventListener("keydown", (e) => {
    if (e.key === "r") return loadLevel(currentLevel);
    if (e.key === "n") return loadLevel((currentLevel + 1) % levels.length);

    let dx = 0, dy = 0;
    if (e.key === "ArrowUp" || e.key === "w") dy = -1;
    if (e.key === "ArrowDown" || e.key === "s") dy = 1;
    if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
    if (e.key === "ArrowRight" || e.key === "d") dx = 1;

    move(dx, dy);
});
function move