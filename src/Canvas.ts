export function createCanvas(id: string, width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas)
        throw new Error('Could not find canvas');

    canvas.width = width;
    canvas.height = height;

    const graphics = canvas.getContext('2d');

    if (!graphics)
        throw new Error('Could not get 2d context');

    return [canvas, graphics];
}