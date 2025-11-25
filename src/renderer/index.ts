import { Game } from "../game/index.ts";
import { GameObject } from "../gameObject/index.ts";

export class Renderer {
  private _game: Game;
  constructor(game: Game) {
    this._game = game;
    this.paintObjects = this.paintObjects.bind(this);
  }

  public render(delta: number) {
    if (!this._game) {
      throw new Error('No game to render!');
    }
    const activeScene = this._game.activeScene;
    if (!activeScene) {
      throw new Error('No active scene to render!');
    }
    const objects = activeScene.objects;
    
    this.clearCanvas();
    this.paintObjects([...objects.values()]);
  }

  private getChildObjects(objects: GameObject[]): GameObject[] {
    const camera = this._game.camera;

    const childObjects = objects.map((object) => [...object.objects.values()]).flat();
    if (childObjects.length) {
      return [...objects, ...this.getChildObjects(childObjects)];
    }
    return objects;
  }

  private paintObjects(objects: GameObject[]) {
    const allObjects = this.getChildObjects(objects);
    
    const filteredObjects = [];
    const camera = this._game.camera;
    const cameraBounds = camera.bounds;

    for (let i = 0; i < allObjects.length; i++) {
      const object = allObjects[i];
      if (!object) continue;
      if (!object.image && !object.shapes?.length && !object.text) continue;
      if (object.detachFromCamera) {
        filteredObjects.push(object);
        continue;
      }
      const objectIsInCamera = object.position.x + object.width > cameraBounds.left && object.position.x < cameraBounds.right && object.position.y + object.height > cameraBounds.top && object.position.y < cameraBounds.bottom;
      if (!objectIsInCamera) continue;
      filteredObjects.push(object);
    }
    filteredObjects.sort((a, b) => {
      return a.renderLayer - b.renderLayer || (a.position.y + a.ySortOffset) - (b.position.y + b.ySortOffset);
    });

    this.paint(filteredObjects);
  }

  private paint(objects: GameObject[]) {
    const context = this._game.canvas.context;
    const camera = this._game.camera;

    if (!context) {
      throw new Error('No context provided to paint');
    }
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      if (object.name === 'Torch') {
        // debugger;
      }
      if (object.blendMode && object.blendMode !== context.globalCompositeOperation) {
        context.globalCompositeOperation = object.blendMode;
      }
      if (!object?.shapes?.length && !object.text && !object.image) continue;
      context.resetTransform();
      if (!object.detachFromCamera) {
        const {x, y} = camera.position;
        context.translate(-x, -y);
      }

      const {text, textFill, fill, stroke, strokeWidth, image, imagePadding} = object;

      // const stroke = object.stroke;
      const shape = object.shapes?.[0];
      
      if (shape && fill) {
        context.fillStyle = fill;
        const path = shape.path;
        if (!path) return;
        context.fill(path);
        if (stroke) {
          context.strokeStyle = stroke;
          context.lineWidth = strokeWidth ?? 2;
          context.stroke(path);
        }
      }
      if (text) {
        context.fillStyle = fill || textFill || 'black';
        context.font = object.font || '12px sans-serif';
        context.textBaseline = 'top';
        context.fillText(text, object.position.x, object.position.y);
      }
      if (image) {
        const { width, height, x, y } = object;
        context.imageSmoothingEnabled = false;
        if (imagePadding) {
          context.drawImage(image, x + imagePadding, y + imagePadding, width - (imagePadding * 2), height - (imagePadding * 2));
        } else {
          context.drawImage(image, x, y, width, height);
        } 
      }
      if (object.detachFromCamera) {
        const {x, y} = camera.position;
        context.translate(-x, -y);
      }
    }

  }

  /**
   * Clear the canvas at every frame before repainting
   **/ 
  private clearCanvas() {
    const {context, width, height} = this._game.canvas;
    context.clearRect(0, 0, width, height);
  }
}
