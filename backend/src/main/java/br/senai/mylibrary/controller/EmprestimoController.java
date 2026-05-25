package br.senai.mylibrary.controller;

import br.senai.mylibrary.dto.EmprestimoRequest;
import br.senai.mylibrary.dto.EmprestimoResponse;
import br.senai.mylibrary.service.EmprestimoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @GetMapping
    public List<EmprestimoResponse> listar(@RequestParam(required = false) Long livroId) {
        return emprestimoService.listar(livroId);
    }

    @GetMapping("/ativos")
    public List<EmprestimoResponse> listarAtivos() {
        return emprestimoService.listarAtivos();
    }

    @GetMapping("/atrasados")
    public List<EmprestimoResponse> listarAtrasados() {
        return emprestimoService.listarAtrasados();
    }

    @PostMapping("/emprestar")
    @ResponseStatus(HttpStatus.CREATED)
    public EmprestimoResponse emprestar(@Valid @RequestBody EmprestimoRequest request) {
        return emprestimoService.emprestar(request);
    }

    @PostMapping("/{id}/devolver")
    public EmprestimoResponse devolver(@PathVariable Long id) {
        return emprestimoService.devolver(id);
    }
}
