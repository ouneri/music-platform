import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { Datasource } from '../../services/datasource';


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


  constructor(private dataSource: Datasource) {
    this.playlists$ = this.dataSource.getPlaylists();
  }



}
