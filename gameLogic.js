const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const levelLabel = document.getElementById("levelLabel");
const moveCountEl = document.getElementById("moveCount");

const overlay = document.getElementById("levelOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const btnNext = document.getElementById("btnNext");
const btnRetry = document.getElementById("btnRetry");
const moveSound = new Audio("assets/movement.mp3");
const winSound = new Audio("assets/win.mp3");
const nextSound = new Audio("assets/nextlevel.mp3");
const restartSound = new Audio("assets/restart.mp3");
moveSound.volume = 0.5;

//How to play
document.addEventListener("DOMContentLoaded", () => {
    const howOverlay = document.getElementById("howOverlay");
    const howBtn = document.getElementById("howToPlayBtn");
    const closeHow = document.getElementById("closeHowBtn");

    howBtn.onclick = () => howOverlay.classList.remove("hidden");
    closeHow.onclick = () => howOverlay.classList.add("hidden");
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") howOverlay.classList.add("hidden");
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
        name: "Split Start",
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
        name: "Reflection Doors",
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
            "#.d.s...@#",
            "#...###..#",
            "#........#",
            "#...g....#",
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
let isLevelComplete = false;

let playerR = { x: 0, y: 0 };
let playerM = { x: 0, y: 0 };

let goalR = { x: 0, y: 0 };
let goalM = { x: 0, y: 0 };

let realDoorOpen = false;
let mirrorDoorOpen = false;

function tile(grid, x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return "#";
    return grid[y][x];
}
function isWallReal(t) {
    if (t === "#" || t === "R") return true;
    if (t === "D" && !realDoorOpen) return true;
    return false;
}
function isWallMirror(t) {
    if (t === "#" || t === "X") return true;
    if (t === "d" && !mirrorDoorOpen) return true;
    return false;
}
function updateDoors() {
    mirrorDoorOpen = tile(realGrid, playerR.x, playerR.y) === "S";
    realDoorOpen = tile(mirrorGrid, playerM.x, playerM.y) === "s";
}

//load level
function loadLevel(i) {
    isLevelComplete = false
    currentLevel = i;

    const L = levels[i];
    realGrid = L.real.map(r => r.split(""));
    mirrorGrid = L.mirror.map(r => r.split(""));

    height = realGrid.length;
    width = realGrid[0].length;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const R = realGrid[y][x];
            const M = mirrorGrid[y][x];

            if (R === "@") { playerR = { x, y }; realGrid[y][x] = "."; }
            if (M === "@") { playerM = { x, y }; mirrorGrid[y][x] = "."; }
            if (R === "G") { goalR = { x, y }; realGrid[y][x] = "."; }
            if (M === "g") { goalM = { x, y }; mirrorGrid[y][x] = "."; }
        }
    }

    moveCount = 0;
    moveCountEl.textContent = 0;
    levelLabel.textContent = `${i + 1} / ${levels.length}`;

    updateDoors();
    resize();
    hideOverlay();
}
function resize() {
    canvas.width = width * TILE * 2 + GAP;
    canvas.height = height * TILE;
}
window.addEventListener("resize", resize);

//movement
document.addEventListener("keydown", (e) => {
    if(e.key === "r"){
        restartSound.play();
        return loadLevel(currentLevel);
    }
    if(e.key === "n"){
        nextSound.play();
        return loadLevel((currentLevel + 1) % levels.length);
    }
    
    let dx = 0, dy = 0;
    if (e.key === "ArrowUp" || e.key === "w") dy = -1;
    if (e.key === "ArrowDown" || e.key === "s") dy = 1;
    if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
    if (e.key === "ArrowRight" || e.key === "d") dx = 1;

    move(dx, dy);
});
function move(dxR, dyR) {
    if(isLevelComplete) return;
    const dxM = -dxR;
    const dyM = dyR;

    const nrX = playerR.x + dxR;
    const nrY = playerR.y + dyR;

    const nmX = playerM.x + dxM;
    const nmY = playerM.y + dyM;

    let moved = false;

    if (!isWallReal(tile(realGrid, nrX, nrY))) {
        playerR.x = nrX;
        playerR.y = nrY;
        moved = true;
    }

    if (!isWallMirror(tile(mirrorGrid, nmX, nmY))) {
        playerM.x = nmX;
        playerM.y = nmY;
        moved = true;
    }
    if (moved) {
        moveSound.currentTime = 0;
        moveSound.play();
        moveCount++;
        moveCountEl.textContent = moveCount;

        updateDoors();
        checkWin();
    }
}
function checkWin() {
    if (
        playerR.x === goalR.x && playerR.y === goalR.y &&
        playerM.x === goalM.x && playerM.y === goalM.y
    ) {
        if(isLevelComplete) return;
        isLevelComplete = true;

        winSound.play();
        showOverlay("Level Complete!", levels[currentLevel].name);
    }
}

function showOverlay(title, msg) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = msg;
    overlay.classList.remove("hidden");
}

