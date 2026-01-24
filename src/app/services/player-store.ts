import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../interfaces/interface.track';

@Injectable({
  providedIn: 'root'
})
export class PlayerStore {
  private readonly audio = new Audio();

  readonly currentTrack$ = new BehaviorSubject<Track | null>(null);
  readonly isPlaying$ = new BehaviorSubject<boolean>(false);
  readonly currentTime$ = new BehaviorSubject<number>(0);
  readonly duration$ = new BehaviorSubject<number>(0);
  readonly volume$ = new BehaviorSubject<number>(0.7);

  constructor() {
    this.audio.volume = this.volume$.value;
    this.bindAudioEvents();
  }

  setTrack(track: Track): void {
    this.currentTrack$.next(track);
    const audioUrl = track.audioUrl ?? '';
    if (audioUrl) {
      this.audio.src = audioUrl;
      this.audio.load();
    }
  }

  toggle(): void {
    if (this.isPlaying$.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    if (!this.audio.src) {
      return;
    }
    void this.audio.play();
    this.isPlaying$.next(true);
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  seek(timeSeconds: number): void {
    this.audio.currentTime = timeSeconds;
    this.currentTime$.next(timeSeconds);
  }

  setVolume(value: number): void {
    const volume = Math.max(0, Math.min(1, value));
    this.audio.volume = volume;
    this.volume$.next(volume);
  }

  private bindAudioEvents(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration$.next(this.audio.duration);
    });
    this.audio.addEventListener('ended', () => {
      this.isPlaying$.next(false);
    });
  }
}
