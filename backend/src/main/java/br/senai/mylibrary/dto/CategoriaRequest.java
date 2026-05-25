package br.senai.mylibrary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "Nome da categoria e obrigatorio")
        @Size(max = 80, message = "Nome deve ter ate 80 caracteres")
        String nome,

        @Size(max = 255, message = "Descricao deve ter ate 255 caracteres")
        String descricao
) {
}
