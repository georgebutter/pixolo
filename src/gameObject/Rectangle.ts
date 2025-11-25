import type { GameObjectConfig } from "./index.ts";
import { pointsToPath2D } from "../drawing/pointsToPath2D.ts";
import { Vector2 } from "../scalars/vector2.ts";
import type { Shape } from "./Shape.ts";
import { ShapeGameObject } from "./Shape.ts";

export class RectangleGameObject extends ShapeGameObject {
  
  constructor({...config}: GameObjectConfig) {
    super(config);
  }
  
  buildShape(): Shape[] {
    const {x, y, width, height, rotation} = this;

    const points = [
      new Vector2(x, y),
      new Vector2(x + width, y),
      new Vector2(x + width, y + height),
      new Vector2(x, y + height),
    ]
    // const rotatedPoints = rotatePoints(points, rotation, new Vector2(x + width / 2, y + height / 2));
    const path = pointsToPath2D(points);
    return [{
      path,
      points: points
    }]
  }
}