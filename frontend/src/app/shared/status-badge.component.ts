import { Component, Input } from '@angular/core';
import { StatusLivro } from '../core/models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class.badge-green]="status === 'DISPONIVEL'" [class.badge-red]="status === 'EMPRESTADO'">
      {{ status === 'DISPONIVEL' ? 'Disponível' : 'Emprestado' }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: StatusLivro;
}
