import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaylistStore {
  private readonly selectedIdSubject = new BehaviorSubject<number | null>(null);
  readonly selectedPlaylist$ = this.selectedIdSubject.asObservable();

  setSelected(id: number): void {
    this.selectedIdSubject.next(id);
  }

  clear(): void {
    this.selectedIdSubject.next(null);
  }
}
