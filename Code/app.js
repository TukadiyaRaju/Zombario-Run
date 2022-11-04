const mario = document.getElementById('mario');
const obstacle = document.getElementById('obstacle');
const zombie = document.getElementById('zombie');

let score = 0;

let jumpCount = 0;
let isOver = false;

let phrases = ["you performed better than the previous one. Cheers!", "this score is worse than the previous one.", "you performed well but better luck next time.", "keep it up, you are playing well.", "brillian Score!", "you did well, just need little more practice.", "come on, you can do it. Just try again!"];

let userData = {
    'name': '',
    'nickName': ''
};

document.getElementById('seeInstructions').onclick = () => {
    document.getElementById('overlay-container').style.display = 'flex';
    document.getElementById('instructions').style.display = 'grid'
}

document.getElementById('open-login').onclick = () => {
    document.getElementById('overlay-container').style.display = 'flex';
    document.getElementById('login').style.display = 'flex'
}

document.getElementById('start-game').onclick = () => {
    const input = document.getElementById('name');
    let name = input.value;
    if (name != "") {
        document.getElementById('home').style.display = 'none';
        userData['name'] = name;
        main();
        click = 0;
    }
    else {
        if (input.classList != 'shakeName') {
            input.classList.add("shakeName");
            setTimeout(() => {
                input.classList.remove('shakeName')
            }, 500)
        }
    }
}

document.getElementById('close').onclick = () => {
    document.getElementById('overlay-container').style.display = 'none';
    document.getElementById('instructions').style.display = 'none'
    document.getElementById('login').style.display = 'none'
}

function main() {
    document.getElementById('high-score').innerText = localStorage.getItem('high-score');

    bgm = new Audio('/assets/audio/mario_bg.mp3')
    gameOver = new Audio('/assets/audio/mario_die.mp3')
    jump = new Audio('/assets/audio/mario_jump.mp3')
    jump.volume = 0.4;
    bgm.play();
    bgm.loop = true;

    obstacle.style.animation = 'obstacle-move 2s infinite linear';

    document.body.onkeyup = (e) => {
        if (e.keyCode == 32) {
            clicked();
        }
    }

    window.onclick = () => {
        if (click != 0)
            clicked();
        else click++;
    }

    function clicked() {
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
            // window.onload=()=>{      
            //     document.getElementById('home').style.display='none';
            //     document.getElementById('game-over').style.display='none';
            //     main();
            // }
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

    let check = setInterval(() => {
        function getPositionAtCenter(element) {
            const { top, left, width, height } = element.getBoundingClientRect();
            return {
                x: left + width / 2,
                y: top + height / 2
            };
        }

        let marioX = parseInt(getPositionAtCenter(mario).x);
        let obstacleX = parseInt(getPositionAtCenter(obstacle).x);
        let marioY = parseInt(getPositionAtCenter(mario).y);
        let obstacleY = parseInt(getPositionAtCenter(obstacle).y);
        let zombieX = parseInt(getPositionAtCenter(zombie).x);

        if (obstacleX - zombieX < 250 && obstacleX - zombieX > -20) {
            if (zombie.classList != 'jump') {
                zombie.classList.add('jump')
                setTimeout(() => {
                    zombie.classList.remove('jump')
                }, 1000)
            }
        }

        if ((obstacleX - marioX > -55 && obstacleX - marioX < 55) && (obstacleY - marioY < 90)) {
            console.log(obstacleX - marioX)
            document.getElementById('game-over').classList.add('active')
            document.getElementById('final-score').innerText = score;

            zombie.classList.add('killed');
            zombie.style.left = marioX - parseInt(window.getComputedStyle(mario).getPropertyValue('width')) + 'px';

            obstacle.style.animation = 'none';

            obstacle.style.left = obstacleX - parseInt(window.getComputedStyle(obstacle).getPropertyValue('width')) / 2 + 'px';

            setTimeout(() => {
                isOver = true;
            }, 2000)

            bgm.pause();
            gameOver.play();
            clearInterval(check)

            if (score > localStorage.getItem('high-score')) document.getElementById('phrase').innerText = `${userData['name']}, ${phrases[0]}`
            else
                document.getElementById('phrase').innerText = `${userData['name']}, ${phrases[1 + Math.floor(Math.random() * 6)]}`

            if (localStorage.getItem('high-score') < score) {
                localStorage.setItem('high-score', score)
            }

            if (localStorage.getItem('high-score') == undefined) {
                document.getElementById('final-high-score').innerText = score;
            }
            else {
                document.getElementById('final-high-score').innerText = localStorage.getItem('high-score');
            }
        }
        else {
            score++;
            document.getElementById('score').innerText = score;
        }
    }, 150);
}

document.getElementById('play-again').onclick = () => {
    window.location.reload()
    // window.onload=()=>{      
    //     document.getElementById('home').style.display='none';
    //     document.getElementById('game-over').style.display='none';
    //     main();
    // }
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