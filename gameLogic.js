const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let maxUnlockedLevel = parseInt(localStorage.getItem("reflectionMaxLevel")) || 0;
const levelDisplay = document.getElementById("levelDisplay");
const overlay = document.getElementById("levelOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const btnNext = document.getElementById("btnNext");
const btnRetry = document.getElementById("btnRetry");
const howOverlay = document.getElementById("howOverlay");
const selectLevelOverlay = document.getElementById("selectLevelOverlay");
const featuresOverlay = document.getElementById("featuresOverlay");
const levelListContainer = document.getElementById("levelList");
const moveSound = new Audio("assets/movement.mp3");
const winSound = new Audio("assets/win.mp3");
const nextSound = new Audio("assets/nextlevel.mp3");
const restartSound = new Audio("assets/restart.mp3");
moveSound.volume = 0.5;

function playSound(Sound) {
    if(Sound){
        Sound.currentTime = 0;
        Sound.play().catch(e => console.warn("Sound blocked:", e));
    }
}

const TILE = 60;
const GAP = 60;

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
            "#........#",
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
            "#........#",
            "#........#",
            "##########"
        ]
    },

    {
        name: "Reflection Doors",
        real: [
            "##########",
            "#@...#...#",
            "#....#...#",
            "#.####...#",
            "#....D..G#",
            "#....#...#",
            "#..####..#",
            "#........#",
            "##########"
        ],
        mirror: [
            "##########",
            "#.......@#",
            "#........#",
            "#...####..#",
            "#s.......#",
            "#...g....#",
            "#........#",
            "#........#",
            "##########"
        ]
    },
    {
        name: "Mirror walls",
        real: [
            "##########",
            "#@..#....#",
            "###.S.##.#",
            "#...#....#",
            "#######.##",
            "#..#.....#",
            "#..###D..#",
            "#..#..G..#",
            "##########"
        ],
        mirror: [
            "##########",
            "#....#..@#",
            "#.##..s.###",
            "#.....#..#",
            "#..#####.#",
            "#..#.....#",
            "#..d..#..#",
            "#..g..#..#",
            "##########"
        ]
    },
    {
        name: "The keeper",
        real: [
            "###########",
            "#.........#",
            "#@........#",
            "#.##.######",
            "#....D....#",
            "#########.#",
            "#.......G.#",
            "###########"
        ],
        mirror: [
            "###########",
            "#.........#",
            "#........@#",
            "###.#######",
            "#....s....#",
            "####.#.####",
            "#.g.......#",
            "###########"
        ]
    },
    {
        name: "Zig Zak",
        real: [
            "############",
            "#@....#....#",
            "###.###.##.#",
            "#...#.#..#.#",
            "#.S.#.##.#.#",
            "#.#.#....#.#",
            "#...####.D.#",
            "#.G...#....#",
            "############"
        ],
        mirror: [
            "############",
            "#....#....@#",
            "#.##.#.#####",
            "#.#..#.#.g.#",
            "#.#.##.#.s##",
            "#.#....#..##",
            "#.d.####.###",
            "#..........#",
            "############"
        ]
    },
    {
        name: "Brain Twist",
        real: [
            "#############",
            "#@.#...#...##",
            "#..#.#.....##",
            "#..#.S.#.#.##",
            "#..#.###.#.##",
            "##.#.###.#.##",
            "##...#...D.G#",
            "#############"
        ],
        mirror: [
            "#############",
            "##...#...#..#",
            "##.#.#.#.#..#",
            "##.#.#.s.#..#",
            "##.#.###.#..#",
            "#g.d.@.#...##",
            "#g.d...#...##",
            "#############",
        ]
    },
    {
        name: "Tussle",
        real: [
            "#############",
            "#@#.......#G#",
            "#.#.#####.#.#",
            "#.#..S..#.#.#",
            "#.#.#####.#.#",
            "#...#...#...#",
            "#############"
        ],
        mirror: [
            "#############",
            "#.#.......#@#",
            "#.#.#####.#.#",
            "#.#.#s..#...#",
            "#####.#####.#",
            "#g....d.....#",
            "#############"
        ]
    },
    {
        name: "The Trap",
        real: [
            "##############",
            "#............#",
            "######.#######",
            "#......#S....#",
            "#.####.#####.#",
            "#......D....G#",
            "##############"
        ],
        mirror: [
            "##############",
            "#...........@#",
            "#######.######",
            "#....s#......#",
            "#.#####.####.#",
            "#g....d......#",
            "##############"
        ]
    },
    {
        name: "Desync valley",
        real: [
            "##############",
            "#@...........#",
            "#............#",
            "#......S.....#",
            "#............#",
            "#.....D.....G#",
            "##############"
        ],
        mirror: [
            "##############",
            "#@..#...#...##",
            "#...#...#...##",
            "#.#...#...#.##",
            "#.###...###.##",
            "#g....d.....s#",
            "##############"
        ]
    },
    {
        name: "Nightmare",
        real: [
            "###############",
            "#@....#...#...#",
            "#####.D.#.#.#.#",
            "#S..#.#.#.#.#.#",
            "#.###.#.#.#.#.#",
            "#####.###.###.#",
            "#...........G.#",
            "###############"
        ],
        mirror: [
            "###############",
            "#...#...#....@#",
            "#.###.###.#####",
            "#.#.#.#.#.#..s#",
            "#.#.#.#.#.#####",
            "#.#.#.#.d.#####",
            "#.g...........#",
            "###############"
        ]
    },
    {
        name: "The Divide",
        real: [
            "#############",
            "#@..........#",
            "######.######",
            "#......#....#",
            "#.S....D..G.#",
            "######.######",
            "#...........#",
            "#############"
        ],
        mirror: [
            "#############",
            "#..........@#",
            "######.######",
            "#....#......#",
            "#.g..d....s.#",
            "######.######",
            "#...........#",
            "#############"
        ]
    },
    {
        name: "Grand Finale",
        real: [
            "##############",
            "#@.....#.....#",
            "###.##.D.##.##",
            "#...#..#..#..#",
            "#.S.#..#..#.G#",
            "#...#.....#..#",
            "##############"
        ],
        mirror: [
            "##############",
            "#.....#.....@#",
            "##.##.d.##.###",
            "#..#..#..#...#",
            "#g.#..#..#...#",
            "#..#.....#...#",
            "##############"
        ]
    }
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

