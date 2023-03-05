//main canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;

//collision canvas
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d', {willReadFrequently: true});
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

//calculating time variables
let timeToNextRaven = 0;
let ravenInterval = 500;
let timeToNextEnemy2 = 0;
let enemy2Interval = 5000;
let lastTime = 0;
let score = 0;

let gameOver = false;
ctx.font = '2rem Impact';
const restartBtn = document.getElementById('restart');

restartBtn.addEventListener('click', ()=> {
    location.reload();
});

let directionXSpeed = 1;

let ravens = [];
class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width; 
        this.y = Math.random() * (canvas.height - this.height);
        this.directionXSpeed = directionXSpeed;
        this.directionX = Math.random() * 3 + (this.directionXSpeed*0.1);
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'img/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50+50;
        this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.8;
    }
    update(deltaTime){
        this.y += this.directionY;
        if (this.y < 0 || this.y > canvas.height - this.height){ 
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        if (this.x < 0 - this.width) this.markedForDeletion = true;

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0 , this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let enemy2 = [];
class Enemy2 {
    constructor(){
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width; 
        this.y = Math.random() * (canvas.height - this.height);
        this.directionXSpeed = directionXSpeed;
        this.directionX = Math.random() * 3 + (this.directionXSpeed*0.1);
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'img/enemy2.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50+5;
        this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = true;
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7;
        this.sound = new Audio();
        this.sound.src = 'audio/misc.wav';
    }
    update(deltaTime){

        if(this.x === canvas.width) this.sound.play();

        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;

        this.y < 0 && (this.y = 0);
        this.y > canvas.height - this.height && (this.y = canvas.height - this.height);

        this.x -= this.directionX;
        if (this.x < 0 - this.width) this.markedForDeletion = true;

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        particles.push(new Particle(this.x, this.y, this.width, this.color));
        if (this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0 , this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let particles = [];
class Particle {
    constructor (x, y, size, color){
        this.size = size;
        this.x = x+this.size/2 + Math.random() * 50 - 25;
        this.y = y+this.size/3  + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.3;
        if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
}

let startTime = new Date().getTime();

function timer() {
    let currentTime = new Date().getTime();
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

function drawScore(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score + ' | Hits: ' + (directionXSpeed-1) + ' | New enemies speed: ' + (directionXSpeed/10) + ' | Colorful ravens points: ' + directionXSpeed + ' | Bats points: ' + (directionXSpeed*2) + ' | ' + timer(), canvas.width/2, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score + ' | Hits: ' + (directionXSpeed-1) + ' | New enemies speed: ' + (directionXSpeed/10) + ' | Colorful ravens points: ' + directionXSpeed + ' | Bats points: ' + (directionXSpeed*2) + ' | ' + timer(), canvas.width/2+5, 80);
}

function drawGameOver(){
    sound = new Audio();
    sound.src = 'audio/gameover.wav';
    sound.play();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/3);
    ctx.fillText('Score: ' + score + ' | Hits: ' + (directionXSpeed-1) + ' | New enemies speed: ' + (directionXSpeed/10) + ' | Colorful ravens points: ' + directionXSpeed + ' | Bats points: ' + (directionXSpeed*2) + ' | ' + timer(), canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', canvas.width/2+5, canvas.height/3+5);
    ctx.fillText('Score: ' + score + ' | Hits: ' + (directionXSpeed-1) + ' | New enemies speed: ' + (directionXSpeed/10) + ' | Colorful ravens points: ' + directionXSpeed + ' | Bats points: ' + (directionXSpeed*2) + ' | ' + timer(), canvas.width/2+5, canvas.height/2+5);
    restartBtn.style.visibility = 'visible';
}

//animated explosion onclick
let explosions = []; 
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'img/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'audio/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if(this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/5, this.size, this.size);
    }
}

window.addEventListener('click', (e)=> {
    //collision detection via colors
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pixelColor = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pixelColor[0] &&
            object.randomColors[1] === pixelColor[1] &&
            object.randomColors[2] === pixelColor [2]){
                //collision detected
                object.markedForDeletion = true;
                object.hasTrail ? score += directionXSpeed : score++;
                directionXSpeed++;
                explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
    enemy2.forEach(object => {
        if (object.randomColors[0] === pixelColor[0] &&
            object.randomColors[1] === pixelColor[1] &&
            object.randomColors[2] === pixelColor [2]){
                //collision detected
                object.markedForDeletion = true;
                score+=(directionXSpeed*2);
                directionXSpeed++;
                explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
})

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    timeToNextEnemy2 += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort( (a, b) => {
            return a.width - b.width;
        });
    };
    if(timeToNextEnemy2 > enemy2Interval){
        enemy2.push(new Enemy2());
        timeToNextEnemy2 = 0;
        enemy2.sort( (a, b) => {
            return a.width - b.width;
        });
    };
    drawScore();
    [...particles, ...ravens, ...enemy2, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...enemy2, ...explosions,].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    enemy2 = enemy2.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);