import { Game } from "../game";
import { GameObject } from "../gameObject";

export class Inputs {
  private _game: Game;
  private _keys: KeyRecord = {};
  constructor(game: Game) {
    this._game = game;
    this.registerEventListeners = this.registerEventListeners.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this._game.canvas.canvas.addEventListener("click", this.handleCanvasClick);
    this._game.canvas.canvas.addEventListener("contextmenu", this.handleRightClick);
    this._game.canvas.canvas.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  private handleMouseMove(event: MouseEvent) {
    const game = this._game;
    const canvas = game.canvas.canvas;
    const {x, y} = event;
    const rect = canvas.getBoundingClientRect();
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;
    const camera = game.camera;
    const cameraX = camera.position.x;
    const cameraY = camera.position.y;
    const gameObjects = game.activeScene.objects;
    this.handleMouseOverEvent(gameObjects, event, mouseX + cameraX, mouseY + cameraY, 0);
  }

  private handleMouseOverEvent(objects: Map<string, GameObject>, event: MouseEvent, mouseX: number, mouseY: number, depth: number) {
    for (const [name, object] of objects) {
      const {x, y, width, height} = object;
      const childObjects = object.objects;
      if (childObjects.size) {
        this.handleMouseOverEvent(childObjects, event, mouseX, mouseY, depth + 1);
      }
      if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {
        object.mouseIsOver = true;
      } else {
        object.mouseIsOver = false;
      }
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    const key = event.key;
    this._keys[key] = false;
  }

  private handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    const key = event.key;
    this._keys[key] = true;
  }

  private handleCanvasClick(event: MouseEvent) {
    const game = this._game;
    const canvas = game.canvas.canvas;
    // Get the game object under the cursor
    const {x, y} = event;
    const rect = canvas.getBoundingClientRect();
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;
    const camera = game.camera;
    const cameraX = camera.position.x;
    const cameraY = camera.position.y;
    const gameObjects = game.activeScene.objects;
    this.handleClickEvent(gameObjects, event, mouseX + cameraX, mouseY + cameraY, 0);
  }

  private handleClickEvent(objects: Map<string, GameObject>, event: MouseEvent, mouseX: number, mouseY: number, depth: number) {
    for (const [name, object] of objects) {
      const {x, y, width, height} = object;
      const childObjects = object.objects;
      if (childObjects.size) {
        this.handleClickEvent(childObjects, event, mouseX, mouseY, depth + 1);
      }
      if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {
        object.onClick?.(event);
      }
    }
  }

  public isKeyDown(key: KeyboardEvent["key"]) {
    return this._keys[key] || false;
  }

  public destroy() {
    this._game.canvas.canvas.removeEventListener("click", this.handleCanvasClick);
    this._game.canvas.canvas.removeEventListener("contextmenu", this.handleRightClick);
    this._game.canvas.canvas.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}


type KeyRecord = Record<KeyboardEvent["key"], boolean>