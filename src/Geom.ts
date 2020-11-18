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

export function isEqualPoints(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
}

export function calculateDistance(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}