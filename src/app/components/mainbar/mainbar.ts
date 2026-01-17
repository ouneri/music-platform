import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import {combineLatest, filter, map} from 'rxjs';
import { Datasource } from '../../services/datasource';
import {DurationPipe} from '../../pipes/pipes.duration';



@Component({
  selector: 'app-mainbar',
  imports: [NgFor, AsyncPipe, DurationPipe],
  templateUrl: './mainbar.html',
  styleUrl: './mainbar.scss',
  standalone: true,
})
export class Mainbar {
  playlists$;
  albums$;
  artists$;
  albumsWithArtists$;
  tracks$;
  tracksWithArtists$;


  constructor(private dataSource: Datasource) {
    this.playlists$ = this.dataSource.getPlaylists();
    this.albums$ = this.dataSource.getAlbums();
    this.artists$ = this.dataSource.getArtists();
    this.tracks$ = this.dataSource.getTracks();

    // преобразование массива артистов в строку
    this.albumsWithArtists$ = combineLatest([this.albums$, this.artists$]).pipe(
      map(([albums, artists]) =>
        albums.map((a) => ({
          ...a,
          artistNames: a.artistIds
            .map((id) => artists.find((x) => x.id === id)?.name)
            .filter(Boolean)
            .join(', ')
        }))
      )
    );
    //  тоже самое для артистов -- треков

    this.tracksWithArtists$ = combineLatest([this.tracks$, this.artists$]).pipe(
      map(([tracks, artists]) =>
        tracks.map(t => ({
          ...t,
          artistNames: t.artistIds
            .map(id => artists.find(a => a.id === id)?.name)
            .filter(Boolean)
            .join(', ')
        }))
      )
    );
  }


}

