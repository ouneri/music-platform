import { Component } from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import { Datasource } from '../../services/datasource';
import {DurationPipe} from '../../pipes/pipes.duration';
import { SearchStore } from '../../services/search-store';
import {PlayerStoreService} from '../../services/player-store-service';
import { PlaylistStore } from '../../services/playlist-store';
import {Track} from '../../interfaces/interface.track';




@Component({
  selector: 'app-mainbar',
  imports: [NgFor, AsyncPipe, DurationPipe, NgIf],
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
  currentTrack$;
  currentTrackWithArtists$;
  selectedPlaylistId$;
  selectedPlaylist$;
  selectedPlaylistTracks$;
  selectedAlbumId$ = new BehaviorSubject<number | null>(null);
  selectedAlbumTracks$;
  selectedAlbum$;
  openInfo$


  constructor(
    private dataSource: Datasource,
    private searchStore: SearchStore,
    private player: PlayerStoreService,
    private playlistStore: PlaylistStore
  ) {
    this.playlists$ = this.dataSource.getPlaylists();
    this.albums$ = this.dataSource.getAlbums();
    this.artists$ = this.dataSource.getArtists();
    this.tracks$ = this.dataSource.getTracks();
    this.currentTrack$ = this.player.currentTrack$;
    this.openInfo$ = this.player.openInfo$;




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

    this.currentTrackWithArtists$ = combineLatest([
      this.currentTrack$,
      this.artists$
    ]).pipe(
      map(([track, artists]) => {
        if (!track) return null;
        const artistNames = track.artistIds
          .map(id => artists.find(a => Number(a.id) === Number(id))?.name)
          .filter(Boolean)
          .join(', ');
        return { ...track, artistNames };
      })
    );

    this.selectedPlaylistId$ = this.playlistStore.selectedPlaylist$;
    this.selectedPlaylistId$.subscribe((id) => {
      if (id) {
        this.selectedAlbumId$.next(null);
      }
    });
    this.selectedPlaylist$ = combineLatest([
      this.playlists$,
      this.selectedPlaylistId$
    ]).pipe(
      map(([playlists, selectedId]) => {
        if (!selectedId) return null;
        return playlists.find(p => Number(p.id) === Number(selectedId)) ?? null;
      })
    );

    this.selectedAlbumTracks$ = combineLatest([
      this.albums$,
      this.tracksWithArtists$,
      this.selectedAlbumId$
    ]).pipe(
      map(([albums, tracks, selectedId]) =>{
        if (!selectedId) return [];
        const albumId = Number(selectedId);
        const album = albums.find(a => a.id === albumId);
        if (!album) return tracks;
        if (!album.trackIds || !album.trackIds.length) {
          return tracks;
        }
        return tracks.filter(t => album.trackIds.includes(Number(t.id)));
      })
    )
    this.selectedAlbum$ = combineLatest([
      this.albums$,
      this.selectedAlbumId$
    ]).pipe(
      map(([albums, selectedId]) => {
        if (!selectedId) return null;
        return albums.find(a => Number(a.id) === Number(selectedId)) ?? null;
      })
    );

    this.selectedPlaylistTracks$ = combineLatest([
      this.playlists$,
      this.tracksWithArtists$,
      this.selectedPlaylistId$
    ]).pipe(
      map(([playlists, tracks, selectedId]) => {
        if (!selectedId) return [];
        const playlistId = Number(selectedId);
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return tracks;
        if (!playlist.trackIds || !playlist.trackIds.length) {
          return tracks.slice(0, playlist.trackCount ?? 0);
        }
        return tracks.filter(t => playlist.trackIds.includes(Number(t.id)));
      })
    )

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

  selectPlaylistId(id: number) {
    this.playlistStore.setSelected(id);
  }

  clearPlaylist(): void {
    this.playlistStore.clear();
  }

  selectAlbumId(id: number) {
    this.playlistStore.clear();
    this.selectedAlbumId$.next(id);
  }

  closeInfo(){
    this.player.closeInfo();
  }
}

