package br.senai.mylibrary.dto;

import java.time.LocalDate;

public record EmprestimoResponse(
        Long id,
        LivroResponse livro,
        String nomePessoa,
        String telefone,
        LocalDate dataEmprestimo,
        LocalDate dataDevolucaoPrevista,
        LocalDate dataDevolucaoEfetiva,
        boolean atrasado,
        long diasAtraso
) {
}
