export interface Rect {
    x: number,
    y: number,
    width: number,
    height: number
}

export interface Point {
    x: number,
    y: number
}

export function checkPointInsideRect(point: Point, rect: Rect): boolean {
    return point.x >= rect.x
        && point.y >= point.y
        && point.x <= rect.x + rect.width
        && point.y <= rect.y + rect.height;
}

export function isEqualPoints(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
}

export function calculateDistance(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}