import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, Dashboard, Emprestimo, Livro, StatusLivro } from './models';

interface CategoriaPayload {
  nome: string;
  descricao?: string | null;
}

interface LivroPayload {
  titulo: string;
  autor: string;
  isbn?: string | null;
  ano?: number | null;
  categoriaId: number;
}

interface EmprestimoPayload {
  livroId: number;
  nomePessoa: string;
  telefone?: string | null;
  dataDevolucaoPrevista: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  criarCategoria(payload: CategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/categorias`, payload);
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categorias/${id}`);
  }

  listarLivros(filtros: { categoriaId?: number | null; status?: StatusLivro | null; q?: string | null } = {}): Observable<Livro[]> {
    let params = new HttpParams();

    if (filtros.categoriaId) {
      params = params.set('categoriaId', filtros.categoriaId);
    }
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }
    if (filtros.q?.trim()) {
      params = params.set('q', filtros.q.trim());
    }

    return this.http.get<Livro[]>(`${this.baseUrl}/livros`, { params });
  }

  criarLivro(payload: LivroPayload): Observable<Livro> {
    return this.http.post<Livro>(`${this.baseUrl}/livros`, payload);
  }

  excluirLivro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/livros/${id}`);
  }

  historicoLivro(id: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.baseUrl}/livros/${id}/emprestimos`);
  }

  listarEmprestimos(livroId?: number): Observable<Emprestimo[]> {
    const params = livroId ? new HttpParams().set('livroId', livroId) : undefined;
    return this.http.get<Emprestimo[]>(`${this.baseUrl}/emprestimos`, { params });
  }

  listarAtivos(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.baseUrl}/emprestimos/ativos`);
  }

  listarAtrasados(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.baseUrl}/emprestimos/atrasados`);
  }

  emprestar(payload: EmprestimoPayload): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(`${this.baseUrl}/emprestimos/emprestar`, payload);
  }

  devolver(id: number): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(`${this.baseUrl}/emprestimos/${id}/devolver`, {});
  }

  dashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboard`);
  }
}
