import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { ApiError, Livro } from '../../core/models';

@Component({
  selector: 'app-emprestimo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="panel form-grid" [formGroup]="form" (ngSubmit)="salvar()">
      <h2>Novo empréstimo</h2>

      <label>
        Livro
        <select formControlName="livroId">
          <option [ngValue]="null">Selecione</option>
          <option *ngFor="let livro of livrosDisponiveis" [ngValue]="livro.id">{{ livro.titulo }} · {{ livro.autor }}</option>
        </select>
      </label>

      <label>
        Pessoa
        <input type="text" formControlName="nomePessoa" maxlength="120">
      </label>

      <label>
        Telefone
        <input type="text" formControlName="telefone" maxlength="30">
      </label>

      <label>
        Previsão
        <input type="date" formControlName="dataDevolucaoPrevista" [min]="hoje">
      </label>

      <button class="primary" type="submit" [disabled]="form.invalid || salvando">
        {{ salvando ? 'Salvando...' : 'Emprestar' }}
      </button>

      <p class="error" *ngIf="erro">{{ erro }}</p>
    </form>
  `
})
export class EmprestimoFormComponent {
  @Input() livrosDisponiveis: Livro[] = [];
  @Output() saved = new EventEmitter<void>();

  hoje = new Date().toISOString().slice(0, 10);
  salvando = false;
  erro = '';

  form = this.fb.group({
    livroId: this.fb.control<number | null>(null, [Validators.required]),
    nomePessoa: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    telefone: this.fb.nonNullable.control('', [Validators.maxLength(30)]),
    dataDevolucaoPrevista: this.fb.nonNullable.control(this.hoje, [Validators.required])
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
    this.api.emprestar({
      livroId: valor.livroId as number,
      nomePessoa: valor.nomePessoa,
      telefone: valor.telefone || null,
      dataDevolucaoPrevista: valor.dataDevolucaoPrevista
    }).pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.form.reset({ livroId: null, nomePessoa: '', telefone: '', dataDevolucaoPrevista: this.hoje });
          this.saved.emit();
        },
        error: (error) => this.erro = this.mensagemErro(error.error)
      });
  }

  private mensagemErro(error?: ApiError): string {
    return error?.errors?.[0] ?? error?.message ?? 'Não foi possível registrar o empréstimo.';
  }
}
