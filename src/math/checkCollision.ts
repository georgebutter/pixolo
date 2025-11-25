import { Vector2 } from "../scalars/vector2.ts";
import { intersects } from "./intersects.ts";

export const checkCollision = (a: Array<Array<Vector2>>, b: Array<Array<Vector2>>): boolean => {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (intersects(a[i], b[j])) {
        return true;
      }
    }
  }
  return false;
}