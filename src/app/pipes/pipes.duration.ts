import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'duration'})

export class DurationPipe implements PipeTransform {
  transform(totalSecond: number): string {
    if (!totalSecond && totalSecond !== 0) return '';
    const total = Math.floor(totalSecond);
    const minutes = Math.floor(total / 60);
    const seconds = Math.floor(total % 60);
    const padded = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes}:${padded}`;
  }
}
