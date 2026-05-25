import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError, Categoria } from '../../core/models';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="panel form-grid" [formGroup]="form" (ngSubmit)="salvar()">
      <h2>Novo livro</h2>

      <label>
        Título
        <input type="text" formControlName="titulo" maxlength="140">
      </label>

      <label>
        Autor
        <input type="text" formControlName="autor" maxlength="120">
      </label>

      <label>
        ISBN
        <input type="text" formControlName="isbn" maxlength="30">
      </label>

      <label>
        Ano
        <input type="number" formControlName="ano" min="1">
      </label>

      <label>
        Categoria
        <select formControlName="categoriaId">
          <option [ngValue]="null">Selecione</option>
          <option *ngFor="let categoria of categorias" [ngValue]="categoria.id">{{ categoria.nome }}</option>
        </select>
      </label>

      <button class="primary" type="submit" [disabled]="form.invalid || salvando">
        {{ salvando ? 'Salvando...' : 'Salvar' }}
      </button>

      <p class="error" *ngIf="erro">{{ erro }}</p>
    </form>
  `
})
export class LivroFormComponent {
  @Input() categorias: Categoria[] = [];
  @Output() saved = new EventEmitter<void>();

  salvando = false;
  erro = '';

  form = this.fb.group({
    titulo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(140)]),
    autor: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    isbn: this.fb.nonNullable.control('', [Validators.maxLength(30)]),
    ano: this.fb.control<number | null>(null, [Validators.min(1)]),
    categoriaId: this.fb.control<number | null>(null, [Validators.required])
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService
  ) {}

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    this.salvando = true;
    this.erro = '';
    this.api.criarLivro({
      titulo: valor.titulo,
      autor: valor.autor,
      isbn: valor.isbn || null,
      ano: valor.ano,
      categoriaId: valor.categoriaId as number
    }).pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.saved.emit();
        },
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.errors?.[0] ?? error?.message ?? 'Não foi possível salvar o livro.';
  }
}
