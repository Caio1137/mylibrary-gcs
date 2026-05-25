package br.senai.mylibrary.dto;

import br.senai.mylibrary.model.StatusLivro;

public record LivroResponse(
        Long id,
        String titulo,
        String autor,
        String isbn,
        Integer ano,
        StatusLivro status,
        CategoriaResponse categoria
) {
}
