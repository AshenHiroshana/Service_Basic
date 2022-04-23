package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customerreturn;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerreturnDao extends JpaRepository<Customerreturn, Integer>{
    @Query("select new Customerreturn (c.id,c.code,c.sale,c.date,c.amount) from Customerreturn c")
    Page<Customerreturn> findAllBasic(PageRequest pageRequest);

    Customerreturn findByCode(String code);
    Customerreturn findByChequeno(String chequeno);
    Customerreturn findByChequebank(String chequebank);
    Customerreturn findByChequebranch(String chequebranch);
}