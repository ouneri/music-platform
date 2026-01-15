import {Artist} from './interface.artist';

export interface Track {
  id: number;
  name: string;
  artistIds: number[];
  img: string;
  durationSec: number;
}
