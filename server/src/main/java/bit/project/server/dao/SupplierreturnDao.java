package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Supplierreturn;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SupplierreturnDao extends JpaRepository<Supplierreturn, Integer>{
    @Query("select new Supplierreturn (s.id,s.code,s.supplier,s.date,s.returnedamount) from Supplierreturn s")
    Page<Supplierreturn> findAllBasic(PageRequest pageRequest);

    Supplierreturn findByCode(String code);
    Supplierreturn findByChequeno(String chequeno);
    Supplierreturn findByChequebank(String chequebank);
    Supplierreturn findByChequebranch(String chequebranch);
}