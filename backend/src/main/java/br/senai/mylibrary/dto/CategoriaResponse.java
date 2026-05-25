package br.senai.mylibrary.dto;

public record CategoriaResponse(
        Long id,
        String nome,
        String descricao,
        long totalLivros
) {
}
