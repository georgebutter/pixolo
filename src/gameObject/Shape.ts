
import { GameObject, GameObjectConfig } from ".";
import { Vector2 } from "../scalars/vector2";

export abstract class ShapeGameObject extends GameObject {
  private _shapes: Shape[] = [];

  constructor({name = "Shape", ...config}: GameObjectConfig) {
    super({name, ...config});

    this._shapes = this.buildShape();
  }

  get shapes() {
    return this._shapes;
  }

  set shapes(shapes: Shape[]) {
    this._shapes = shapes;
  }

  abstract buildShape(): Shape[];

  onChangeShape() {
    this.shapes = this.buildShape();
  }
}

export type Shape = {
  path: Path2D;
  points: Array<Vector2>;
}