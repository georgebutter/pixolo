import { AnimationManager } from "../animation/AnimationManager";
import { Game } from "../game";
import { intersects } from "../math/intersects";
import { Vector2 } from "../scalars/vector2";
import { Scene } from "../scene";
import { Shape } from "./Shape";

export interface GameObject {
  update?(delta: number): void;
  physicsUpdate?(delta: number): void;
  start?(): void;
  onClick?(event: MouseEvent): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  shapes?: Array<Shape> | undefined;
  hitbox?: HitboxPoints | undefined;
  rigidBody?: boolean | undefined;
  onChangeShape?(): void;
  onChildObjectsChanged?(): void;
  onCollision?(object: GameObject): void;
}

export abstract class GameObject {
  public name: string;
  private _text?: string | undefined;
  private _font?: string | undefined;
  private _textWidth?: number | undefined;
  private _textHeight?: number | undefined;
  private _strokeWidth?: number | undefined;
  private _mouseIsOver = false;
  public image?: HTMLImageElement | ImageBitmap | undefined;
  public imagePadding = 0;
  public renderLayer = 0;
  public detachFromCamera: boolean = false;
  public blendMode: CanvasRenderingContext2D['globalCompositeOperation'] = 'source-over';
  public ySortOffset = 0;
  private _objects: Map<string, GameObject> = new Map();
  private _position = new Vector2(0, 0);
  private _animation: AnimationManager;
  
  public hitBoxParams = (position: Vector2): HitboxConfig => {
    const { x, y } = position;
    return {
      x,
      y,
      width: this.width,
      height: this.height,
    }
  }

  public interactBoxParams = ({x, y}: Vector2) => {
    return {
      x,
      y,
      width: 0,
      height: 0,
    }
  }
  public scene: Scene;
  private _collisionLayer = 0;
  /**
   * In degrees because we work with path2D and SVG uses degrees
   */
  private _rotation = 0;
  /**
   * CSS string color either rgb() or #hex
   */
  private _fill: string | undefined = undefined;
  private _textFill: string | undefined = undefined;
  private _stroke: string | undefined = undefined;
  private _width: number = 0;
  private _height: number = 0;
  private _parent: Parent;
  private _game: Game;

  constructor({ game, parent, name, scene }: Config) {
    this.name = name;
    this._parent = parent;
    this._game = game;
    this.scene = scene;
    this._animation = new AnimationManager(this);
    this.detachFromCamera = 'detachFromCamera' in parent && typeof parent.detachFromCamera === 'boolean' ? parent.detachFromCamera : false;
  }

  moveBy(vec: Vector2) {
    this._position.x += vec.x;
    this._position.y += vec.y;
  }
  addGameObject(object: GameObject) {
    object.parent = this;
    object.game = this.game;
    if (object.collisionLayer) {
      this.scene.addCollisionObject(object)
    }
    this._objects.set(object.name, object);
    if (this?.onChildObjectsChanged && typeof this.onChildObjectsChanged === 'function') {
      this.onChildObjectsChanged();
    }
    if (this.game?.status === 'loading' || this.game?.status === 'running') {
      object._start();
    }
  }
  addGameObjects(objects: GameObject[]) {
    objects.forEach((object) => {
      this.addGameObject(object);
    });
  }
  getObjectByName(name: string) {
    return this._objects.get(name);
  }
  public getObjectsWithinCollisionArea(collisionLayer: number, pos: Vector2, width: number, height: number): Map<string, GameObject> {
    const objects = this.scene.collisionObjects.get(collisionLayer);
    if (!objects) return new Map<string, GameObject>();

    return new Map([...objects].filter(([name, object]) => {
      const hitbox = object.buildHitbox(object.position);
      if (!hitbox) return false;
      const checkArea = [
        new Vector2(pos.x, pos.y),
        new Vector2(pos.x + width, pos.y),
        new Vector2(pos.x + width, pos.y + height),
        new Vector2(pos.x, pos.y + height),
      ]
      return intersects(hitbox, checkArea);
    }));
  }

