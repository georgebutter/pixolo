import { Scene, SceneClassAsParameter } from ".";
import { Game } from "../game";

export class SceneManager {
  private _game: Game;
  private _scenes: Scene[] = [];
  private _currentScene: Scene | null = null;
  private _sceneKeys: string[] = [];
  private _sceneKey: string | null = null;

  constructor({game, scenes}: Config) {
    this._game = game;
    if (!scenes.length) {
      throw new Error('No scenes provided!');
    }
    const scenesMap = scenes.map((Scene_) => {
      const scene = new Scene_(game);
      return scene;
    });
    this._scenes = scenesMap;
    const firstScene = scenesMap[0]
    this._currentScene = firstScene;
    const names = scenes.map((s) => s.name);
    this._sceneKeys = names;
    this._sceneKey = firstScene.name;
  }

  public preloadCurrentScene() {
    if (!this._currentScene) {
      throw new Error('No current scene to preload!');
    }

    this._currentScene.status = 'loading';
  }

  public bootCurrentScene() {
    if (!this._currentScene) {
      throw new Error('No current scene to boot!');
    }
    this._currentScene.status = 'running';
  }

  public boot(sceneName: string) {
    const index = this._sceneKeys.indexOf(sceneName);
    if (index === -1) {
      throw new Error(`Scene with name ${sceneName} not found!`);
    }
    this.currentScene = this._scenes[index];
  }

  public update(delta: number) {
    if (!this._currentScene) {
      console.warn('No current scene to update!');
      return;
    }
    this._currentScene._update(delta);
  }

  public physicsUpdate(delta: number) {
    if (!this._currentScene) {
      console.warn('No current scene to physics update!');
      return;
    }
    this._currentScene._physicsUpdate(delta);
  }

  get currentScene() {
    if (!this._currentScene) {
      throw new Error('No current scene!');
    }
    return this._currentScene;
  }

  set currentScene(scene: Scene) {
    if(this._currentScene) {
      this._currentScene.status = 'ready';
    }
    this._currentScene = scene;
    this._game.cursor = 'default';
    this.preloadCurrentScene();
  }
}

type Config = {
  game: Game;
  scenes: Array<SceneClassAsParameter>;
};