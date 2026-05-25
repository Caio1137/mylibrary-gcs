# MyLibrary

Sistema fullstack de biblioteca pessoal desenvolvido para a atividade integrada de Construção de Software e GCS.

## Tecnologias

- Backend: Spring Boot 3, Java 17, Spring Data JPA, H2
- Frontend: Angular 17, Reactive Forms
- GCS: Git, branches, tags, CHANGELOG e GitHub Actions

## Como executar

### Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

A API fica disponível em `http://localhost:8080/api`.

### Frontend

```bash
cd frontend
npm.cmd install
npm.cmd start
```

O Angular fica disponível em `http://localhost:4200`.

## Funcionalidades

- RF01: CRUD de categorias com contagem de livros e bloqueio de exclusão quando houver livros vinculados.
- RF02: Cadastro, listagem, busca, filtros e exclusão controlada de livros.
- RF03: Empréstimo e devolução com atualização automática do status do livro.
- RF04: Filtros por categoria, status e texto livre.
- RF05: Dashboard com estatísticas e últimos empréstimos.
- RF06: Relatório de empréstimos atrasados.

## Endpoints principais

- `GET /api/categorias`
- `POST /api/categorias`
- `DELETE /api/categorias/{id}`
- `GET /api/livros`
- `GET /api/livros/{id}`
- `POST /api/livros`
- `DELETE /api/livros/{id}`
- `GET /api/emprestimos`
- `GET /api/emprestimos/ativos`
- `GET /api/emprestimos/atrasados`
- `POST /api/emprestimos/emprestar`
- `POST /api/emprestimos/{id}/devolver`
- `GET /api/dashboard`

## Entrega GCS

O repositório deve ser publicado como `mylibrary-gcs` no GitHub. Depois de enviar o código, configure no GitHub:

- Issues #1, #2, #3 e #4 conforme o enunciado.
- Pull Requests das branches `feature/crud-categorias`, `feature/crud-livros` e `feature/emprestimos` para `develop`.
- Branch protection no `main` exigindo Pull Request e status checks.
- GitHub Release `v1.0.0`.

As tags locais `v0.1.0`, `v1.0.0` e `v1.0.1` já representam o fluxo solicitado.
