const mario = document.getElementById('mario');
const obstacle = document.getElementById('obstacle');
const zombie = document.getElementById('zombie');

let score = 0;

document.getElementById('high-score').innerText = localStorage.getItem('high-score');

bgm = new Audio('/assets/audio/mario_bg.mp3')
gameOver = new Audio('/assets/audio/mario_die.mp3')
jump = new Audio('/assets/audio/mario_jump.mp3')
bgm.play();
let bgmRepeat = setInterval(() => {
    if (!isOver)
    bgm.play();
}, 578000);

let jumpCount = 0;
let isOver = false;

document.getElementById('seeInstructions').onclick=()=>{
    document.getElementById('overlay-container').style.display='flex';
    document.getElementById('instructions').style.display='grid'
}

document.getElementById('open-login').onclick=()=>{
    document.getElementById('overlay-container').style.display='flex';
    document.getElementById('login').style.display='flex'
}

document.getElementById('start-game').onclick=()=>{
    const input=document.getElementById('name');
    let name=input.value;
    if (name!="") {
        //save name and show it wherever you have to show
        document.getElementById('home').style.display='none';
        main();
    }
    else {
        if (input.classList!='shakeName') {
            input.classList.add("shakeName");
            setTimeout(() => {
                input.classList.remove('shakeName')
            }, 500)
        }
    }
}

document.getElementById('close').onclick=()=>{
    document.getElementById('overlay-container').style.display='none';
    document.getElementById('instructions').style.display='none'
    document.getElementById('login').style.display='none'
}

function main() {
    obstacle.style.animation='obstacle-move 2s infinite linear';

    document.body.onkeyup = (e) => {
        if (e.keyCode == 32) {
    
            if (!isOver) {
                if (mario.classList != 'jump') {
                    mario.classList.add('jump')
                    setTimeout(() => {
                        mario.classList.remove('jump')
                        jumpCount++;
                    }, 1000)
                }
            }
            else {
                window.location.reload()
            }
    
    
            if (jumpCount >= 2) {
                setTimeout(() => {
                    animationDuration = parseFloat(window.getComputedStyle(obstacle).getPropertyValue('animation-duration'));
                    obstacle.style.animationDuration = animationDuration - 0.1 + 's'
                    jumpCount = 0;
                }, 1000)
            }
    
            jump.play();
        }
    }
    
    let check = setInterval(() => {
        let marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue('bottom'));
        let marioLeft = parseInt(window.getComputedStyle(mario).getPropertyValue('left'));
    
        let obsRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    
        let zombieRight = parseInt(window.getComputedStyle(zombie).getPropertyValue('right'));
        // console.log(zombieRight-obsRight)
    
        if (zombieRight - obsRight <= 150 && zombieRight - obsRight >= -100) {
            if (zombie.classList != 'jump')
                zombie.classList.add('jump')
        }
        if (zombieRight - obsRight < 500 && zombieRight - obsRight > 150) {
            zombie.classList.remove('jump')
        }
    
        if (obsRight - marioLeft <= 450 && obsRight - marioLeft >= 270 && marioBottom < 200) {
            document.getElementById('game-over').classList.add('active')
            document.getElementById('final-score').innerText = score;
    
            if (localStorage.getItem('high-score') < score) {
                localStorage.setItem('high-score', score)
            }
    
            if (localStorage.getItem('high-score') == undefined) {
                document.getElementById('final-high-score').innerText = score;
            }
            else {
                document.getElementById('final-high-score').innerText = localStorage.getItem('high-score');
            }
    
            zombie.classList.add('killed');
            zombie.style.left = '250px';
    
            obstacle.style.animation = 'none';
            mario.style.animation = 'none';
    
            obstacle.style.left = '35vw';
    
            setTimeout(() => {
                isOver = true;
            }, 2000)
    
            bgm.pause();
            gameOver.play();
            clearInterval(check)
        }
        else {
            score++;
            document.getElementById('score').innerText = score;
        }
    }, 100);
}

document.getElementById('play-again').onclick = () => {
    window.location.reload()
}




function rotateScreen() {
    if (window.screen.width < 600) {
        document.getElementById('rotate-meme').style.display = 'flex';
        document.getElementById('game').style.display = 'none';
        bgm.pause()
    }
}

rotateScreen()

window.addEventListener('orientationchange', () => {
    rotateScreen()
    window.location.reload();
})