  public getObjectsWithinArea(collisionLayer: number, area: HitboxConfig): Map<string, GameObject> {
    const objects = this.scene.collisionObjects.get(collisionLayer);
    if (!objects) return new Map<string, GameObject>();

    return new Map([...objects].filter(([name, object]) => {
      const hitbox = object.buildHitbox(object.position);
      const checkArea = [
        new Vector2(area.x, area.y),
        new Vector2(area.x + area.width, area.y),
        new Vector2(area.x + area.width, area.y + area.height),
        new Vector2(area.x, area.y + area.height),
      ];
      return intersects(hitbox, checkArea);
    }));
  }

  public getObjectsWithinInteractArea(collisionLayer: number, pos: Vector2, width: number, height: number): Map<string, GameObject> {
    const objects = this.scene.collisionObjects.get(collisionLayer);
    if (!objects) return new Map<string, GameObject>();

    return new Map([...objects].filter(([name, object]) => {
      const hitbox = object.buildInteractbox(object.position);
      if (!hitbox) return false;
      const checkArea = [
        new Vector2(pos.x, pos.y),
        new Vector2(pos.x + width, pos.y),
        new Vector2(pos.x + width, pos.y + height),
        new Vector2(pos.x, pos.y + height),
      ]
      return intersects(hitbox, checkArea);
    }));
  }

  destroyObject(name: string) {
    const object = this.objects.get(name);
    if (!object) {
      throw new Error(`Object with name ${name} not found`);
    }
    if (object.collisionLayer) {
      this.scene.removeCollisionObject(object, object.collisionLayer);
    }
    this._objects.delete(name);
  }

  checkRigidBodies(position: Vector2): boolean {
    if (!this.rigidBody || !this.collisionLayer) return false;
    let preventMove = false;
    const objects = this.scene.collisionObjects.get(this.collisionLayer);
    if (!objects) return false;
    for (const [name, object] of objects) {
      if (object.name === this.name || !object.rigidBody) continue;
      const nextHitbox = this.buildHitbox(position);;
      const bHitbox = object.buildHitbox(object.position);
      if (!bHitbox) continue;
      const collision = intersects(nextHitbox, bHitbox);
      if (collision) {
        preventMove = true;
      }
    }

    return preventMove;
  }

  checkCollisions(object: GameObject) {
    if (!this.onCollision)
      return;
    const aHitbox = object.buildHitbox(object.position);
    if (!aHitbox) {
      throw Error(`${this.name} Object does not have hitbox to check collision with`)
    }
    const bHitbox = this.buildHitbox(this.position);
    const collision = intersects(aHitbox, bHitbox);
    if (collision) {
      this.onCollision(object);
    }
  }

  destroy() {
    if (!this._parent) {
      throw new Error(`Unable to destroy ${this.name}: Parent not found`);
    }
    this._parent.destroyObject(this.name);
  }

  _update(delta: number) {
    this.update?.(delta);
  }

  _physicsUpdate(delta: number) {
    this.physicsUpdate?.(delta);
  }

  _start() {
    this.start?.();
  }

  _onMouseEnter() {
    this.onMouseEnter?.();
  }

  _onMouseLeave() {
    this.onMouseLeave?.();
  }

  isOnScreen() {
    const { width, height } = this.game.canvas;
    const { x, y } = this.position;
    return x > 0 && x < width && y > 0 && y < height;
  }

  buildHitbox(position: Vector2): HitboxPoints {
    const {x, y, width, height} = this.hitBoxParams(position);
    const points: HitboxPoints = [
      new Vector2(x, y),
      new Vector2(x + width, y),
      new Vector2(x + width, y + height),
      new Vector2(x, y + height),
    ]
    return points
  }

  buildInteractbox(position: Vector2): HitboxPoints {
    const {x, y, width, height} = this.interactBoxParams(position);
    const points: HitboxPoints = [
      new Vector2(x, y),
      new Vector2(x + width, y),
      new Vector2(x + width, y + height),
      new Vector2(x, y + height),
    ]
    return points
  }

  positionOrSizeChanged() {
    this.onChangeShape?.();
  }

  center() {
    return new Vector2(this.width / 2, this.height / 2);
  }

