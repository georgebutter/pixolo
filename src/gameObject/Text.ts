

import { GameObject } from "./index.ts";
import type { GameObjectConfig } from "./index.ts";
import { Vector2 } from "../scalars/vector2.ts";

export abstract class TextGameObject extends GameObject {

  constructor({name = 'Text', ...config}: GameObjectConfig) {
    super({
      name,
      ...config
    });
  }



}

export type Text = {
  path: Path2D;
  points: Array<Vector2>;
}