import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { Datasource } from '../../services/datasource';
import {DurationPipe} from '../../pipes/pipes.duration';
import { SearchStore } from '../../services/search-store';
import {PlayerStoreService} from '../../services/player-store-service';
import {Track} from '../../interfaces/interface.track';




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
  filteredAlbums$;
  filteredTracks$;


  constructor(private dataSource: Datasource, private searchStore: SearchStore, private player: PlayerStoreService) {
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

    this.filteredTracks$ = combineLatest([
      this.tracksWithArtists$,
      this.searchStore.query$
    ]).pipe(
      map(([tracks, term]) => {
        const query = (term ?? '').toString();
        if (!query) {
          return tracks;
        }
        return tracks.filter((t) =>
          t.name.toLowerCase().includes(query) ||
          t.artistNames.toLowerCase().includes(query)
        );
      })
    );

    this.filteredAlbums$ = combineLatest([
      this.albumsWithArtists$,
      this.searchStore.query$
    ]).pipe(
      map(([albums, term]) => {
        const query = (term ?? '').toString();
        if (!query) {
          return albums;
        }
        return albums.filter((a) =>
          a.name.toLowerCase().includes(query) ||
          a.artistNames.toLowerCase().includes(query)
        );
      })
    );
  }
  onSelectTrack(track: Track) {
    this.player.setTrack(track);
    this.player.play();
  }

}

