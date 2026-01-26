import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { Datasource } from '../../services/datasource';
import { PlaylistStore } from '../../services/playlist-store';


@Component({
  selector: 'app-sidebar',
  imports: [
    NgFor,
    AsyncPipe
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
})
export class Sidebar {
  playlists$;

  constructor(private dataSource: Datasource, private playlistStore: PlaylistStore) {
    this.playlists$ = this.dataSource.getPlaylists();
  }

  selectPlaylist(id: number): void {
    this.playlistStore.setSelected(id);
  }
}
