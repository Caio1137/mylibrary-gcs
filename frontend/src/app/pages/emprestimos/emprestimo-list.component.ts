import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError, Emprestimo, Livro } from '../../core/models';
import { EmprestimoFormComponent } from './emprestimo-form.component';

@Component({
  selector: 'app-emprestimo-list',
  standalone: true,
  imports: [CommonModule, EmprestimoFormComponent],
  template: `
    <section class="page-head">
      <h1>Empréstimos</h1>
      <span>{{ ativos.length }} ativos</span>
    </section>

    <app-emprestimo-form [livrosDisponiveis]="livrosDisponiveis" (saved)="carregarTudo()"></app-emprestimo-form>

    <section class="panel">
      <div class="section-title">
        <h2>Ativos</h2>
        <span>{{ ativos.length }}</span>
      </div>

      <div class="loan-item" *ngFor="let emprestimo of ativos">
        <div>
          <strong>{{ emprestimo.livro.titulo }}</strong>
          <small>{{ emprestimo.nomePessoa }} · previsto para {{ emprestimo.dataDevolucaoPrevista }}</small>
        </div>
        <button class="primary" type="button" (click)="devolver(emprestimo)" [disabled]="devolvendoId === emprestimo.id">
          Devolver
        </button>
      </div>

      <p class="empty" *ngIf="ativos.length === 0">Nenhum empréstimo ativo.</p>
    </section>

    <section class="panel">
      <div class="section-title">
        <h2>Atrasados</h2>
        <span>{{ atrasados.length }}</span>
      </div>

      <div class="loan-item overdue" *ngFor="let emprestimo of atrasados">
        <div>
          <strong>{{ emprestimo.livro.titulo }}</strong>
          <small>{{ emprestimo.nomePessoa }} · {{ emprestimo.diasAtraso }} dia(s) de atraso</small>
        </div>
        <span>{{ emprestimo.dataDevolucaoPrevista }}</span>
      </div>

      <p class="empty" *ngIf="atrasados.length === 0">Nenhum empréstimo atrasado.</p>
    </section>

    <section class="table-panel">
      <div class="table-row table-header loans-grid">
        <span>Livro</span>
        <span>Pessoa</span>
        <span>Período</span>
        <span>Status</span>
      </div>

      <div class="table-row loans-grid" *ngFor="let emprestimo of todos">
        <strong>{{ emprestimo.livro.titulo }}</strong>
        <span>{{ emprestimo.nomePessoa }}</span>
        <span>{{ emprestimo.dataEmprestimo }} até {{ emprestimo.dataDevolucaoPrevista }}</span>
        <span>{{ emprestimo.dataDevolucaoEfetiva ? 'Devolvido' : 'Aberto' }}</span>
      </div>

      <p class="empty" *ngIf="!carregando && todos.length === 0">Nenhum empréstimo registrado.</p>
      <p class="muted" *ngIf="carregando">Carregando...</p>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>
  `
})
export class EmprestimoListComponent implements OnInit {
  livrosDisponiveis: Livro[] = [];
  ativos: Emprestimo[] = [];
  atrasados: Emprestimo[] = [];
  todos: Emprestimo[] = [];
  carregando = false;
  devolvendoId: number | null = null;
  erro = '';

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.carregando = true;
    this.erro = '';

    this.api.listarLivros({ status: 'DISPONIVEL' }).subscribe({
      next: (livros) => this.livrosDisponiveis = livros,
      error: () => this.erro = 'Não foi possível carregar os livros disponíveis.'
    });
    this.api.listarAtivos().subscribe({
      next: (ativos) => this.ativos = ativos,
      error: () => this.erro = 'Não foi possível carregar os empréstimos ativos.'
    });
    this.api.listarAtrasados().subscribe({
      next: (atrasados) => this.atrasados = atrasados,
      error: () => this.erro = 'Não foi possível carregar os atrasados.'
    });
    this.api.listarEmprestimos()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (todos) => this.todos = todos,
        error: () => this.erro = 'Não foi possível carregar o histórico.'
      });
  }

  devolver(emprestimo: Emprestimo): void {
    this.devolvendoId = emprestimo.id;
    this.erro = '';
    this.api.devolver(emprestimo.id)
      .pipe(finalize(() => this.devolvendoId = null))
      .subscribe({
        next: () => this.carregarTudo(),
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.message ?? 'Não foi possível devolver o livro.';
  }
}
