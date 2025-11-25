import { GameObject } from "./index.ts";
import type { GameObjectConfig } from "./index.ts";
import { pointsToPath2D } from "../drawing/pointsToPath2D.ts";
import { Vector2 } from "../scalars/vector2.ts";
import type { Shape } from "./Shape.ts";

export class UIRect extends GameObject {
  _matchWindowSize: boolean = false;
  private _shapes: Shape[] | undefined = [];
  public renderLayer: number = 10;
  private _justifyItems: Justify | undefined;
  private _anchor: Anchors | undefined;
  private _anchorTo: GameObject | undefined;
  constructor({ name = "UIRect", ...config }: GameObjectConfig) {
    super({
      name,
      ...config,
    });
    

  }
  
  anchorToBottom = () => {
    const parent = this.anchorTo || this.game.canvas;
    this.position = new Vector2((parent.width / 2) - (this.width / 2), parent.height - this.height - 16);
  }

  anchorToLeft = () => {
    const parent = this.anchorTo || this.game.canvas;
    this.position = new Vector2(parent.x, parent.y + (parent.height / 2) - this.height / 2);
  }

  anchorToTopLeft = () => {
    const parent = this.anchorTo || this.game.canvas;
    this.position = new Vector2(parent.x, parent.y);
  }

  anchorToTopRight = () => {
    const parent = this.anchorTo || this.game.canvas;
    this.position = new Vector2(parent.x + parent.width - this.width, parent.y);
  }

  anchorToBottomLeft = () => {
    const parent = this.anchorTo || this.game.canvas;
    this.position = new Vector2(parent.x, parent.y + parent.height - this.height);
  }

  onParentShapeChanged() {
    this.handleAnchor();
    this.handleJustify();
  }

  onChildObjectsChanged(): void {
    this.handleJustify();
  }

  handleAnchor() {
    if (!this.anchor) return;
    if (this.anchor === 'top-right') {
      this.anchorToTopRight();
    } else if (this.anchor === 'bottom') {
      this.anchorToBottom();
    } else if (this.anchor === 'bottom-left') {
      this.anchorToBottomLeft();
    } else if (this.anchor === 'left') {
      this.anchorToLeft();
    } else if (this.anchor === 'top-left') {
      this.anchorToTopLeft();
    }
  }

  handleJustify() {
    if (!this.justifyItems) return;

    if (this.justifyItems === 'space-evenly') {
      let objWidth = 0;
      this.objects.forEach((obj) => {
        objWidth += obj.width;
      });
      const remainingSpace = this.width - objWidth;
      const gaps = remainingSpace / (this.objects.size - 1);
      this.objects.values().forEach((obj, index) => {
        obj.position = new Vector2(this.x + (index * (obj.width + gaps)), this.y);
      })
    }
  }

  setToWindowSize = () => {
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
  }

  buildShape(): Shape[] {
    const {x, y, width, height} = this;

    const points = [
      new Vector2(x, y),
      new Vector2(x + width, y),
      new Vector2(x + width, y + height),
      new Vector2(x, y + height),
    ]
    const path = pointsToPath2D(points);
    return [{
      path,
      points: points
    }]
  }
  

  onChangeShape() {
    this.objects.forEach((object) => {
      if ('onParentShapeChanged' in object && typeof object.onParentShapeChanged === 'function') {
        object.onParentShapeChanged();
      }
    });
    this.shapes = this.buildShape();
  }

  unmount() {
    if (this._matchWindowSize) {
      window.removeEventListener('resize', this.setToWindowSize);
    }
  }

  get matchWindowSize() {
    return this._matchWindowSize;
  }

  get anchor(): Anchors | undefined {
    return this._anchor;
  }

  set anchor(value: Anchors | undefined) {
    this._anchor = value;
    this.handleAnchor();
  }

  get justifyItems(): Justify | undefined {
    return this._justifyItems;
  }

  set justifyItems(val: Justify | undefined) {
    this._justifyItems = val;
    this.handleJustify();
  }

  get anchorTo(): GameObject | undefined {
    return this._anchorTo;
  }

  set anchorTo(value: GameObject | undefined) {
    this._anchorTo = value;
    this.handleAnchor();
  }

  set matchWindowSize(value: boolean) {
    if (!value) {
      window.removeEventListener('resize', this.setToWindowSize);
    } else {
      this.setToWindowSize();
      window.addEventListener('resize', this.setToWindowSize);
    }
    this._matchWindowSize = value;
  }

  get shapes(): Shape[] | undefined {
    return this._shapes;
  }

  set shapes(shapes: Shape[] | undefined) {
    this._shapes = shapes;
  }
}

type Anchors = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'bottom' | 'top' | 'left' | 'right';

type Justify = 'space-evenly';