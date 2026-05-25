import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/dashboard">MyLibrary</a>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/categorias" routerLinkActive="active">Categorias</a>
        <a routerLink="/livros" routerLinkActive="active">Livros</a>
        <a routerLink="/emprestimos" routerLinkActive="active">Empréstimos</a>
      </nav>
    </header>

    <main class="shell">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
