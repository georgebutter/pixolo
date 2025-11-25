import { Game } from "../game";
import { GameObject } from "../gameObject";
import { Vector2 } from "../scalars/vector2";

export class Camera {
  private _game: Game;
  private _position: Vector2 = new Vector2(0, 0);
  public clampTo: Vector2 | undefined = undefined;
  constructor(game: Game) {
    this._game = game;
  }

  moveTo(vec: Vector2) {
    this.position = vec.subtract(new Vector2(Math.floor(this._game.canvas.width / 2), Math.floor(this._game.canvas.height / 2)));
  }

  moveBy(vec: Vector2) {
    this.position = this._position.add(vec);
  }

  follow(obj: GameObject) {
    this.moveTo(obj.position);
  }

  get bounds() {
    return {
      top: this.position.y,
      left: this.position.x,
      right: this.position.x + this._game.canvas.width,
      bottom: this.position.y + this._game.canvas.height,
    };
  }

  get position() {
    return this._position;
  }

  set position(vec: Vector2) {
    if (this.clampTo) {
      const canvasWidth = this._game.canvas.width;
      const canvasHeight = this._game.canvas.height;
      
      const x = Math.max(0, Math.min(vec.x, this.clampTo.x - canvasWidth));
      const y = Math.max(0, Math.min(vec.y, this.clampTo.y - canvasHeight));
      this._position = new Vector2(x, y);
    } else {
      this._position = vec;
    }
  }
}