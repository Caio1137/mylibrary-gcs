import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError, Categoria, Emprestimo, Livro } from '../../core/models';
import { StatusBadgeComponent } from '../../shared/status-badge.component';
import { LivroFormComponent } from './livro-form.component';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LivroFormComponent, StatusBadgeComponent],
  template: `
    <section class="page-head">
      <h1>Livros</h1>
      <span>{{ livros.length }} no resultado</span>
    </section>

    <app-livro-form [categorias]="categorias" (saved)="carregarTudo()"></app-livro-form>

    <form class="filters" [formGroup]="filtros" (ngSubmit)="carregarLivros()">
      <input type="search" placeholder="Título ou autor" formControlName="q">

      <select formControlName="categoriaId">
        <option [ngValue]="null">Todas as categorias</option>
        <option *ngFor="let categoria of categorias" [ngValue]="categoria.id">{{ categoria.nome }}</option>
      </select>

      <select formControlName="status">
        <option [ngValue]="null">Todos os status</option>
        <option value="DISPONIVEL">Disponível</option>
        <option value="EMPRESTADO">Emprestado</option>
      </select>

      <button class="primary" type="submit">Filtrar</button>
      <button class="ghost" type="button" (click)="limparFiltros()">Limpar</button>
    </form>

    <section class="table-panel">
      <div class="table-row table-header books-grid">
        <span>Livro</span>
        <span>Categoria</span>
        <span>Status</span>
        <span></span>
      </div>

      <div class="table-row books-grid" *ngFor="let livro of livros">
        <div>
          <strong>{{ livro.titulo }}</strong>
          <small>{{ livro.autor }} · {{ livro.ano || 's/ ano' }} · {{ livro.isbn || 's/ ISBN' }}</small>
        </div>
        <span>{{ livro.categoria.nome }}</span>
        <app-status-badge [status]="livro.status"></app-status-badge>
        <div class="actions">
          <button class="ghost" type="button" (click)="abrirHistorico(livro)">Histórico</button>
          <button class="danger ghost" type="button" (click)="excluir(livro)" [disabled]="livro.status !== 'DISPONIVEL' || excluindoId === livro.id">
            Excluir
          </button>
        </div>
      </div>

      <p class="empty" *ngIf="!carregando && livros.length === 0">Nenhum livro encontrado.</p>
      <p class="muted" *ngIf="carregando">Carregando...</p>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>

    <section class="panel" *ngIf="livroHistorico">
      <div class="section-title">
        <h2>Histórico</h2>
        <span>{{ livroHistorico.titulo }}</span>
      </div>

      <div class="history-item" *ngFor="let emprestimo of historico">
        <strong>{{ emprestimo.nomePessoa }}</strong>
        <span>{{ emprestimo.dataEmprestimo }} até {{ emprestimo.dataDevolucaoPrevista }}</span>
        <span>{{ emprestimo.dataDevolucaoEfetiva ? 'Devolvido em ' + emprestimo.dataDevolucaoEfetiva : 'Em aberto' }}</span>
      </div>

      <p class="empty" *ngIf="historico.length === 0">Sem empréstimos registrados para este livro.</p>
    </section>
  `
})
export class LivroListComponent implements OnInit {
  categorias: Categoria[] = [];
  livros: Livro[] = [];
  historico: Emprestimo[] = [];
  livroHistorico: Livro | null = null;
  carregando = false;
  excluindoId: number | null = null;
  erro = '';

  filtros = this.fb.group({
    q: this.fb.nonNullable.control(''),
    categoriaId: this.fb.control<number | null>(null),
    status: this.fb.control<'DISPONIVEL' | 'EMPRESTADO' | null>(null)
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {}

  ngOnInit(): void {
    this.carregarTudo();
  }

  carregarTudo(): void {
    this.api.listarCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: () => this.erro = 'Não foi possível carregar as categorias.'
    });
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.carregando = true;
    this.erro = '';
    this.api.listarLivros(this.filtros.getRawValue())
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (livros) => this.livros = livros,
        error: () => this.erro = 'Não foi possível carregar os livros.'
      });
  }

  limparFiltros(): void {
    this.filtros.reset({ q: '', categoriaId: null, status: null });
    this.carregarLivros();
  }

  excluir(livro: Livro): void {
    this.excluindoId = livro.id;
    this.erro = '';
    this.api.excluirLivro(livro.id)
      .pipe(finalize(() => this.excluindoId = null))
      .subscribe({
        next: () => this.carregarTudo(),
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  abrirHistorico(livro: Livro): void {
    this.livroHistorico = livro;
    this.historico = [];
    this.api.historicoLivro(livro.id).subscribe({
      next: (historico) => this.historico = historico,
      error: () => this.erro = 'Não foi possível carregar o histórico.'
    });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.message ?? 'Não foi possível excluir o livro.';
  }
}
