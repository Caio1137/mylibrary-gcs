package br.senai.mylibrary.service;

import br.senai.mylibrary.dto.CategoriaRequest;
import br.senai.mylibrary.dto.CategoriaResponse;
import br.senai.mylibrary.exception.BusinessException;
import br.senai.mylibrary.exception.NotFoundException;
import br.senai.mylibrary.model.Categoria;
import br.senai.mylibrary.repository.CategoriaRepository;
import br.senai.mylibrary.repository.LivroRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final LivroRepository livroRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, LivroRepository livroRepository) {
        this.categoriaRepository = categoriaRepository;
        this.livroRepository = livroRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Categoria buscarEntidade(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoria nao encontrada"));
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        String nome = request.nome().trim();
        if (categoriaRepository.existsByNomeIgnoreCase(nome)) {
            throw new BusinessException("Ja existe categoria com este nome");
        }

        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        categoria.setDescricao(limparTextoOpcional(request.descricao()));

        return toResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public void excluir(Long id) {
        Categoria categoria = buscarEntidade(id);
        long totalLivros = livroRepository.countByCategoriaId(id);
        if (totalLivros > 0) {
            throw new BusinessException("Nao e possivel excluir categoria com livros vinculados");
        }

        categoriaRepository.delete(categoria);
    }

    CategoriaResponse toResponse(Categoria categoria) {
        long totalLivros = categoria.getId() == null ? 0 : livroRepository.countByCategoriaId(categoria.getId());
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                totalLivros
        );
    }

    private String limparTextoOpcional(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        return texto.trim();
    }
}
