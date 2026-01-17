import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Album} from '../interfaces/interface.album';
import {Playlist} from '../interfaces/interface.playlist';
import {Artist} from '../interfaces/interface.artist';
import {Track} from '../interfaces/interface.track';

@Injectable({
  providedIn: 'root',
})
export class Datasource {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAlbums() {
    return this.http.get<Album[]>(`${this.baseUrl}/albums`);
  }
  getPlaylists(){
    return this.http.get<Playlist[]>(`${this.baseUrl}/playlists`);
  }
  getArtists(){
    return this.http.get<Artist[]>(`${this.baseUrl}/artists`);
  }

  getTracks() {
    return this.http.get<Track[]>(`${this.baseUrl}/tracks`);
  }
}
