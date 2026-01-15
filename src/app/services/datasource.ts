import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Datasource {

  private artists = [{
    id: 1,
    name: 'elmora',
    listeners: 143.767,
    avatar: 'elmora-avatar.jpg'

  },
    {
      id: 2,
      name: 'ouneri',
      listeners: 10.235,
      avatar: 'ouner-avatar.jpg'

    }
  ];

  private playlists = [
    {
      id: 1,
      name: 'Mix day #1',
      cover: '1.jpg',
      description: 'Random tracks',
      trackCount: 12
    },
    {
      id: 2,
      name: 'Mix day #2',
      cover: '2.jpg',
      description: 'Random tracks',
      trackCount: 10
    }
  ];
  private albums = [{
    id: 1,
    name: 'elmorapoppintramadol',
    cover: '2.jpg',
    artistIds: [1],
    trackIds: [1, 2],

  }]

  private tracks = [{
      id: 1,
      name: 'Трамадольчик',
      artistIds: [1],
      img: '11.jpg',
      durationSec: 120,

    },
    {
      id: 2,
      name: 'u',
      artistIds: [1, 2],
      img: '22.jpg',
      durationSec: 120,
    }
  ]

  getAlbums() {
    return of ([...this.albums]);
  }
  getPlaylists(){
    return of ([this.playlists]);
  }
  getArtists(){
    return of ([...this.artists]);
  }

  getTracks() {
    return of ([...this.tracks]);
  }
}
