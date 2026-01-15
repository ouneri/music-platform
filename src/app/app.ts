import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { Mainbar } from './components/mainbar/mainbar';
import { Player } from './components/player/player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Mainbar, Player],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('clone');
}
