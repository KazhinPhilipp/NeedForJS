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

addClassToElement(car, 'car');

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
start.addEventListener('click', startGame);

function getQuantityElements(heightElement) {
    return getDocumentClientHeight() / heightElement + 1;
}

function getDocumentClientHeight() {
    return document.documentElement.clientHeight;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addClassToElement(element, className) {
    element.classList.add(className);
}

function setStyleToElement(element, attribute, value) {
    element.style[attribute] = value;
}

function startGame() {
    addClassToElement(start, 'hide');
    const countLines = Math.floor(getQuantityElements(100));
    for (let i = 0; i <= countLines; i++) {
        const line = document.createElement('div');
        const position = (i * 100);

        addClassToElement(line, 'line');
        setStyleToElement(line, 'top', `${position}px`);

        line.y = position;
        gameArea.appendChild(line);
    }

    for (let i = 1; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const position = -100 * setting.traffic * (i + 1);
        const left = getRandomInt(0, gameArea.offsetWidth - 50);
        const numberCarBackground = getRandomInt(1, 3);

        addClassToElement(enemy, 'enemy');
        enemy.y = position;

        setStyleToElement(enemy, 'top', `${position}px`);
        setStyleToElement(enemy, 'left', `${left}px`);
        setStyleToElement(enemy, 'background', `transparent url("./image/enemy${numberCarBackground}.png") center / cover no-repeat`);

        gameArea.appendChild(enemy);
    }

    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function startRun(event) {
    if (!keyExistsFromKeys(event.key)) {
        return;
    }
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    if (!keyExistsFromKeys(event.key)) {
        return;
    }
    event.preventDefault();
    keys[event.key] = false;
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
    setStyleToElement(car, 'left', `${setting.x}px`);
    setStyleToElement(car, 'top', `${setting.y}px`);

    requestAnimationFrame(playGame);
}

function keyExistsFromKeys(key) {
    return Object.keys(keys).includes(key);
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.y += setting.speed;
        setStyleToElement(line, 'top', `${line.y}px`);
        if (line.y >= getDocumentClientHeight()) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemys = document.querySelectorAll('.enemy');
    enemys.forEach((enemy) => {
        enemy.y += (setting.speed / 2);
        setStyleToElement(enemy, 'top', `${enemy.y}px`);
        if (enemy.y >= getDocumentClientHeight()) {
            const left = getRandomInt(0, gameArea.offsetWidth - 50);
            enemy.y = -100 * setting.traffic;
            setStyleToElement(enemy, 'left', `${left}px`);
        }
    });
}
