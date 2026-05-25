import { Routes } from '@angular/router';
import { CategoriaListComponent } from './pages/categorias/categoria-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmprestimoListComponent } from './pages/emprestimos/emprestimo-list.component';
import { LivroListComponent } from './pages/livros/livro-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'livros', component: LivroListComponent },
  { path: 'emprestimos', component: EmprestimoListComponent },
  { path: '**', redirectTo: 'dashboard' }
];
