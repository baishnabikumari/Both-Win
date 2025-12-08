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
let mirror