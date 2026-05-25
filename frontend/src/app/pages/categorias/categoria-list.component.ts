import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError, Categoria } from '../../core/models';
import { CategoriaFormComponent } from './categoria-form.component';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, CategoriaFormComponent],
  template: `
    <section class="page-head">
      <h1>Categorias</h1>
      <span>{{ categorias.length }} cadastradas</span>
    </section>

    <app-categoria-form (saved)="carregar()"></app-categoria-form>

    <section class="table-panel">
      <div class="table-row table-header">
        <span>Nome</span>
        <span>Descrição</span>
        <span>Livros</span>
        <span></span>
      </div>

      <div class="table-row" *ngFor="let categoria of categorias">
        <strong>{{ categoria.nome }}</strong>
        <span>{{ categoria.descricao || '-' }}</span>
        <span>{{ categoria.totalLivros }}</span>
        <button class="danger ghost" type="button" (click)="excluir(categoria)" [disabled]="excluindoId === categoria.id">
          Excluir
        </button>
      </div>

      <p class="empty" *ngIf="!carregando && categorias.length === 0">Nenhuma categoria cadastrada.</p>
      <p class="muted" *ngIf="carregando">Carregando...</p>
      <p class="error" *ngIf="erro">{{ erro }}</p>
    </section>
  `
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  carregando = false;
  excluindoId: number | null = null;
  erro = '';

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.api.listarCategorias()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (categorias) => this.categorias = categorias,
        error: () => this.erro = 'Não foi possível carregar as categorias.'
      });
  }

  excluir(categoria: Categoria): void {
    this.excluindoId = categoria.id;
    this.erro = '';
    this.api.excluirCategoria(categoria.id)
      .pipe(finalize(() => this.excluindoId = null))
      .subscribe({
        next: () => this.carregar(),
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.message ?? 'Não foi possível excluir a categoria.';
  }
}
