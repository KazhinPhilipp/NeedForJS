const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}
const setting = {
    start: false,
    score: 0,
    speed: 3,
    x: 0,
    y: 0,
    traffic: 3
}

const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game-area');
const car = document.createElement('div');

car.classList.add('car')

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
start.addEventListener('click', startGame);

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');
    const countLines = Math.floor(getQuantityElements(100));
    console.log('countLines', countLines);
    for (let i = 0; i <= countLines; i++) {
        const line = document.createElement('div');
        const position = (i * 100);
        line.classList.add('line');
        line.style.top = position + 'px';
        line.y = position;
        gameArea.appendChild(line);
    }

    for (let i = 1; i< getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const position = -100 * setting.traffic * (i + 1);
        const left = getRandomInt(0, gameArea.offsetWidth - 50);
        const numberCarBackground = getRandomInt(1, 3);

        enemy.classList.add('enemy');
        enemy.y = position;

        enemy.style.top = position + 'px';
        enemy.style.left = left + 'px';
        enemy.style.background = 'transparent url("./image/enemy' + numberCarBackground +'.png") center / cover no-repeat';

        gameArea.appendChild(enemy);
    }

    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function startRun(event) {
    if (keyExistsFromKeys(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event) {
    if (keyExistsFromKeys(event.key)) {
        event.preventDefault();
        keys[event.key] = false;
    }
}

function playGame() {
    console.log('Play game!');
    if (!setting.start) {
        return;
    }
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
        setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
        setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
        setting.y -= setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
        setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
}

function keyExistsFromKeys(key) {
    return Object.keys(keys).includes(key);
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemys = document.querySelectorAll('.enemy');
    enemys.forEach((enemy) => {
        enemy.y += (setting.speed / 2);
        enemy.style.top = enemy.y + 'px';
        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * setting.traffic;
            const left = getRandomInt(0, gameArea.offsetWidth - 50);
            enemy.style.left = left + 'px';
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
