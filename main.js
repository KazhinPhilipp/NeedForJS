const MAX_ENEMY = 3;
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}
const SETTING = {
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

const audio = document.createElement('embed');
audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
setStyleToElement(audio, 'position', 'absolute');
setStyleToElement(audio, 'top', '-1000px');

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
    gameArea.innerHTML = '';
    const countLines = Math.floor(getQuantityElements(100));
    for (let i = 0; i <= countLines; i++) {
        const line = document.createElement('div');
        const position = (i * 100);

        addClassToElement(line, 'line');
        setStyleToElement(line, 'top', `${position}px`);

        line.y = position;
        gameArea.append(line);
    }

    for (let i = 1; i < getQuantityElements(100 * SETTING.traffic); i++) {
        const enemy = document.createElement('div');
        const position = -100 * SETTING.traffic * (i + 1);
        const left = getRandomInt(0, gameArea.offsetWidth - 50);
        const numberCarBackground = getRandomInt(1, MAX_ENEMY);

        addClassToElement(enemy, 'enemy');
        enemy.y = position;

        setStyleToElement(enemy, 'top', `${position}px`);
        setStyleToElement(enemy, 'left', `${left}px`);
        setStyleToElement(enemy, 'background', `transparent url("./image/enemy${numberCarBackground}.png") center / cover no-repeat`);

        gameArea.append(enemy);
    }

    SETTING.score = 0;
    SETTING.start = true;
    gameArea.append(car);
    setStyleToElement(car, 'left', `${gameArea.offsetWidth / 2 - car.offsetWidth / 2}px`);
    setStyleToElement(car, 'bottom', '10px');
    setStyleToElement(car, 'top', 'auto');
    gameArea.append(audio);
    SETTING.x = car.offsetLeft;
    SETTING.y = car.offsetTop;
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
    if (!SETTING.start) {
        return;
    }
    SETTING.score += SETTING.speed;
    score.textContent = `SCORE: ${SETTING.score}`;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && SETTING.x > 0) {
        SETTING.x -= SETTING.speed;
    }
    if (keys.ArrowRight && SETTING.x < (gameArea.offsetWidth - car.offsetWidth)) {
        SETTING.x += SETTING.speed;
    }
    if (keys.ArrowUp && SETTING.y > score.offsetHeight) {
        SETTING.y -= SETTING.speed;
    }
    if (keys.ArrowDown && SETTING.y < (gameArea.offsetHeight - car.offsetHeight)) {
        SETTING.y += SETTING.speed;
    }
    setStyleToElement(car, 'left', `${SETTING.x}px`);
    setStyleToElement(car, 'top', `${SETTING.y}px`);

    requestAnimationFrame(playGame);
}

function keyExistsFromKeys(key) {
    return Object.keys(keys).includes(key);
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) => {
        line.y += SETTING.speed;
        setStyleToElement(line, 'top', `${line.y}px`);
        if (line.y >= getDocumentClientHeight()) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemys = document.querySelectorAll('.enemy');
    enemys.forEach((enemy) => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom
            && carRect.right >= enemyRect.left
            && carRect.left <= enemyRect.right
            && carRect.bottom >= enemyRect.top) {
            endGame();
        }

        enemy.y += (SETTING.speed / 2);
        setStyleToElement(enemy, 'top', `${enemy.y}px`);
        if (enemy.y >= getDocumentClientHeight()) {
            const left = getRandomInt(0, gameArea.offsetWidth - 50);
            enemy.y = -100 * SETTING.traffic;
            setStyleToElement(enemy, 'left', `${left}px`);
        }
    });
}

function endGame() {
    const localStorageScore = +localStorage.getItem('score');
    if (localStorageScore && localStorageScore < SETTING.score) {
        alert('Поздравляю! Вы побили рекорд!');
    }
    if (!localStorageScore || localStorageScore < SETTING.score) {
        localStorage.setItem('score', SETTING.score);
    }
    SETTING.start = false;
    start.classList.remove('hide');
    audio.remove();
    setStyleToElement(start, 'top', `${score.offsetHeight}px`)
    console.warn('End game!');
}
