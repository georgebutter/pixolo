
import { CacheManager } from "../cache/index.ts";
import type { EventFn, EventKey } from "../events/index.ts";
import { Game } from "../game/index.ts";
import { GameObject } from "../gameObject/index.ts";
import { intersects } from "../math/intersects.ts";
import { Vector2 } from "../scalars/vector2.ts";
import { SceneManager } from "./SceneManager.ts";

export interface Scene {
  update?(delta: number): void;
  physicsUpdate?(delta: number): void;
  start?(): void;
  preload?(): void;
  unmount?(): void;
}

export abstract class Scene {
  _status: string = 'ready';
  _game: Game;
  public collisionObjects = new Map<number, Map<string, GameObject>>();
  abstract name: string;
  private _objects: Map<string, GameObject> = new Map();

  constructor(game: Game) {
    this._game = game;
  }

  set status(status: SceneStatus) {
    this._status = status;
    if (status === 'loading') {
      this._preload();
      return;
    }
    if (status === 'running') {
      this._start();
    }
    if (status === 'ready') {
      this.unmount?.();
    }
  }

  private _preload(): void {
    if (this.preload) {
      this.preload?.();
      return;
    }
    this._game.start();
    this.status = 'running';
  }

  /**
   * Start all game objects in the scene
   */
  private _start(): void {
    this.start?.();
  }

  public _physicsUpdate(delta: number): void {
    this.physicsUpdateGameObjects(this.objects, delta);
  }
  /**
   * Update all game objects in the scene by running the current drawcall
   */
  public _update(delta: number): void {
    this.updateGameObjects(this._objects, delta);
    /**
     * TODO: this has performance issues when there are lots of objects
     */
    // if (this.collisionObjects.size) {
    //   this.checkCollisions();
    // }
    this.update?.(delta);
  }

  private updateGameObjects(objects: Map<string, GameObject>, delta: number) {
    objects.forEach((object) => {
      object._update?.(delta);
      const childObjects = object.objects;
      this.updateGameObjects(childObjects, delta);
    });
  }

  private physicsUpdateGameObjects(objects: Map<string, GameObject>, delta: number) {
    objects.forEach((object) => {
      object._physicsUpdate?.(delta);
      const childObjects = object.objects;
      this.updateGameObjects(childObjects, delta);
    });
  }

  public addGameObject(object: GameObject) {
    this._objects.set(object.name, object);
    if (object.collisionLayer) {
      this.addCollisionObject(object);
    }
    if (['loading', 'running'].includes(this.game.status)) {
      object._start();
    }
  }

  public destroyObject(name: string) {
    if (!this._objects.has(name)) {
      return;
      throw new Error(`Object with name ${name} not found`);
    }
    this._objects.delete(name);
  }

  public getObjectByName(name: string) {
    return this._objects.get(name);
  }

  public getObjectsWithinCollisionArea(collisionLayer: number, pos: Vector2, width: number, height: number): Map<string, GameObject> {
    const objects = this.collisionObjects.get(collisionLayer);
    if (!objects) return new Map();
    
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

  public addCollisionObject(object: GameObject) {
    const layer = this.collisionObjects.get(object.collisionLayer) ?? new Map<string, GameObject>();
    layer.set(object.name, object);
    this.collisionObjects.set(object.collisionLayer, layer);
  }

  public removeCollisionObject(object: GameObject, layer: number) {
    const objects = this.collisionObjects.get(layer) ?? new Map<string, GameObject>();
    objects.delete(object.name);
    this.collisionObjects.set(layer, objects);
  }

  get objects() {
    return this._objects;
  }

  get game(): Game {
    return this._game;
  }

  get scenes(): SceneManager | undefined {
    return this.game.scenes;
  }

  public loadImage(...args: Parameters<CacheManager["loadImage"]>) {
    return this.game.loadImage(...args);
  }

  public loadSpritesheet(...args: Parameters<CacheManager["loadSpritesheet"]>) {
    return this.game.loadSpritesheet(...args);
  }

  public loadAudio(...args: Parameters<CacheManager["loadAudio"]>) {
    return this.game.loadAudio(...args);
  }

  public on(key: EventKey, callback: EventFn<any>) {
    this.game.events.on(key, callback);
  }

  public off(key: EventKey, callback: EventFn<any>) {
    this.game.events.off(key, callback);
  }

  get audio () {
    return this.game.audio;
  }
}

type SceneStatus = "loading" | "ready" | "running" | "paused" | "stopped"
export type SceneClassAsParameter =
(new (...args: ConstructorParameters<typeof Scene>) => 
Scene);
