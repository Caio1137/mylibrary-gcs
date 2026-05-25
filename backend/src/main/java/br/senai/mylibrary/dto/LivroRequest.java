package br.senai.mylibrary.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LivroRequest(
        @NotBlank(message = "Titulo e obrigatorio")
        @Size(max = 140, message = "Titulo deve ter ate 140 caracteres")
        String titulo,

        @NotBlank(message = "Autor e obrigatorio")
        @Size(max = 120, message = "Autor deve ter ate 120 caracteres")
        String autor,

        @Size(max = 30, message = "ISBN deve ter ate 30 caracteres")
        String isbn,

        @Min(value = 1, message = "Ano deve ser positivo")
        Integer ano,

        @NotNull(message = "Categoria e obrigatoria")
        Long categoriaId
) {
}
