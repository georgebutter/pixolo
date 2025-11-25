

import { GameObject, GameObjectConfig } from ".";
import { Vector2 } from "../scalars/vector2";

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