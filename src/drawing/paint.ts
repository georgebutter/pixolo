export const paint = ({
  context,
  path,
  clear,
  fill,
  stroke,
}: Config) => {
  if (!context) {
    throw new Error('No context provided to paint');
  }
  context.resetTransform();
  if (clear) {
    context.clearRect(...clear)
  }
  if (!path) return;
  if (fill) {
    context.fillStyle = fill;
    context.fill(path);
  }
  if (stroke) {
    context.strokeStyle = "blue";
    context.lineWidth = 2;
    context.stroke(path);
  }

}

type Config = {
  context: CanvasRenderingContext2D;
  path?: Path2D;
  clear?: [x: number, y: number, width: number, height: number]
  fill?: string;
  stroke?: boolean;
}