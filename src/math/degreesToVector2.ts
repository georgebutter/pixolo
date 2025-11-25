import { Vector2, vector2 } from "../scalars/vector2";

export const degreesToVector2 = (degrees: number): Vector2 => {
  const radians = degrees * Math.PI / 180;
  return vector2(Math.cos(radians), Math.sin(radians));
}