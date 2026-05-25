export type StatusLivro = 'DISPONIVEL' | 'EMPRESTADO';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
  totalLivros: number;
}

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string | null;
  ano: number | null;
  status: StatusLivro;
  categoria: Categoria;
}

export interface Emprestimo {
  id: number;
  livro: Livro;
  nomePessoa: string;
  telefone: string | null;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoEfetiva: string | null;
  atrasado: boolean;
  diasAtraso: number;
}

export interface Dashboard {
  totalLivros: number;
  totalDisponiveis: number;
  totalEmprestados: number;
  totalEmprestimosAtivos: number;
  ultimosEmprestimos: Emprestimo[];
}

export interface ApiError {
  message: string;
  errors: string[];
}
