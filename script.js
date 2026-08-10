const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const textBox = document.getElementById("text");
const codeBox = document.getElementById("code");


/* ==========================================
   CANVAS
========================================== */

const DESIGN_WIDTH = 1100;
const DESIGN_HEIGHT = 680;

canvas.width = DESIGN_WIDTH;
canvas.height = DESIGN_HEIGHT;

function resizeCanvas() {

    const scaleX =
        window.innerWidth / DESIGN_WIDTH;

    const scaleY =
        window.innerHeight / DESIGN_HEIGHT;

    const scale =
        Math.min(scaleX, scaleY);

    canvas.style.width =
        DESIGN_WIDTH * scale + "px";

    canvas.style.height =
        DESIGN_HEIGHT * scale + "px";

    canvas.style.position = "absolute";

    canvas.style.left =
        (window.innerWidth -
            DESIGN_WIDTH * scale) / 2 + "px";

    canvas.style.top =
        (window.innerHeight -
            DESIGN_HEIGHT * scale) / 2 + "px";
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* ==========================================
   TREE
========================================== */

const branches = [];
const flowers = [];


function createBranch(
    x,
    y,
    length,
    angle,
    width,
    depth
) {

    const endX =
        x +
        Math.cos(angle) *
        length;

    const endY =
        y +
        Math.sin(angle) *
        length;


    const currentBranch = {

        x1: x,
        y1: y,

        x2: endX,
        y2: endY,

        width: width,

        depth: depth,

        progress: 0,

        delay:
            (7 - depth) *
            170
    };


    branches.push(
        currentBranch
    );


    if (depth === 0) {

        flowers.push({

            x: endX,
            y: endY,

            size:
                3 +
                Math.random() * 3,

            rotation:
                Math.random() *
                Math.PI,

            alpha: 0,

            phase:
                Math.random() *
                Math.PI * 2
        });

        return;
    }


    const nextLength =
        length *
        (0.62 +
        Math.random() * 0.08);


    const spread =
        0.20 +
        Math.random() * 0.18;


    createBranch(

        endX,
        endY,

        nextLength,

        angle - spread,

        Math.max(
            1,
            width * 0.68
        ),

        depth - 1
    );


    createBranch(

        endX,
        endY,

        nextLength,

        angle + spread,

        Math.max(
            1,
            width * 0.68
        ),

        depth - 1
    );
}


function createTree() {

    branches.length = 0;

    flowers.length = 0;


    createBranch(

        DESIGN_WIDTH / 2,

        DESIGN_HEIGHT + 20,

        190,

        -Math.PI / 2,

        18,

        7
    );
}


createTree();


/* ==========================================
   DRAW BRANCHES
========================================== */

function drawBranch(branch) {

    const x =

        branch.x1 +

        (branch.x2 -
            branch.x1) *

        branch.progress;


    const y =

        branch.y1 +

        (branch.y2 -
            branch.y1) *

        branch.progress;


    ctx.beginPath();

    ctx.moveTo(
        branch.x1,
        branch.y1
    );

    ctx.lineTo(
        x,
        y
    );


    ctx.strokeStyle =
        "#795548";

    ctx.lineWidth =
        branch.width;

    ctx.lineCap =
        "round";

    ctx.stroke();
}


/* ==========================================
   DRAW FLOWERS
========================================== */

function drawFlower(
    flower,
    time
) {

    const movement =

        Math.sin(
            time / 900 +
            flower.phase
        ) * 2;


    ctx.save();


    ctx.translate(

        flower.x +
        movement,

        flower.y
    );


    ctx.rotate(
        flower.rotation
    );


    ctx.globalAlpha =
        flower.alpha;


    ctx.fillStyle =
        "#e91e63";


    ctx.font =
        `${flower.size * 5}px Arial`;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "♥",
        0,
        0
    );


    ctx.restore();
}


/* ==========================================
   TREE ANIMATION
========================================== */

const animationStart =
    performance.now();


function animateTree(time) {

    ctx.clearRect(
        0,
        0,
        DESIGN_WIDTH,
        DESIGN_HEIGHT
    );


    const elapsed =
        time -
        animationStart;


    /* Grow branches */

    for (
        const branch
        of branches
    ) {

        const start =
            branch.delay;


        const duration =
            900;


        branch.progress =

            Math.max(

                0,

                Math.min(

                    1,

                    (
                        elapsed -
                        start
                    ) /
                    duration
                )
            );


        drawBranch(
            branch
        );
    }


    /* Flowers appear after tree */

    if (
        elapsed > 4200
    ) {

        for (
            const flower
            of flowers
        ) {

            flower.alpha =

                Math.min(

                    1,

                    flower.alpha +
                    0.015
                );


            drawFlower(
                flower,
                time
            );
        }
    }


    requestAnimationFrame(
        animateTree
    );
}


requestAnimationFrame(
    animateTree
);


/* ==========================================
   BIRTHDAY MESSAGE
========================================== */

const messages = [

    "Hey you 💕",

    "Happy Birthday 🎂",

    "May God bless you 🌷",

    "And give u many happiness ❤️",

    "Just saying... you're pretty awesome 💞",

    "Sending good vibes and maybe a wink 😉",

    "Hope u have a great day today 💖"

];


function typeMessages() {

    textBox.style.display =
        "block";


    let line = 0;


    function nextLine() {

        if (
            line >=
            messages.length
        ) {

            return;
        }


        const span =
            document.createElement(
                "span"
            );


        span.className =
            "say";


        codeBox.appendChild(
            span
        );


        const message =
            messages[line];


        let character = 0;


        function typeCharacter() {

            if (
                character <
                message.length
            ) {

                span.textContent +=
                    message[
                        character
                    ];


                character++;


                setTimeout(

                    typeCharacter,

                    65
                );

            } else {

                line++;


                setTimeout(

                    nextLine,

                    400
                );
            }
        }


        typeCharacter();
    }


    nextLine();
}


/* ==========================================
   START MESSAGE
========================================== */

setTimeout(

    typeMessages,

    5200
);
