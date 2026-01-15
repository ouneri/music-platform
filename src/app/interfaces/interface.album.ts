import {Artist} from './interface.artist';


export interface Album {
  id: number;
  name: string;
  cover: string;
  artist: Artist[];
  trackIds: number[];
  durationSec: number;


}
