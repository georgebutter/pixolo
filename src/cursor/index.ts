import { Game } from "../game";

export class CursorManager {
  private _cursor: CursorKeys = 'default';
  private _game: Game;  
  private _cursorConfig: CursorConfig;
  constructor(game: Game, config: CursorConfig) {
    this._game = game;
    this._cursorConfig = config;
    this.cursor = 'default';
  }

  set cursor(cursor: CursorKeys) {
    if (this._cursorConfig[cursor] === undefined) {
      throw new Error(`Cursor ${cursor} does not exist`);
    };
    this._cursor = cursor;
    const c = this._cursorConfig[cursor];
    const canvas = this._game.canvas.canvas;
    canvas.style.cursor = `url(${c}.png), auto`;

  }
}

export type CursorConfig = {
  default?: string;
  pointer?: string;
}

export type CursorKeys = keyof CursorConfig;