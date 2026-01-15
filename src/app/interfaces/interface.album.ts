import {Artist} from './interface.artist';


export interface Album {
  id: number;
  name: string;
  cover: string;
  artistIds: number[];
  trackIds: number[];
  durationSec?: number;


}
