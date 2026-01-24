import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchStore {
  private readonly querySubject = new BehaviorSubject<string>('');
  readonly query$ = this.querySubject.asObservable();

  setQuery(value: string | null | undefined): void {
    this.querySubject.next((value ?? '').toString().toLowerCase().trim());
  }
}
