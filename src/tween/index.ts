import { GameObject } from "../gameObject";
import { Vector2 } from "../scalars/vector2";

export class Tween {
  private _target: GameObject;
  private _tweens: TweenConfig[] = [];  
  private _currentTween?: TweenConfig = undefined;
  private _currentTweenIndex: number = 0;
  private _lastTimestamp: number = 0;
  private _counter: number = 0;
  private _startPosition?: Vector2;

  constructor({target, tweens}: Config) {
    this._target = target;
    this._tweens = tweens;
    this._currentTween = this._tweens[this._currentTweenIndex];

    this.updateTween = this.updateTween.bind(this);
  }

  public play() {
    requestAnimationFrame(this.updateTween);
  }

  private updateTween(timestamp: number) {
    if (!this._currentTween) {
      return;
    }
    if (!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
    }
    if (!this._startPosition) {
      this._startPosition = new Vector2(this._target.position.x, this._target.position.y);
    }
    const delta = timestamp - this._lastTimestamp;
    const { x, y, duration, ease = 'linear' } = this._currentTween;
    this._counter += delta;

    // Calculate progress (0 to 1)
    const progress = Math.min(this._counter / duration, 1);
    
    // Apply easing function
    const easedProgress = this.getEasingFunction(ease)(progress);

    // Calculate new position
    const newX = x * easedProgress;
    const newY = y * easedProgress;
    
    this._target.position = new Vector2(
      this._target.position.x + (newX - (this._target.position.x - this._startPosition.x)),
      this._target.position.y + (newY - (this._target.position.y - this._startPosition.y))
    );
    

    if (this._counter >= duration) {
      this._currentTweenIndex++;
      this._currentTween = this._tweens[this._currentTweenIndex];
      if (this._currentTween) {
        this._currentTween.startX = this._target.position.x;
        this._currentTween.startY = this._target.position.y;
      }
      this._lastTimestamp = 0;
      this._counter = 0;
      this._startPosition = undefined;
    }
    requestAnimationFrame(this.updateTween);
  }

  private getEasingFunction(ease = 'linear'): (t: number) => number {
    // Add more easing functions as needed
    const easingFunctions: { [key: string]: (t: number) => number } = {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    };
    return easingFunctions[ease] || easingFunctions.linear;
  }
}

type Config = {
  target: GameObject;
  tweens: TweenConfig[];
};

type Ease = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad';

type TweenConfig = {
  x: number;
  y: number;
  duration: number;
  ease?: Ease;
  startX?: number;
  startY?: number;
}