import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchStore } from '../../services/search-store';

@Component({
  selector: 'app-header',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  search = new FormControl('');

  constructor(private searchStore: SearchStore) {
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.searchStore.setQuery(value));
  }
}