function hideOverlay() {
    overlay.classList.add("hidden");
}
btnNext.onclick = () => {
    nextSound.play();
    loadLevel((currentLevel + 1) % levels.length);
};
btnRetry.onclick = () => {
    restartSound.play();
    loadLevel(currentLevel);
};

function drawRoom(grid, offsetX, mirror) {
    ctx.fillStyle = mirror ? "rgba(255,126,182,0.06)" : "rgba(97,218,251,0.10)";
    ctx.fillRect(offsetX, 0, width * TILE, height * TILE);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const t = grid[y][x];
            const px = offsetX + x * TILE;
            const py = y * TILE;

            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.strokeRect(px, py, TILE, TILE);

            if (t === "#") {
                ctx.fillStyle = "#141827";
                ctx.fillRect(px, py, TILE, TILE);
            }
            if (t === "R" && !mirror) {
                ctx.fillStyle = "rgba(80,200,255,0.25)";
                ctx.fillRect(px, py, TILE, TILE);
            }
            if (t === "X" && mirror) {
                ctx.fillStyle = "rgba(255,126,182,0.25)";
                ctx.fillRect(px, py, TILE, TILE);
            }
            if (t === "D" && !mirror) drawDoor(px, py, true);
            if (t === "d" && mirror) drawDoor(px, py, false);

            if (t === "S" && !mirror) drawSwitch(px, py, false);
            if (t === "s" && mirror) drawSwitch(px, py, true);

            if (!mirror && x === goalR.x && y === goalR.y) drawGoal(px, py, false);
            if (mirror && x === goalM.x && y === goalM.y) drawGoal(px, py, true);
        }
    }
}

function drawGoal(px, py, mirror) {
    const r = TILE * 0.27;
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;

    ctx.fillStyle = mirror ? "rgba(255,126,182,0.35)" : "rgba(158,255,180,0.4)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
}
function drawDoor(px, py, realDoor) {
    const open = realDoor ? realDoorOpen : mirrorDoorOpen;

    ctx.fillStyle = open ? "rgba(0,255,150,0.15)" : "rgba(10,10,20,1)";
    ctx.fillRect(px, py, TILE, TILE);

    ctx.strokeStyle = realDoor ? "#61dafb" : "#ff7eb6";
    ctx.strokeRect(px + 4, py + 4, TILE - 8, TILE - 8);
}

function drawSwitch(px, py, mirror) {
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;

    ctx.fillStyle = mirror ? (mirrorDoorOpen ? "#ff7eb6" : "rgba(255,126,182,0.4)") : (realDoorOpen ? "rgba(97,218,251,0.4)" : "#61dafb");
    ctx.beginPath();
    ctx.roundRect(cx - 14, cy - 6, 28, 12, 6);
    ctx.fill();
}

function drawPlayer(px, py, mirror) {
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;
    const r = TILE * 0.27;

    ctx.fillStyle = mirror ? "#ff7eb6" : "#61dafb";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roomW = width * TILE;

    drawRoom(realGrid, 0, false);
    drawRoom(mirrorGrid, roomW + GAP, true);
    drawPlayer(playerR.x * TILE, playerR.y * TILE, false);
    drawPlayer(roomW + GAP + playerM.x * TILE, playerM.y * TILE, true);
}
function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

//start game
loadLevel(0);
gameLoop();