package br.senai.mylibrary.controller;

import br.senai.mylibrary.dto.EmprestimoResponse;
import br.senai.mylibrary.dto.LivroRequest;
import br.senai.mylibrary.dto.LivroResponse;
import br.senai.mylibrary.model.StatusLivro;
import br.senai.mylibrary.service.EmprestimoService;
import br.senai.mylibrary.service.LivroService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;
    private final EmprestimoService emprestimoService;

    public LivroController(LivroService livroService, EmprestimoService emprestimoService) {
        this.livroService = livroService;
        this.emprestimoService = emprestimoService;
    }

    @GetMapping
    public List<LivroResponse> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) StatusLivro status,
            @RequestParam(required = false, name = "q") String termo
    ) {
        return livroService.listar(categoriaId, status, termo);
    }

    @GetMapping("/{id}")
    public LivroResponse buscar(@PathVariable Long id) {
        return livroService.buscar(id);
    }

    @GetMapping("/{id}/emprestimos")
    public List<EmprestimoResponse> historico(@PathVariable Long id) {
        livroService.buscar(id);
        return emprestimoService.listar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LivroResponse criar(@Valid @RequestBody LivroRequest request) {
        return livroService.criar(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        livroService.excluir(id);
    }
}
