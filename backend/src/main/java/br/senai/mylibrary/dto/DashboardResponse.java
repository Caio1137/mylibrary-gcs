package br.senai.mylibrary.dto;

import java.util.List;

public record DashboardResponse(
        long totalLivros,
        long totalDisponiveis,
        long totalEmprestados,
        long totalEmprestimosAtivos,
        List<EmprestimoResponse> ultimosEmprestimos
) {
}
