import { Game } from "../game";

export class EventManager {
  private _events: Map<EventKey, EventFn<any>[]>;
  private _game: Game;
  constructor(game: Game) {
    this._events = new Map();
    this._game = game;
  }

  public on<T>(event: EventKey, callback: EventFn<T>) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event)?.push(callback);
  }

  public off<T>(event: EventKey, fn: EventFn<T>) {
    const handlers = this._events.get(event);
    if (!handlers) return;
    // Filter out the specific function
    const newHandlers = handlers.filter(handler => handler !== fn);
    
    if (newHandlers.length === 0) {
      // If no handlers left, remove the key entirely
      this._events.delete(event);
    } else {
      // Update with remaining handlers
      this._events.set(event, newHandlers);
    }
  }

  public emit<T extends {}>(event: EventKey, data: T) {
    if (!this._events.has(event)) {
      return;
    }
    this._events.get(event)?.forEach((callback) => {
      callback(data);
    });
    if (event === 'progress' && 'progress' in data && typeof data.progress === 'number') {
      this._game.renderer.render(data.progress);
    }
  }
}

export type EventKey = string;
export type EventFn<T> = (event: T) => void;
export type EventData = { progress: number };