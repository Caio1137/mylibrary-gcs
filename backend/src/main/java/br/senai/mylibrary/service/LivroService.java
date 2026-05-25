package br.senai.mylibrary.service;

import br.senai.mylibrary.dto.LivroRequest;
import br.senai.mylibrary.dto.LivroResponse;
import br.senai.mylibrary.exception.BusinessException;
import br.senai.mylibrary.exception.NotFoundException;
import br.senai.mylibrary.model.Categoria;
import br.senai.mylibrary.model.Livro;
import br.senai.mylibrary.model.StatusLivro;
import br.senai.mylibrary.repository.LivroRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final CategoriaService categoriaService;

    public LivroService(LivroRepository livroRepository, CategoriaService categoriaService) {
        this.livroRepository = livroRepository;
        this.categoriaService = categoriaService;
    }

    @Transactional(readOnly = true)
    public List<LivroResponse> listar(Long categoriaId, StatusLivro status, String termo) {
        String termoNormalizado = termo == null || termo.isBlank() ? null : termo.trim();
        return livroRepository.filtrar(categoriaId, status, termoNormalizado)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LivroResponse buscar(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Livro buscarEntidade(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Livro nao encontrado"));
    }

    @Transactional
    public LivroResponse criar(LivroRequest request) {
        Categoria categoria = categoriaService.buscarEntidade(request.categoriaId());

        Livro livro = new Livro();
        livro.setTitulo(request.titulo().trim());
        livro.setAutor(request.autor().trim());
        livro.setIsbn(limparTextoOpcional(request.isbn()));
        livro.setAno(request.ano());
        livro.setCategoria(categoria);
        livro.setStatus(StatusLivro.DISPONIVEL);

        return toResponse(livroRepository.save(livro));
    }

    @Transactional
    public void excluir(Long id) {
        Livro livro = buscarEntidade(id);
        if (livro.getStatus() != StatusLivro.DISPONIVEL) {
            throw new BusinessException("Nao e possivel excluir livro emprestado");
        }

        livroRepository.delete(livro);
    }

    @Transactional
    public Livro salvar(Livro livro) {
        return livroRepository.save(livro);
    }

    LivroResponse toResponse(Livro livro) {
        return new LivroResponse(
                livro.getId(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getIsbn(),
                livro.getAno(),
                livro.getStatus(),
                categoriaService.toResponse(livro.getCategoria())
        );
    }

    private String limparTextoOpcional(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return texto.trim();
    }
}
