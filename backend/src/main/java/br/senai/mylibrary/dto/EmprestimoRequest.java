package br.senai.mylibrary.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EmprestimoRequest(
        @NotNull(message = "Livro e obrigatorio")
        Long livroId,

        @NotBlank(message = "Nome da pessoa e obrigatorio")
        @Size(max = 120, message = "Nome da pessoa deve ter ate 120 caracteres")
        String nomePessoa,

        @Size(max = 30, message = "Telefone deve ter ate 30 caracteres")
        String telefone,

        @NotNull(message = "Data de devolucao prevista e obrigatoria")
        @FutureOrPresent(message = "Data prevista deve ser hoje ou uma data futura")
        LocalDate dataDevolucaoPrevista
) {
}
