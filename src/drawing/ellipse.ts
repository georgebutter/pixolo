import { Shape } from "../gameObject/Shape";
import { Vector2 } from "../scalars/vector2";

export const ellipse = ({ x, y }: Vector2, w: number, h: number, origin: Vector2 = new Vector2(0, 0)): Shape[] => {
  const path = new Path2D();
  const w2 = w / 2;
  const h2 = h / 2;
  const pos2 = new Vector2(x - (w * origin.x), y - (h * origin.y));
  path.ellipse(pos2.x + w2, pos2.y + h2, w2, h2, Math.PI, 0, 2 * Math.PI);

  return [{
    path,
    points: [
      new Vector2(pos2.x, pos2.y),
      new Vector2(pos2.x + w, pos2.y),
      new Vector2(pos2.x + w, pos2.y + h),
      new Vector2(pos2.x, pos2.y + h),
    ]
  }]
}