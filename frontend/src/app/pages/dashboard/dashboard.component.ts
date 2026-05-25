import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Dashboard } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-head">
      <h1>Dashboard</h1>
      <span>Acervo pessoal</span>
    </section>

    <section class="stats" *ngIf="dashboard">
      <article>
        <span>Total</span>
        <strong>{{ dashboard.totalLivros }}</strong>
      </article>
      <article>
        <span>Disponíveis</span>
        <strong>{{ dashboard.totalDisponiveis }}</strong>
      </article>
      <article>
        <span>Emprestados</span>
        <strong>{{ dashboard.totalEmprestados }}</strong>
      </article>
      <article>
        <span>Ativos</span>
        <strong>{{ dashboard.totalEmprestimosAtivos }}</strong>
      </article>
    </section>

    <section class="panel">
      <div class="section-title">
        <h2>Últimos empréstimos</h2>
        <button class="ghost" type="button" (click)="carregar()">Atualizar</button>
      </div>

      <div class="loan-item" *ngFor="let emprestimo of dashboard?.ultimosEmprestimos">
        <div>
          <strong>{{ emprestimo.livro.titulo }}</strong>
          <small>{{ emprestimo.nomePessoa }} · {{ emprestimo.dataEmprestimo }}</small>
        </div>
        <span>{{ emprestimo.dataDevolucaoEfetiva ? 'Devolvido' : 'Aberto' }}</span>
      </div>

      <p class="empty" *ngIf="!carregando && dashboard?.ultimosEmprestimos?.length === 0">Sem empréstimos registrados.</p>
      <p class="muted" *ngIf="carregando">Carregando...</p>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null;
  carregando = false;
  erro = '';

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.api.dashboard()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dashboard) => this.dashboard = dashboard,
        error: () => this.erro = 'Não foi possível carregar o dashboard.'
      });
  }
}
