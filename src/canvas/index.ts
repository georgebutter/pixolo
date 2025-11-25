import { Vector2 } from "../scalars/vector2";

export class Canvas {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _width: number;
  private _height: number;

  constructor({id = "canvas", width, height, scaleToWindow}: Config) {
    const canvasRef = document.getElementById(id) as HTMLCanvasElement;
    if (!canvasRef) {
      throw new Error(`Canvas not found! Have you provided the correct canvas ID? ${id}`)
      }
    this._canvas = canvasRef;
    const contextRef = canvasRef.getContext("2d");
    if (!contextRef) {
      throw new Error("Context not found!")
    }
    this._context = contextRef;
    this.width = this._width = width ?? 800;
    this.height = this._height = height ?? 600;

    if (scaleToWindow) {
      this.setCanvasToWindowSize();
      window.addEventListener("resize", () => {
        this.setCanvasToWindowSize();
      });
    }
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._context;
  }

  
  get x() {
    return 0;
  }
  
  get y() {
    return 0;
  }
  
  set width(width: number) {
    this._width = width;
    this._canvas.width = width;
  }
  
  get width() {
    return this._width;
  }
  
  set height(height: number) {
    this._height = height;
    this._canvas.height = height;
  }
  
  get height() {
    return this._height;
  }

  private setCanvasToWindowSize() {
    this.width = window.document.body.clientWidth;
    this.height = window.document.body.clientHeight;
  }

  public center() {
    return new Vector2(this.width / 2, this.height / 2);
  }
}

type Config = {
  id?: string;
  width?: number;
  height?: number;
  scaleToWindow?: boolean;
}