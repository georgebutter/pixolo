
import { GameObject } from "../gameObject/index.ts";


export class AnimationManager {
  private animations: Map<string, Animation> = new Map();
  private currentAnimation: (Animation & AnimationPlayConfig) | undefined;
  public currentFrame: number = 0;
  private status: 'playing' | 'paused' = 'playing'
  private lastDraw: number = 0;
  private frameTimer: number = 0;
  private _gameObject: GameObject;
  constructor(gameObject: GameObject) {
    this._gameObject = gameObject;

    this.playAnimation = this.playAnimation.bind(this);
  }

  public add(animation: Animation) {
    this.animations.set(animation.name, animation);
  }

  public play(name: string, config: AnimationPlayConfig = {}) {
    if (name === this.currentAnimation?.name && !config.reset) return;
    const animation = this.animations.get(name);
    if (!animation) {
      throw new Error(`Animation ${name} not found`);
    }
    this.status = 'playing';
    this.currentAnimation = {
      ...animation,
      ...config,
    };
    this.currentFrame = config.startFrame ?? 0;
    requestAnimationFrame(this.playAnimation)
  }

  private playAnimation(timestamp: number) {
    if (this.status === 'paused') return;
    if (!this.currentAnimation) {
      return;
    };

    const frame = this.currentAnimation.frames[this.currentFrame];
    this._gameObject.image = this._gameObject.game.cache.get<ImageBitmap>(`${this.currentAnimation.sheet}-${frame}`);
    const delta = timestamp - this.lastDraw;
    this.lastDraw = timestamp;
    this.frameTimer += delta;
    if (this.frameTimer > (1000 / (this.currentAnimation.frameRate ?? 4))) {
      // Todo change this to start frame? Depends on if looping should start from start frame
      this.currentAnimation.onFrame?.[this.currentFrame]?.();
      const frame = this.currentAnimation.frames[this.currentFrame];
      this._gameObject.image = this._gameObject.game.cache.get<ImageBitmap>(`${this.currentAnimation.sheet}-${frame}`);
      this.frameTimer = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.currentAnimation!.frames.length) {
        this.currentFrame = 0;
        if (!this.currentAnimation.loop) {
          this.currentAnimation = undefined;
          return;
        }
      }
    }
    requestAnimationFrame(this.playAnimation);
  
  }
}

type Animation = {
  name: string;
  sheet: string;
  frames: Array<string>;
  /** Defaults to 4 */
  frameRate?: number;
}

type AnimationPlayConfig = {
  startFrame?: number;
  onFrame?: {
    [frame: number]: () => void;
  };
  loop?: boolean;
  reset?: boolean;  
}