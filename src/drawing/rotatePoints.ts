import { Vector2 } from "../scalars/vector2";

export const rotatePoints = (points: Array<Vector2>, angle: number, origin: Vector2): Array<Vector2> => {
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return points.map(point => {
    const x = point.x - origin.x;
    const y = point.y - origin.y;
    return new Vector2(
      x * cos - y * sin + origin.x,
      x * sin + y * cos + origin.y
    );
  });
}