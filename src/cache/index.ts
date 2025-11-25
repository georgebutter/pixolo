import { Game } from "../game";

export class CacheManager {
  private _cache: Cache;
  private _spritesheets: Map<string, Spritesheet> = new Map();
  private _spritesheetConfig: Map<string, SpritesheetConfig> = new Map();
  private _game: Game;
  private _queue: CacheQueue = [];
  private _totalToLoad: number = 0;
  private _totalLoaded: number = 0;
  private _totalFailed: number = 0;
  private _progress: number = 0;
  private _status: "loading" | "ready" = "ready";
  constructor(game: Game) {
    this._game = game;
    this._cache = new Map();
    this._process = this._process.bind(this);
  }

  public loadImage(...args: CacheParam) {
    this.add('image', ...args);
  }

  public loadSpritesheet(sheet: SpritesheetConfig) {
    const { key, url } = sheet;
    this._spritesheetConfig.set(key, sheet);
    this.add('spritesheet', key, url);
  }

  public loadAudio(key: string, url: string) {
    this.add('audio', key, url);
  }

  public clear() {
    this._cache.clear();
  }

  private add(type: CacheTypes, ...args: CacheParam) {
    this._queue.push([type, ...args]);
    this._totalToLoad++;
    this._process();
  }

  public get<T>(key: string): T {
    const item = this._cache.get(key) as T
    if (!item) {
      throw new Error(`Asset ${key} not found in cache`);
    }
    return item;
  }

  private _process() {
    if (this._status === "loading") {
      return;
    }
    const [type, key, src] = this._queue.shift() || [];
    if (!type || !key || !src) {
      return;
    }
    this._status = "loading";
    switch (type) {
      case "audio": {
        const audio = new Audio(src);
        audio.onloadstart = () => {
          this._cache.set(key, audio);
          this._status = "ready";
          this.totalLoaded += 1;
          this._process();
        }
        audio.onerror = (e) => {
          console.warn(`Failed to load audio asset: key='${key}', url='${src}'`, e);
          this._totalFailed += 1;
          this._status = "ready";
          this._process();
        }
        break;
      }
      default: {
        const asset = new Image();
        asset.src = src;
        asset.onload = () => {
          this._cache.set(key, asset);
          if (this._spritesheetConfig.has(key)) {
            this.createSpritesheet(this._spritesheetConfig.get(key)!);
          }
          this._status = "ready";
          this.totalLoaded += 1;
          this._process();
        };
        asset.onerror = (e) => {
          console.warn(`Failed to load image asset: key='${key}', url='${src}'`, e);
          this._totalFailed += 1;
          this._status = "ready";
          this._process();
        };
        break;
      }
    }
  }

  private createSpritesheet(sheet: SpritesheetConfig) {
    if (this._spritesheets.has(sheet.key)) {
      return this._spritesheets.get(sheet.key);
    }
    const spritesheet = {
      ...sheet,
      image: this._cache.get(sheet.key) as HTMLImageElement,
    }
    if (sheet.frames.keys) {
      this.createSpritesFromSheet(spritesheet);
    }
    this._spritesheets.set(sheet.key, spritesheet);
    return spritesheet;
  }


  private async createSpritesFromSheet(sheet: Spritesheet) {
    const keys = sheet.frames.keys!;
    const sheetWidth = sheet.image.naturalWidth;
    const { width, height } = sheet.frames;
    this._totalToLoad += Object.keys(keys).length;
    for (const key in keys) {
      const pos = this.getSpritePosition(sheetWidth, width, height, keys[key]);
      const asset = await createImageBitmap(sheet.image, pos.x, pos.y, width, height);
      this._cache.set(`${sheet.key}-${key}`, asset);
      this.totalLoaded++;
    }

  }

  private getSpritePosition(sourceW: number, frameW: number, frameH: number, frame: number) {
    const columns = sourceW / frameW;
    const x = (frame % columns) * frameW;
    const y = Math.floor(frame / columns) * frameH;
    return { x, y };
  }

  set totalLoaded(loaded: number) {
    this._totalLoaded = loaded;
    this._progress = (loaded / this._totalToLoad) * 100;
    this._game.events.emit("progress", { progress: this._progress });
    if (this._progress === 100) {
      this._game.events.emit("complete", { progress: this._progress });
      this._game.start();
    }
  }

  get totalLoaded() {
    return this._totalLoaded;
  }
  
}

type Asset = ImageBitmap | HTMLImageElement | HTMLAudioElement | HTMLVideoElement;
type Cache = Map<string, Asset>;
type CacheParam = [key: string, src: string];
type CacheQueue = Array<[CacheTypes, key: string, src: string]>
type CacheTypes = "image" | "audio" | "spritesheet";

export type SpritesheetConfig = {
  key: string;
  url: string;
  frames: {
    width: number;
    height: number;
    keys?: Record<string, number>;
  }
}
export type Spritesheet = SpritesheetConfig & {
  image: HTMLImageElement;
}

export type Sprite = {
  sheet: Spritesheet,
  frame: number;
}

type SpriteSrc = {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}