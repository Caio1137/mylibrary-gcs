# Changelog

## [1.0.1] - 2026-05-25

### Fixed

- RF02: validação de exclusão impede remover livro com status `EMPRESTADO` (#4).

## [1.0.0] - 2026-05-25

### Added

- RF01: CRUD Categorias com validação de exclusão (#1).
- RF02: CRUD Livros com filtros e status (#2).
- RF03: Sistema de empréstimos com emprestar/devolver (#3).
- RF04: Busca por título/autor e filtros simultâneos.
- RF05: Dashboard com estatísticas e últimos empréstimos.
- RF06: Relatório de empréstimos atrasados.
- Pipeline CI com build backend Maven e frontend Angular.
- Status automático `DISPONIVEL` e `EMPRESTADO`.

### Technical

- 3 entidades: Categoria, Livro e Emprestimo.
- Service Layer com regras de negócio para empréstimos e exclusões.
- Estrutura de branches, commits e tags para rastreabilidade GCS.

## [0.1.0] - 2026-05-25

### Added

- Configuração inicial do repositório.
