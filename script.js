const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const textBox = document.getElementById("text");
const code = document.getElementById("code");
const clockBox = document.getElementById("clock-box");
const clock = document.getElementById("clock");

let width;
let height;

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* -----------------------------------
   TREE
----------------------------------- */

const branches = [];

function createBranch(x, y, length, angle, thickness) {

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    branches.push({
        x1: x,
        y1: y,

        x2: endX,
        y2: endY,

        progress: 0,

        thickness: thickness
    });

    return {
        x: endX,
        y: endY
    };
}


function drawBranch(branch) {

    const x =
        branch.x1 +
        (branch.x2 - branch.x1) * branch.progress;

    const y =
        branch.y1 +
        (branch.y2 - branch.y1) * branch.progress;

    ctx.beginPath();

    ctx.moveTo(branch.x1, branch.y1);

    ctx.lineTo(x, y);

    ctx.strokeStyle = "#8b5a3c";

    ctx.lineWidth = branch.thickness;

    ctx.lineCap = "round";

    ctx.stroke();
}


/* -----------------------------------
   HEART / FLOWER PARTICLES
----------------------------------- */

const flowers = [];

function createFlower(x, y) {

    flowers.push({
        x: x,
        y: y,

        size: 2 + Math.random() * 4,

        alpha: 0,

        targetAlpha: 0.8 + Math.random() * 0.2
    });
}


function drawFlower(flower) {

    if (flower.alpha < flower.targetAlpha) {
        flower.alpha += 0.01;
    }

    ctx.save();

    ctx.globalAlpha = flower.alpha;

    ctx.fillStyle = "#e32636";

    ctx.font = `${flower.size * 4}px Arial`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText("♥", flower.x, flower.y);

    ctx.restore();
}


/* -----------------------------------
   BUILD TREE
----------------------------------- */

const treeBranches = [];

function buildTree() {

    const baseX = width / 2;

    const baseY = height + 20;

    const topY = height * 0.22;

    const trunkHeight = baseY - topY;

    const trunk = createBranch(
        baseX,
        baseY,
        trunkHeight,
        -Math.PI / 2,
        18
    );

    treeBranches.push(branches[branches.length - 1]);

    const topX = trunk.x;
    const top = trunk.y;


    /* left branches */

    const left1 = createBranch(
        topX,
        top + 100,
        180,
        -2.65,
        10
    );

    treeBranches.push(branches[branches.length - 1]);


    const left2 = createBranch(
        topX - 20,
        top + 180,
        190,
        -2.75,
        8
    );

    treeBranches.push(branches[branches.length - 1]);


    const left3 = createBranch(
        topX - 10,
        top + 260,
        160,
        -2.9,
        6
    );

    treeBranches.push(branches[branches.length - 1]);


    /* right branches */

    const right1 = createBranch(
        topX,
        top + 120,
        190,
        -0.5,
        10
    );

    treeBranches.push(branches[branches.length - 1]);


    const right2 = createBranch(
        topX + 10,
        top + 220,
        180,
        -0.35,
        8
    );

    treeBranches.push(branches[branches.length - 1]);


    const right3 = createBranch(
        topX + 10,
        top + 290,
        150,
        -0.2,
        6
    );

    treeBranches.push(branches[branches.length - 1]);


    /* flowers */

    for (let i = 0; i < 180; i++) {

        const angle =
            Math.random() * Math.PI * 2;

        const radius =
            50 + Math.random() * 250;

        const x =
            topX +
            Math.cos(angle) * radius;

        const y =
            top + 40 +
            Math.sin(angle) * radius * 0.7;

        createFlower(x, y);
    }
}

buildTree();


/* -----------------------------------
   TREE ANIMATION
----------------------------------- */

let branchProgress = 0;

function animateTree() {

    ctx.clearRect(0, 0, width, height);

    branchProgress += 0.006;

    if (branchProgress > 1) {
        branchProgress = 1;
    }

    for (const branch of treeBranches) {

        branch.progress = branchProgress;

        drawBranch(branch);
    }

    if (branchProgress >= 1) {

        for (const flower of flowers) {
            drawFlower(flower);
        }
    }

    requestAnimationFrame(animateTree);
}

animateTree();


/* -----------------------------------
   TYPEWRITER
----------------------------------- */

const messages = document.querySelectorAll(".say");

function typeMessage(element, callback) {

    const originalText = element.textContent;

    element.textContent = "";

    element.style.opacity = "1";

    let index = 0;

    function typeCharacter() {

        if (index < originalText.length) {

            element.textContent += originalText.charAt(index);

            index++;

            setTimeout(typeCharacter, 55);

        } else {

            if (callback) {
                setTimeout(callback, 250);
            }
        }
    }

    typeCharacter();
}


function startMessages(index = 0) {

    if (index >= messages.length) {
        return;
    }

    typeMessage(
        messages[index],
        () => startMessages(index + 1)
    );
}


/* -----------------------------------
   CLOCK
----------------------------------- */

const startDate = new Date();

startDate.setDate(startDate.getDate() - 577);


function updateClock() {

    const now = new Date();

    const difference =
        now.getTime() -
        startDate.getTime();

    let seconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(seconds / 86400);

    seconds %= 86400;

    const hours =
        Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes =
        Math.floor(seconds / 60);

    seconds %= 60;

    clock.textContent =
        `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}


/* -----------------------------------
   START
----------------------------------- */

setTimeout(() => {

    textBox.style.display = "block";

    clockBox.style.display = "block";

    startMessages();

}, 2500);


setInterval(updateClock, 1000);

updateClock();
