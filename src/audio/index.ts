import { Game } from "../game/index.ts";

export class GameAudio {
  private _game: Game;
  private currentTrack: string | undefined = undefined;
  private isPlaying = false;
  private isPlayingSound = '';

  constructor(game: Config) {
    this._game = game;
  }

  public playMusic(name: string | undefined) {
    if (!name) return;
    if (this.isPlaying) return;
    this.isPlaying = true;
    const music = this._game.cache.get<HTMLAudioElement>(name);
    music.play();
    music.loop = true;
  }

  public playSound(name: string | undefined) {
    if (!name) return;
    const sound = this._game.cache.get<HTMLAudioElement>(name);
    sound.play();
  }

  public pause() {
    if (!this.isPlaying || !this.currentTrack) return;
    const music = this._game.cache.get<HTMLAudioElement>(this.currentTrack);
    music.pause();
    this.isPlaying = false;
    this.currentTrack = undefined;
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.playMusic(this.currentTrack);
    }
  }

  public destroy() {
    this.pause();
  }
}

type Config = Game
type BeatNote = {
  note: number;
  time: number;
}