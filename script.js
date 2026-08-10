/* =========================
   START BUTTON
========================= */

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const main = document.getElementById("main");
const audio = document.getElementById("myAudio");

startButton.addEventListener("click", function () {

    // Start music
    audio.play().catch(function(error) {
        console.log("Audio could not start:", error);
    });

    // Hide start screen
    startScreen.style.display = "none";

    // Show main page
    main.style.display = "block";

    // Start messages
    showMessages();

    // Start animation
    startAnimation();

});


/* =========================
   BIRTHDAY MESSAGES
========================= */

function showMessages() {

    const messages = document.querySelectorAll(".say");

    messages.forEach(function(message, index) {

        setTimeout(function() {

            message.classList.add("show");

        }, index * 1800);

    });

}


/* =========================
   SIMPLE HEART ANIMATION
========================= */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let hearts = [];


function createHeart() {

    return {
        x: Math.random() * canvas.width,

        y: canvas.height + 20,

        size: Math.random() * 12 + 8,

        speed: Math.random() * 1.5 + 0.5,

        opacity: Math.random() * 0.7 + 0.3,

        drift: Math.random() * 2 - 1
    };

}


function drawHeart(x, y, size, opacity) {

    ctx.save();

    ctx.globalAlpha = opacity;

    ctx.fillStyle = "#ff5fa2";

    ctx.beginPath();

    ctx.moveTo(x, y + size / 4);

    ctx.bezierCurveTo(
        x - size,
        y - size / 2,
        x - size,
        y + size,
        x,
        y + size
    );

    ctx.bezierCurveTo(
        x + size,
        y + size,
        x + size,
        y - size / 2,
        x,
        y + size / 4
    );

    ctx.fill();

    ctx.restore();

}


function startAnimation() {

    // Create initial hearts
    for (let i = 0; i < 50; i++) {

        let heart = createHeart();

        heart.y = Math.random() * canvas.height;

        hearts.push(heart);

    }

    animate();

}


function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    hearts.forEach(function(heart) {

        heart.y -= heart.speed;

        heart.x += heart.drift * 0.2;

        drawHeart(
            heart.x,
            heart.y,
            heart.size,
            heart.opacity
        );


        // Reset heart when it reaches the top
        if (heart.y < -30) {

            heart.x = Math.random() * canvas.width;

            heart.y = canvas.height + 30;

        }

    });


    requestAnimationFrame(animate);

}


/* =========================
   RESPONSIVE CANVAS
========================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;

    canvas.height = Math.min(
        680,
        window.innerHeight
    );

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);
