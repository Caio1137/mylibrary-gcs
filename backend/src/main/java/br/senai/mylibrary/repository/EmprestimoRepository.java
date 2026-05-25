package br.senai.mylibrary.repository;

import br.senai.mylibrary.model.Emprestimo;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    long countByDataDevolucaoEfetivaIsNull();

    @EntityGraph(attributePaths = {"livro", "livro.categoria"})
    List<Emprestimo> findAllByOrderByDataEmprestimoDescIdDesc();

    @EntityGraph(attributePaths = {"livro", "livro.categoria"})
    List<Emprestimo> findTop5ByOrderByDataEmprestimoDescIdDesc();

    @EntityGraph(attributePaths = {"livro", "livro.categoria"})
    List<Emprestimo> findByLivroIdOrderByDataEmprestimoDescIdDesc(Long livroId);

    @EntityGraph(attributePaths = {"livro", "livro.categoria"})
    List<Emprestimo> findByDataDevolucaoEfetivaIsNullOrderByDataDevolucaoPrevistaAsc();

    @EntityGraph(attributePaths = {"livro", "livro.categoria"})
    @Query("""
            select e from Emprestimo e
            where e.dataDevolucaoEfetiva is null
              and e.dataDevolucaoPrevista < :hoje
            order by e.dataDevolucaoPrevista asc
            """)
    List<Emprestimo> listarAtrasados(@Param("hoje") LocalDate hoje);
}
