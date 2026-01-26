import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Track} from '../interfaces/interface.track';


@Injectable({
  providedIn: 'root',
})
export class PlayerStoreService {
  private audio = new Audio();
  private queue: Track[] = [];
  private currentIndex: number = -1;
  private rafId: number | null = null;
  private isShuffle: boolean = false;
  private repeatMode: 'off' | 'one' | 'all' = 'off';


  currentTrack$ = new BehaviorSubject<Track | null>(null);
  isPlaying$ = new BehaviorSubject<boolean>(false);
  currentTime$ = new BehaviorSubject<number>(0);
  duration$ = new BehaviorSubject<number>(0);
  volume$ = new BehaviorSubject<number>(0.7);
  openInfo$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('playerVolume');
    if (saved !== null) {
      const value = Math.max(0, Math.min(1, Number(saved)));
      this.audio.volume = value;
      this.volume$.next(value);
    }
    this.bindAudioEvents();

  }

  setQueue(tracks: Track[]) {
    this.queue = [...tracks];
    const current = this.currentTrack$.value;
    this.currentIndex = current
      ? this.queue.findIndex((t) => t.id === current.id)
      : -1;
  }

  openInfo(){
    this.openInfo$.next(true);
  }

  closeInfo(){
    this.openInfo$.next(false);
  }


  setTrack(track: Track) {
    this.currentTrack$.next(track);
    const audioUrl = track.audioUrl ?? '';
    this.currentIndex = this.queue.findIndex((t) => t.id === track.id);
    if (audioUrl) {
      this.audio.src = audioUrl;
      this.audio.load();
    }
  }

  toggleShuffle(){
    if(this.isShuffle === true){
      this.isShuffle = false;
    }else {
      this.isShuffle = true;
    }
  }

  toggleRepeatMode(){
    if(this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if(this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }


  }

  isShuffleEnabled(): boolean {
    return this.isShuffle;
  }

  getRepeatMode(): 'off' | 'one' | 'all' {
    return this.repeatMode;
  }

  startRaf(){
    if (this.rafId) return
     const tick = () => {
      this.currentTime$.next(this.audio.currentTime);
      this.rafId = requestAnimationFrame(tick)
    }
    tick()

  }


  stopRaf(){
    if(this.rafId){
      cancelAnimationFrame(this.rafId)
      this.rafId = null;
    }
  }

  next() {
    if (this.queue.length === 0) {
      return false;
    }

    if (this.repeatMode === 'one') {
      this.seek(0);
      this.play();
      return true;
    }

    if (this.isShuffle) {
      let randomIndex = Math.floor(Math.random() * this.queue.length);
      if (this.queue.length > 1) {
        while (randomIndex === this.currentIndex) {
          randomIndex = Math.floor(Math.random() * this.queue.length);
        }
      }
      const track = this.queue[randomIndex];
      this.currentIndex = randomIndex;
      this.setTrack(track);
      this.play();
      return true;
    }

    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.queue.length) {
      if (this.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return false;
      }
    }

    const track = this.queue[nextIndex];
    this.currentIndex = nextIndex;
    this.setTrack(track);
    this.play();
    return true;
  }

  prev() {
    if (this.queue.length === 0) {
      return false;
    }

    if (this.repeatMode === 'one') {
      this.seek(0);
      this.play();
      return true;
    }

    if (this.audio.currentTime > 3) {
      this.seek(0);
      return true;
    }

    if (this.isShuffle) {
      let randomIndex = Math.floor(Math.random() * this.queue.length);
      if (this.queue.length > 1) {
        while (randomIndex === this.currentIndex) {
          randomIndex = Math.floor(Math.random() * this.queue.length);
        }
      }
      const track = this.queue[randomIndex];
      this.currentIndex = randomIndex;
      this.setTrack(track);
      this.play();
      return true;
    }

    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      if (this.repeatMode === 'all') {
        prevIndex = this.queue.length - 1;
      } else {
        return false;
      }
    }

    const track = this.queue[prevIndex];
    this.currentIndex = prevIndex;
    this.setTrack(track);
    this.play();
    return true;
  }


  toggle() {
    if (this.isPlaying$.value) {
      this.pause();
    } else {
      this.play();
    }
  }



  play() {
    if (!this.audio.src) {
      return;
    }
    this.startRaf()
    void this.audio.play();
    this.isPlaying$.next(true);
  }

  pause(){
    this.stopRaf()
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  seek(time: number){
    this.audio.currentTime = time;
    this.currentTime$.next(time);
  }


  setVolume(volume: number ){
    const value = Math.max(0, Math.min(1, volume));
    this.audio.volume = value;
    localStorage.setItem("playerVolume", String(value))
    this.volume$.next(value);
  }

  private bindAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime);
    });
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration$.next(this.audio.duration);
    });
    this.audio.addEventListener('ended', () => {
      if(!this.next()){
        this.isPlaying$.next(false);
      }
    });
  }
}
