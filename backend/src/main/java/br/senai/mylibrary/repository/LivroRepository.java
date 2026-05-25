package br.senai.mylibrary.repository;

import br.senai.mylibrary.model.Livro;
import br.senai.mylibrary.model.StatusLivro;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    long countByCategoriaId(Long categoriaId);

    long countByStatus(StatusLivro status);

    @EntityGraph(attributePaths = "categoria")
    @Query("""
            select l from Livro l
            where (:categoriaId is null or l.categoria.id = :categoriaId)
              and (:status is null or l.status = :status)
              and (
                    :termo is null
                    or lower(l.titulo) like lower(concat('%', :termo, '%'))
                    or lower(l.autor) like lower(concat('%', :termo, '%'))
                  )
            order by l.titulo
            """)
    List<Livro> filtrar(
            @Param("categoriaId") Long categoriaId,
            @Param("status") StatusLivro status,
            @Param("termo") String termo
    );
}
