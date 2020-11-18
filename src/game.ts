import {CellData, CellType, createGame} from './GameState';
import {createCanvas} from './Canvas';
import {checkPointInsideRect, Point, Rect} from './Geom';

const [canvas, graphics] = createCanvas('game-canvas', 1280, 720);
const {gameState, onClickLeft, onClickRight, startSimulation, stepSimulation, resetSimulation} = createGame(42, 17);

function calculateCellRect(point: Point): Rect {
    const cellWidth = 30;
    const cellHeight = 30;
    const yOffset = canvas.height / 4;

    return {
        x: point.x * cellWidth,
        y: yOffset + point.y * cellHeight,
        width: cellWidth,
        height: cellHeight
    };
}

function onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Enter') {
        startSimulation();
    }

    if (event.code === 'Escape') {
        resetSimulation();
    }
}

let leftMouseDown = false;

function onMouseDown(event: MouseEvent) {
    leftMouseDown = event.button === 0;
}

function onMouseMove(event: MouseEvent) {
    if (leftMouseDown) {
        onClickLeft(true);
    }

    const mousePoint: Point = {x: event.clientX, y: event.clientY};

    for (let i = 0; i < gameState.width; i++) {
        for (let j = 0; j < gameState.height; j++) {

            const point: Point = {x: i, y: j};
            const cell: CellData = gameState.cells[i][j];
            const cellRect = calculateCellRect(point);

            if (checkPointInsideRect(mousePoint, cellRect)) {
                gameState.activeCell = {point, cell};
                return;
            }
        }
    }
}

function onMouseRelease(event: MouseEvent) {
    if (!gameState.activeCell)
        return;

    if (event.button === 0) {
        leftMouseDown = false;
        onClickLeft(false);
    } else if (event.button === 2) {
        onClickRight();
    }
}

function renderGame() {
    graphics.clearRect(0, 0, canvas.width, canvas.height);

    graphics.fillStyle = '#FFFFFF';
    graphics.font = '30px Arial';
    graphics.fillText('Breadth First Search Visualizer', 0, 50, 400);

    graphics.font = '15px Arial';
    graphics.fillText('Left Click: Draw WALL', 0, 70, 400);
    graphics.fillText('Right Click: Draw Start / End', 0, 90, 400);
    graphics.fillText('Press Enter: Start Algorithim', 0, 110, 400);
    graphics.fillText('Press Esc: Reset Algorithim', 0, 130, 400);

    for (let i = 0; i < gameState.width; i++) {
        for (let j = 0; j < gameState.height; j++) {
            const cell = gameState.cells[i][j];
            const cellRect = calculateCellRect({x: i, y: j});

            graphics.lineWidth = 1;
            graphics.strokeStyle = '#bbbbc4';
            graphics.strokeRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);

            if (cell.type === CellType.EMPTY && cell.visited) {
                graphics.fillStyle = '#ffe1a6';
            } else {
                switch (cell.type) {
                    case CellType.EMPTY:
                        graphics.fillStyle = '#ffffff';
                        break;
                    case CellType.BLOCKED:
                        graphics.fillStyle = '#4747ab';
                        break;
                }
            }

            graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);

            if (cell.type === CellType.EMPTY && cell.visited) {
                graphics.font = '15px Times New Roman';
                graphics.fillStyle = '#15451d';
                graphics.fillText(cell.distance.toString(), cellRect.x + 5, cellRect.y + 20, 20);
            }
        }
    }

    if (gameState.start) {
        const cellRect = calculateCellRect(gameState.start.point);

        graphics.fillStyle = '#55a555';
        graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);
    }

    if (gameState.end) {
        const cellRect = calculateCellRect(gameState.end.point);

        graphics.fillStyle = '#8c2e2e';
        graphics.fillRect(cellRect.x, cellRect.y, cellRect.width, cellRect.height);

        if (gameState.end.cell.visited) {
            graphics.font = '15px Times New Roman';
            graphics.fillStyle = '#FFFFFF';
            graphics.fillText(gameState.end.cell.distance.toString(), cellRect.x + 5, cellRect.y + 20, 20);
        }
    }

    if (gameState.activeCell) {
        const cellRect = calculateCellRect(gameState.activeCell.point);

        graphics.strokeStyle = '#fdbd14';
        graphics.lineWidth = 3;
        graphics.strokeRect(cellRect.x + 1, cellRect.y + 1, cellRect.width, cellRect.height);
    }

    for (const node of gameState.queue) {
        const cellRect = calculateCellRect(node.point);

        graphics.strokeStyle = '#ba4aec';
        graphics.lineWidth = 3;
        graphics.strokeRect(cellRect.x + 1, cellRect.y + 1, cellRect.width, cellRect.height);
    }
}

function onGameUpdate() {
    if (gameState.running)
        stepSimulation();

    renderGame();

    requestAnimationFrame(onGameUpdate);
}

requestAnimationFrame(onGameUpdate);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseRelease);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('keyup', onKeyUp);
