import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { combineLatest, map, take } from 'rxjs';
import { Datasource } from '../../services/datasource';
import { PlayerStoreService } from '../../services/player-store-service';
import { DurationPipe } from '../../pipes/pipes.duration';

@Component({
  selector: 'app-player',
  imports: [AsyncPipe, NgIf, DurationPipe],
  templateUrl: './player.html',
  styleUrl: './player.scss',
  standalone: true,
})
export class Player {
  currentTrack$;
  currentTime$;
  duration$;
  isPlaying$;
  volume$;
  currentTrackWithArtists$;

  constructor(private player: PlayerStoreService, private dataSource: Datasource) {
    this.currentTrack$ = this.player.currentTrack$;
    this.currentTime$ = this.player.currentTime$;
    this.duration$ = this.player.duration$;
    this.isPlaying$ = this.player.isPlaying$;
    this.volume$ = this.player.volume$;
    this.currentTrackWithArtists$ = combineLatest([
      this.player.currentTrack$,
      this.dataSource.getArtists()
    ]).pipe(
      map(([track, artists]) => {
        if (!track) {
          return null;
        }
        const artistNames = track.artistIds
          .map((id) => artists.find((a) => a.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        return { ...track, artistNames };
      })
    );

    combineLatest([this.dataSource.getTracks()]).pipe(take(1)).subscribe(([tracks]) => {
      this.player.setQueue(tracks);
      if (tracks.length && !this.player.currentTrack$.value) {
        this.player.setTrack(tracks[0]);
      }
    });
  }

  togglePlay(): void {
    this.player.toggle();
  }

  seek(value: string): void {
    const time = Number(value);
    if (!Number.isNaN(time)) {
      this.player.seek(time);
    }
  }

  setVolume(value: string): void {
    const volume = Number(value);
    if (!Number.isNaN(volume)) {
      this.player.setVolume(volume);
    }
  }

  prevTrack() {

    this.player.prev()
  }

  openInfo(){
    this.player.openInfo();
  }

  nextTrack() {

    this.player.next()
  }

  toggleShuffle() {
    this.player.toggleShuffle()
  }

  toggleRepeatMode() {
    this.player.toggleRepeatMode()
  }

  isShuffleActive(): boolean {
    return this.player.isShuffleEnabled();
  }

  isRepeatActive(): boolean {
    return this.player.getRepeatMode() !== 'off';
  }
}
