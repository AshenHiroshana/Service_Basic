package bit.project.server.dao;

import bit.project.server.entity.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SaleDao extends JpaRepository<Sale, Integer>{
    @Query("select new Sale (s.id,s.code,s.date,s.customer,s.total,s.saletype) from Sale s")
    Page<Sale> findAllBasic(PageRequest pageRequest);

    Sale findByCode(String code);
}