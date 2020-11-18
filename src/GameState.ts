import {Point, isEqualPoints, calculateDistance} from './Geom';
import PriorityQueue from "./PriorityQueue";

export enum CellType {
    EMPTY,
    BLOCKED,
}

interface PointAndCell {
    point: Point,
    cell: CellData,
}

export interface CellData {
    type: CellType,
    distance: number,
    visited: boolean,
}

export interface GameState {
    width: number,
    height: number,
    cells: CellData[][],
    queue: PriorityQueue<PointAndCell>,
    path: PointAndCell[],
    start?: PointAndCell,
    end?: PointAndCell,
    activeCell?: PointAndCell,
    running: boolean
}

function createDefaultGameState(widthUnits: number, heightUnits: number): GameState {
    return {
        width: widthUnits,
        height: heightUnits,
        running: false,
        queue: new PriorityQueue([]),

        cells: Array.from(Array(widthUnits), (): CellData[] => {
            return Array.from(Array(heightUnits), (): CellData => {
                return {type: CellType.EMPTY, distance: 0, visited: false};
            });
        }),
    }
}

function onClickLeft(gameState: GameState, hold: boolean) {
    if (!gameState.activeCell)
        return;

    const node = gameState.activeCell;

    if (hold)
        node.cell.type = CellType.BLOCKED;
    else
        node.cell.type = node.cell.type === CellType.BLOCKED ? CellType.EMPTY : CellType.BLOCKED;
}

function onClickRight(gameState: GameState) {
    if (!gameState.activeCell)
        return;

    const point = gameState.activeCell;

    if (!gameState.start) {
        gameState.start = point;
    } else if (!gameState.end)
        gameState.end = point;
    else if (gameState.start && gameState.end) {
        gameState.start = point;
        gameState.end = undefined;
    }
}

function startSimulation(gameState: GameState) {
    if (!gameState.running && gameState.start && gameState.end) {
        gameState.running = true;
        gameState.queue.enqueue(gameState.start, 0);
    }

    return gameState.running;
}


function isBlocked(gameState: GameState, point: Point): [boolean, PointAndCell?] {
    if (point.x < 0 || point.x >= gameState.width || point.y < 0 || point.y >= gameState.height)
        return [true, undefined];

    if (gameState.end && isEqualPoints(point, gameState.end.point))
        return [false, gameState.end];

    const cell = gameState.cells[point.x][point.y];
    const blocked = gameState.cells[point.x][point.y].type === CellType.BLOCKED;

    return [blocked, {point, cell}];
}

function getNeighbors(gameState: GameState, current: PointAndCell): PointAndCell[] {
    const neighbors: PointAndCell[] = [];

    const [blockedTop, topCell] = isBlocked(gameState, {x: current.point.x, y: current.point.y + 1});
    if (topCell && !blockedTop)
        neighbors.push(topCell);

    const [blockedLeft, leftCell] = isBlocked(gameState, {x: current.point.x - 1, y: current.point.y});
    if (leftCell && !blockedLeft)
        neighbors.push(leftCell);

    const [blockedRight, rightCell] = isBlocked(gameState, {x: current.point.x + 1, y: current.point.y});
    if (rightCell && !blockedRight)
        neighbors.push(rightCell);

    const [blockedBottom, bottomCell] = isBlocked(gameState, {x: current.point.x, y: current.point.y - 1});
    if (bottomCell && !blockedBottom)
        neighbors.push(bottomCell);

    return neighbors;
}

function stepSimulation(gameState: GameState) {
    if (!gameState.start || !gameState.end) {
        console.error("Should have start and end selected");
        return;
    }

    const current = gameState.queue.dequeue();

    if (!current) {
        gameState.running = false;
        return;
    }

    if (isEqualPoints(gameState.end.point, current.point)) {
        gameState.running = false;
        return;
    }

    getNeighbors(gameState, current)
        .filter(node => !node.cell.visited)
        .forEach(node => {
            node.cell.distance = calculateDistance(node.point, gameState.end.point);
            node.cell.visited = true;

            gameState.queue.enqueue(node, calculateDistance(node.point, gameState.end.point));
        });
}

function resetSimulation(gameState: GameState) {
    if (gameState.running)
        return;

    gameState.queue.clear();
    gameState.start = undefined;
    gameState.end = undefined;
    gameState.path = [];

    for (let i = 0; i < gameState.width; i++) {
        for (let j = 0; j < gameState.height; j++) {
            const cell = gameState.cells[i][j];
            cell.distance = 0;
            cell.visited = false;
        }
    }
}

export function createGame(widthUnits: number, heightUnits: number) {
    const gameState = createDefaultGameState(widthUnits, heightUnits);

    return {
        gameState,
        onClickLeft: (hold: boolean) => onClickLeft(gameState, hold),
        onClickRight: () => onClickRight(gameState),
        startSimulation: () => startSimulation(gameState),
        stepSimulation: () => stepSimulation(gameState),
        resetSimulation: () => resetSimulation(gameState)
    };
}