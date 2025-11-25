import { Vector2 } from "../scalars/vector2.ts";

export const degreesToVector2 = (degrees: number): Vector2 => {
  const radians = degrees * Math.PI / 180;
  return new Vector2(Math.cos(radians), Math.sin(radians));
}