import { Vector2 } from "../scalars/vector2";

export const pointsToPath2D = (points: Array<Vector2>): Path2D => {
  const path = new Path2D();
  points.forEach((point, index) => {
    if (index === 0) {
      path.moveTo(point.x, point.y);
    } else {
      path.lineTo(point.x, point.y);
    }
  });
  path.closePath();
  return path;
}