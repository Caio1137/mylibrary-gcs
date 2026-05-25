package br.senai.mylibrary.service;

import br.senai.mylibrary.dto.DashboardResponse;
import br.senai.mylibrary.model.StatusLivro;
import br.senai.mylibrary.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final LivroRepository livroRepository;
    private final EmprestimoService emprestimoService;

    public DashboardService(LivroRepository livroRepository, EmprestimoService emprestimoService) {
        this.livroRepository = livroRepository;
        this.emprestimoService = emprestimoService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse obterResumo() {
        return new DashboardResponse(
                livroRepository.count(),
                livroRepository.countByStatus(StatusLivro.DISPONIVEL),
                livroRepository.countByStatus(StatusLivro.EMPRESTADO),
                emprestimoService.contarAtivos(),
                emprestimoService.listarUltimosCinco()
        );
    }
}