  set mouseIsOver(value: boolean) {
    if (value === this.mouseIsOver) return;
    if (value) {
      this._onMouseEnter();
    } else {
      this._onMouseLeave();
    }
    this._mouseIsOver = value;
  }

  get mouseIsOver() {
    return this._mouseIsOver;
  }

  get objects() {
    return this._objects;
  }

  set parent(parent: Parent) {
    this._parent = parent;
  }

  get parent(): Parent {
    return this._parent!;
  }

  set game(game: Game) {
    this._game = game;
  }

  get game(): Game {
    if (!this._game) throw new Error('No game found');
    return this._game;
  }

  get animation() {
    return this._animation;
  }
  
  set fill(fill: string | undefined) {
    this._fill = fill;
  }
  get fill(): string | undefined {
    return this._fill;
  }

  set textFill(fill: string | undefined) {
    this._textFill = fill;
  }
  get textFill(): string | undefined {
    return this._textFill;
  }

  set stroke(stroke: string) {
    this._stroke = stroke;
  }
  get stroke(): string | undefined {
    return this._stroke;
  }

  set strokeWidth(width: number) {
    this._strokeWidth = width;
  }

  get strokeWidth(): number | undefined {
    return this._strokeWidth;
  }

  set position(position: Vector2) {
    if (this.rigidBody) {
      if (this.checkRigidBodies(position)) {
        return;
      }
    }
    this._position = position;
    if (this.rigidBody || this.onCollision) {
      this.hitbox = this.buildHitbox(position);
    }
    this.positionOrSizeChanged();
  }
  get position() {
    return this._position;
  }
  get x() {
    return this._position.x;
  }
  get y() {
    return this._position.y;
  }
  get rotation() {
    return this._rotation;
  }
  get width() {
    return this._width;
  }
  set width(width: number) {
    this._width = width;
    this.positionOrSizeChanged();
  }
  get height() {
    return this._height;
  }
  set height(height: number) {
    this._height = height;
    this.positionOrSizeChanged();
  }

  set text(t: string) {
    this.game.canvas.context.font = this._font ?? '12px sans-serif';
    const textMetrics = this.game.canvas.context.measureText(t);
    this._textWidth = textMetrics.width;
    this._textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

    if (this._textWidth > this.width) {
      this.width = this._textWidth;
    }
    if (this._textHeight > this.height) {
      this.height = this._textHeight;
    }
    this._text = t;
  }
  get text(): string | undefined {
    return this._text;
  }

  set font(f: string) {
    if (this._text !== undefined) {
      const textMetrics = this.game.canvas.context.measureText(this._text);
      this._textWidth = textMetrics.width;
      this._textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      if (this._textWidth > this.width) {
        this.width = this._textWidth;
      }
      if (this._textHeight > this.height) {
        this.height = this._textHeight;
      }
    }
    this._font = f;
  }
  get font(): string | undefined {
    return this._font;
  }

  get textWidth(): number {
    return this._textWidth ?? 0;
  }
  get textHeight(): number {
    return this._textHeight ?? 0;
  }

  get cache() {
    if (!this.game) {
      throw new Error('No game to retreive cache');
    }
    return this.game.cache;
  }

  set collisionLayer(layer: number) {
    if (!layer && this.collisionLayer) {
      this.scene.removeCollisionObject(this, this.collisionLayer);
    }
    this._collisionLayer = layer;
    this.scene.addCollisionObject(this);
  }

  get collisionLayer() {
    return this._collisionLayer;
  }
}


type Parent = {
  addGameObject: (object: GameObject) => void;
  getObjectByName: (name: string) => GameObject | undefined;
  getObjectsWithinCollisionArea: (collisionLayer: number, pos: Vector2, width: number, height: number) => Map<string, GameObject>;
  destroyObject: (name: string) => void;
  game: Game | undefined;
  name: string;
}

export type GameObjectConfig = {
  game: Game;
  parent: Parent;
  name?: string;
  scene: Scene;
}
export type WithGameObjectConfig<T> = T & GameObjectConfig;
type Config = {
  game: Game;
  parent: Parent;
  name: string;
  scene: Scene;
}

type HitboxConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
}

type HitboxPoints = [Vector2, Vector2, Vector2, Vector2]