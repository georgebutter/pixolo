import { DrawConfig } from "./rectangle";

export const rotatePath2D = (path: Path2D, config: DrawConfig): Path2D => {
  const p2 = new Path2D();
  const originX = config.x + config.width / 2;
  const originY = config.y + config.height / 2;

  p2.addPath(path, new DOMMatrix().translate(originX, originY).rotateSelf(config.rotation).translate(-originX, -originY))
  return p2;
}