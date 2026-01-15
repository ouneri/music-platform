import {Artist} from './interface.artist';

export interface Track {
  id: number;
  name: string;
  artist: Artist[];
  img: string;
}
