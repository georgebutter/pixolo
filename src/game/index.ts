import { GameAudio } from "../audio/index.ts";
import { CacheManager } from "../cache/index.ts";
import { Camera } from "../camera/index.ts";
import { Canvas } from "../canvas/index.ts";
import type { CursorConfig, CursorKeys } from "../cursor/index.ts";
import { CursorManager } from "../cursor/index.ts";
import { EventManager } from "../events/index.ts";
import { Inputs } from "../inputs/index.ts";
import { Renderer } from "../renderer/index.ts";
import type { SceneClassAsParameter } from "../scene/index.ts";
import { SceneManager } from "../scene/SceneManager.ts";

export class Game {
  private _status: GameStatus;
  /** Used for keeping track of the current frame delta */
  private _startTime: number = 0;
  private _previousTime: number = 0;
  private _remainingTime: number = 0;
  private _physicsFrames: number = 16;

  private _canvas: Canvas;
  private _camera: Camera;
  private _inputs: Inputs;
  private _scenes: SceneManager;
  private _cache: CacheManager;
  private _cursor: CursorManager;
  private _renderer: Renderer;
  private _events: EventManager;
  private _audio: GameAudio = new GameAudio(this);

  constructor(_config: Config = {}) {
    const { width, height, scaleToWindow, scaleTo, ...config} = _config;
    this._status = "pending";
    this._canvas = new Canvas({id: config?.canvasId, width, height, scaleTo, scaleToWindow});
    this._inputs = new Inputs(this);
    this._scenes = new SceneManager({
      game: this,
      scenes: config.scenes || []
    });
    this._cache = new CacheManager(this);
    this._renderer = new Renderer(this);
    this._camera = new Camera(this);
    this._events = new EventManager(this);
    this._cursor = new CursorManager(this, config.cursor || {});
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.preload = this.preload.bind(this);
    this.preload();
  }

  public preload() {
    this.status = "loading";
    this._scenes.preloadCurrentScene();
  }

  public start() {
    this.status = "running";
    window.requestAnimationFrame(this.update);
  }

  private physicsUpdate() {
    this._scenes.physicsUpdate(this._physicsFrames / 1000);
  }

  private update(timestamp: number) {
    if (!this._startTime) {
      this._startTime = timestamp;
    }
    if (!this._startTime) {
      throw new Error("Start time is not set!")
    }


    const delta = timestamp - this._previousTime;
    const steps = Math.min(Math.max(Math.floor((delta + this._remainingTime) / this._physicsFrames), 1), 5);
    this._remainingTime = delta - steps * this._physicsFrames;
    this._previousTime = timestamp;
    this._renderer.render(delta);
    this._scenes.update(delta);

    /**
     * Fixed timestep game loop for the physics.
     * Fixed time steps for physics simulations are important for several reasons:
     * 
     * -  Consistency: Physics simulations often rely on numerical integration methods to calculate the movement and interactions of objects. These methods can be sensitive to the size of the time step. Using fixed steps ensures that the simulation behaves consistently regardless of the frame rate or processing speed of the device running the game.
     * -  Determinism: With fixed time steps, the same initial conditions will always produce the same results. This is crucial for multiplayer games or replays, where different machines need to produce identical results.
     * -  Stability: Many physics algorithms become unstable with large or varying time steps. Fixed, small time steps help maintain the stability of the simulation, preventing objects from moving through each other or exhibiting other unrealistic behaviors.
     * -  Accuracy: Smaller, consistent time steps generally lead to more accurate simulations. Large or varying time steps can cause significant errors to accumulate over time.
     * -  Frame rate independence: Using fixed time steps decouples the physics simulation from the rendering frame rate. This allows the game to run smoothly on a wide range of hardware, from low-end devices to high-performance systems.
     * -  Easier debugging: When physics behave consistently, it's easier to reproduce and fix issues that arise during development.
     * -  Simplifies game logic: With fixed time steps, game logic that depends on time (like cooldowns or timed events) becomes easier to implement and more reliable.
     */
    for (let i = 0; i < steps; i++) {
      this.physicsUpdate();
    }

    if (this.status === "running") {
      window.requestAnimationFrame(this.update);
    }
  }

  public destroy() {
    this._inputs.destroy();
    this._audio.destroy();
    this._cache.clear();
  }

  set status(status: GameStatus) {
    this._status = status;
    this._scenes.bootCurrentScene();
  }

  get status() {
    return this._status;
  }

  get activeScene() {
    return this._scenes.currentScene;
  }

  get canvas() {
    return this._canvas;
  }

  set cursor(key: CursorKeys) {
    this._cursor.cursor = key;
  }

  get camera() {
    return this._camera;
  }

  get inputs() {
    return this._inputs;
  }

  get events() {
    return this._events;
  }

  get renderer() {
    return this._renderer;
  }

  get scenes() {
    return this._scenes
  }

  get cache() {
    return this._cache;
  }

  get audio() {
    return this._audio;
  }


  public canvasCenter() {
    return this.canvas.center();
  }

  public loadImage(...args: Parameters<CacheManager["loadImage"]>) {
    return this._cache.loadImage(...args);
  }

  public loadSpritesheet(...args: Parameters<CacheManager["loadSpritesheet"]>) {
    return this._cache.loadSpritesheet(...args);
  }

  public loadAudio(...args: Parameters<CacheManager["loadAudio"]>) {
    return this._cache.loadAudio(...args);
  }
}


type Config = {
  canvasId?: string
  width?: number
  height?: number
  scenes?: Array<SceneClassAsParameter>
  cursor?: CursorConfig;
  scaleTo?: HTMLElement;
  scaleToWindow?: boolean;
}

type GameStatus = "pending" | "loading" | "running" | "paused" | "stopped"