document.addEventListener("DOMContentLoaded", () => {

    if(btnNext) btnNext.className = "pill-btn";
    if(btnRetry) btnRetry.className = "pill-btn";

    const howTitle = document.querySelector("#howOverlay h2");
    const rulesList = document.getElementById("rulesList");
    const controlsList = document.getElementById("controlsList");

    const openHow = (type) => {
        if (type === "RULES") {
            howTitle.textContent = "HOW TO PLAY";
            rulesList.classList.remove("hidden");
            controlsList.classList.add("hidden");
        } else {
            howTitle.textContent = "CONTROLS";
            rulesList.classList.add("hidden");
            controlsList.classList.remove("hidden");
        }
        howOverlay.classList.remove("hidden");
    };

    document.getElementById("howToPlayBtn").onclick = () => openHow("RULES");
    document.getElementById("btnControls").onclick = () => openHow("CONTROLS");
    document.getElementById("closeHowBtn").onclick = () =>
    howOverlay.classList.add("hidden");

    document.getElementById("btnSelectLevel").onclick = () => {
        generateLevelList();
        selectLevelOverlay.classList.remove("hidden");
    };
    document.getElementById("closeSelectBtn").onclick = () => selectLevelOverlay.classList.add("hidden");
    document.getElementById("btnFeatures").onclick = () => {
        featuresOverlay.classList.remove("hidden");
    };
    document.getElementById("closeFeaturesBtn").onclick = () => {
        featuresOverlay.classList.add("hidden");
    }
    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") {
            howOverlay.classList.add("hidden");
            selectLevelOverlay.classList.add("hidden");
            featuresOverlay.classList.add("hidden");
        }
    });

    loadLevel(0);
    gameLoop();
});

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

    levelDisplay.textContent = `LEVEL-${i + 1}`;

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
    updateDoors();
    resize();
    hideOverlay();
    selectLevelOverlay.classList.add("hidden");
}
function generateLevelList(){
    levelListContainer.innerHTML = "";
    levels.forEach((lvl, index) => {
        const btn = document.createElement("button");
        btn.classList.add("level-select-btn");

        if(index > maxUnlockedLevel){
            btn.classList.add("locked");
            btn.innerHTML = `Level ${index + 1} <br> <span style='font-size:1.2rem'>🔒</span>`;
            btn.disabled = true;
        } else {
            btn.textContent = `Level ${index + 1}`;
            btn.onclick = () => {
                nextSound.play();
                loadLevel(index);
            };
        }
        levelListContainer.appendChild(btn);
    });
}
function resize() {
    canvas.width = width * TILE * 2 + GAP;
    canvas.height = height * TILE;
}
window.addEventListener("resize", resize);

//movement
document.addEventListener("keydown", (e) => {
    if(e.key === "r"){
        playSound(restartSound);
        return loadLevel(currentLevel);
    }
    if(e.key === "n"){
        playSound(nextSound);
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
        playSound(moveSound);
        moveCount++;
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

        if(currentLevel === maxUnlockedLevel) {
            maxUnlockedLevel++;
            localStorage.setItem("reflectionMaxLevel", maxUnlockedLevel);
        }

        playSound(winSound);
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
    playSound(nextSound);
    loadLevel((currentLevel + 1) % levels.length);
};
btnRetry.onclick = () => {
    playSound(restartSound);
    loadLevel(currentLevel);
};
const btnLevelBack = document.getElementById("btnLevelBack");
if(btnLevelBack){
    btnLevelBack.onclick = () => {
        overlay.classList.add("hidden");
        generateLevelList();
        selectLevelOverlay.classList.remove("hidden")
    };
}

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
                ctx.fillStyle = "rgba(242,83,73,0.3)";
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
    const r = TILE * 0.3;
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;

    ctx.fillStyle = mirror ? "#f25349" : "#33d6a6";
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}
function drawDoor(px, py, realDoor) {
    const open = realDoor ? realDoorOpen : mirrorDoorOpen;

    ctx.fillStyle = open ? "#33d6a6" : "#f25349";
    ctx.lineWidth = 3;
    ctx.strokeRect(px + 10, py + 10, TILE - 20, TILE - 20);

    if(!open) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(px + 10, py + 10, TILE - 20, TILE - 20);
        ctx.globalAlpha = 1.0;
    }
    ctx.lineWidth = 1;
}

function drawSwitch(px, py, mirror) {
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;

    const isActive = mirror ? mirrorDoorOpen : realDoorOpen;
    ctx.fillStyle = mirror ? "#f25349" : "#61dafb";

    if(isActive) ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(cx - 15, cy - 6, 30, 12, 6);
    ctx.fill();
}

function drawPlayer(px, py, mirror) {
    const cx = px + TILE / 2;
    const cy = py + TILE / 2;
    const r = TILE * 0.3;

    ctx.fillStyle = mirror ? "#f25349" : "#61dafb";
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
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