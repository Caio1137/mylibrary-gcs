package br.senai.mylibrary.service;

import br.senai.mylibrary.dto.EmprestimoRequest;
import br.senai.mylibrary.dto.EmprestimoResponse;
import br.senai.mylibrary.exception.BusinessException;
import br.senai.mylibrary.exception.NotFoundException;
import br.senai.mylibrary.model.Emprestimo;
import br.senai.mylibrary.model.Livro;
import br.senai.mylibrary.model.StatusLivro;
import br.senai.mylibrary.repository.EmprestimoRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroService livroService;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroService livroService) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroService = livroService;
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponse> listar(Long livroId) {
        List<Emprestimo> emprestimos = livroId == null
                ? emprestimoRepository.findAllByOrderByDataEmprestimoDescIdDesc()
                : emprestimoRepository.findByLivroIdOrderByDataEmprestimoDescIdDesc(livroId);

        return emprestimos.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponse> listarAtivos() {
        return emprestimoRepository.findByDataDevolucaoEfetivaIsNullOrderByDataDevolucaoPrevistaAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponse> listarAtrasados() {
        return emprestimoRepository.listarAtrasados(LocalDate.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponse> listarUltimosCinco() {
        return emprestimoRepository.findTop5ByOrderByDataEmprestimoDescIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EmprestimoResponse emprestar(EmprestimoRequest request) {
        Livro livro = livroService.buscarEntidade(request.livroId());
        if (livro.getStatus() != StatusLivro.DISPONIVEL) {
            throw new BusinessException("Livro ja esta emprestado");
        }

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setLivro(livro);
        emprestimo.setNomePessoa(request.nomePessoa().trim());
        emprestimo.setTelefone(limparTextoOpcional(request.telefone()));
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataDevolucaoPrevista(request.dataDevolucaoPrevista());

        livro.setStatus(StatusLivro.EMPRESTADO);
        livroService.salvar(livro);

        return toResponse(emprestimoRepository.save(emprestimo));
    }

    @Transactional
    public EmprestimoResponse devolver(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Emprestimo nao encontrado"));

        if (emprestimo.getDataDevolucaoEfetiva() != null) {
            throw new BusinessException("Este emprestimo ja foi devolvido");
        }

        Livro livro = emprestimo.getLivro();
        if (livro.getStatus() != StatusLivro.EMPRESTADO) {
            throw new BusinessException("Nao e possivel devolver livro disponivel");
        }

        emprestimo.setDataDevolucaoEfetiva(LocalDate.now());
        livro.setStatus(StatusLivro.DISPONIVEL);
        livroService.salvar(livro);

        return toResponse(emprestimoRepository.save(emprestimo));
    }

    public long contarAtivos() {
        return emprestimoRepository.countByDataDevolucaoEfetivaIsNull();
    }

    EmprestimoResponse toResponse(Emprestimo emprestimo) {
        LocalDate hoje = LocalDate.now();
        boolean atrasado = emprestimo.getDataDevolucaoEfetiva() == null
                && emprestimo.getDataDevolucaoPrevista().isBefore(hoje);
        long diasAtraso = atrasado
                ? ChronoUnit.DAYS.between(emprestimo.getDataDevolucaoPrevista(), hoje)
                : 0;

        return new EmprestimoResponse(
                emprestimo.getId(),
                livroService.toResponse(emprestimo.getLivro()),
                emprestimo.getNomePessoa(),
                emprestimo.getTelefone(),
                emprestimo.getDataEmprestimo(),
                emprestimo.getDataDevolucaoPrevista(),
                emprestimo.getDataDevolucaoEfetiva(),
                atrasado,
                diasAtraso
        );
    }

    private String limparTextoOpcional(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return texto.trim();
    }
}
