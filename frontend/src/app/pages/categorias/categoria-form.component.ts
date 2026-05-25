import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError } from '../../core/models';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="panel form-grid" [formGroup]="form" (ngSubmit)="salvar()">
      <h2>Nova categoria</h2>

      <label>
        Nome
        <input type="text" formControlName="nome" maxlength="80">
      </label>

      <label>
        Descrição
        <input type="text" formControlName="descricao" maxlength="255">
      </label>

      <button class="primary" type="submit" [disabled]="form.invalid || salvando">
        {{ salvando ? 'Salvando...' : 'Salvar' }}
      </button>

      <p class="error" *ngIf="erro">{{ erro }}</p>
    </form>
  `
})
export class CategoriaFormComponent {
  @Output() saved = new EventEmitter<void>();

  salvando = false;
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(80)]],
    descricao: ['', [Validators.maxLength(255)]]
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

    this.salvando = true;
    this.erro = '';
    this.api.criarCategoria(this.form.getRawValue())
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.saved.emit();
        },
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.errors?.[0] ?? error?.message ?? 'Não foi possível salvar a categoria.';
  }
}
