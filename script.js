const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const textBox = document.getElementById("text");
const codeBox = document.getElementById("code");
const clockBox = document.getElementById("clock-box");
const clock = document.getElementById("clock");

let W = 1100;
let H = 680;

canvas.width = W;
canvas.height = H;


/* =========================================
   BIRTHDAY MESSAGE
========================================= */

const messages = [
    "Hey you 💕",
    "Happy Birthday 🎂",
    "May God bless you 🌷",
    "And give u many happiness ❤️",
    "Just saying... you're pretty awesome 💞",
    "Sending good vibes and maybe a wink 😉",
    "Hope u have a great day today 💖"
];

function showMessage() {

    textBox.style.display = "block";

    let line = 0;

    function typeLine() {

        if (line >= messages.length) {
            return;
        }

        const span = document.createElement("span");

        span.className = "say";

        codeBox.appendChild(span);

        const message = messages[line];

        let character = 0;

        function typeCharacter() {

            if (character < message.length) {

                span.textContent += message[character];

                character++;

                setTimeout(typeCharacter, 60);

            } else {

                line++;

                setTimeout(typeLine, 350);
            }
        }

        typeCharacter();
    }

    typeLine();
}


/* =========================================
   CLOCK
========================================= */

const startDate = new Date();

startDate.setDate(startDate.getDate() - 577);

function updateClock() {

    const now = new Date();

    let seconds =
        Math.floor(
            (now.getTime() - startDate.getTime()) / 1000
        );

    const days =
        Math.floor(seconds / 86400);

    seconds %= 86400;

    const hours =
        Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes =
        Math.floor(seconds / 60);

    seconds %= 60;

    clock.innerHTML =
        `<span class="digit">${days}</span> days ` +
        `<span class="digit">${hours}</span> hours ` +
        `<span class="digit">${minutes}</span> minutes ` +
        `<span class="digit">${seconds}</span> seconds`;
}


/* =========================================
   TREE DATA
========================================= */

const branches = [];
const flowers = [];

function addBranch(
    x,
    y,
    length,
    angle,
    thickness,
    depth
) {

    const endX =
        x + Math.cos(angle) * length;

    const endY =
        y + Math.sin(angle) * length;

    const branch = {
        x1: x,
        y1: y,
        x2: endX,
        y2: endY,
        thickness: thickness,
        depth: depth,
        progress: 0,
        delay: (7 - depth) * 180
    };

    branches.push(branch);

    if (depth <= 0) {

        flowers.push({
            x: endX,
            y: endY,
            size: 3 + Math.random() * 3,
            rotation: Math.random() * Math.PI,
            alpha: 0
        });

        return;
    }

    const nextLength =
        length * (0.62 + Math.random() * 0.08);

    const angleChange =
        0.22 + Math.random() * 0.18;

    addBranch(
        endX,
        endY,
        nextLength,
        angle - angleChange,
        Math.max(1, thickness * 0.68),
        depth - 1
    );

    addBranch(
        endX,
        endY,
        nextLength,
        angle + angleChange,
        Math.max(1, thickness * 0.68),
        depth - 1
    );
}


/* =========================================
   CREATE TREE
========================================= */

function createTree() {

    branches.length = 0;
    flowers.length = 0;

    addBranch(
        W / 2,
        H + 20,
        190,
        -Math.PI / 2,
        18,
        7
    );
}

createTree();


/* =========================================
   DRAW BRANCH
========================================= */

function drawBranch(branch) {

    const currentX =
        branch.x1 +
        (branch.x2 - branch.x1) *
        branch.progress;

    const currentY =
        branch.y1 +
        (branch.y2 - branch.y1) *
        branch.progress;

    ctx.beginPath();

    ctx.moveTo(
        branch.x1,
        branch.y1
    );

    ctx.lineTo(
        currentX,
        currentY
    );

    ctx.strokeStyle = "#795548";

    ctx.lineWidth =
        branch.thickness;

    ctx.lineCap = "round";

    ctx.stroke();
}


/* =========================================
   DRAW FLOWER
========================================= */

function drawFlower(flower, time) {

    const sway =
        Math.sin(
            time / 700 +
            flower.x
        ) * 2;

    ctx.save();

    ctx.translate(
        flower.x + sway,
        flower.y
    );

    ctx.rotate(
        flower.rotation
    );

    ctx.globalAlpha =
        flower.alpha;

    ctx.fillStyle = "#e91e63";

    ctx.font =
        `${flower.size * 5}px Arial`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText("♥", 0, 0);

    ctx.restore();
}


/* =========================================
   ANIMATION
========================================= */

const animationStart =
    performance.now();

function animate(time) {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    const elapsed =
        time - animationStart;


    /* Tree growth */

    for (const branch of branches) {

        const start =
            branch.delay;

        const duration = 900;

        branch.progress =
            Math.max(
                0,
                Math.min(
                    1,
                    (elapsed - start) /
                    duration
                )
            );

        drawBranch(branch);
    }


    /* Flowers */

    const flowerStart = 4000;

    if (elapsed > flowerStart) {

        for (const flower of flowers) {

            flower.alpha =
                Math.min(
                    1,
                    flower.alpha + 0.015
                );

            drawFlower(
                flower,
                time
            );
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =========================================
   START
========================================= */

clockBox.style.display = "block";

updateClock();

setInterval(
    updateClock,
    1000
);

requestAnimationFrame(
    animate
);


/* Start message after tree grows */

setTimeout(
    showMessage,
    5000
);
