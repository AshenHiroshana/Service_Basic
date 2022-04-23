package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customerpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerpaymentDao extends JpaRepository<Customerpayment, Integer>{
    @Query("select new Customerpayment (c.id,c.code,c.amount,c.date,c.sale,c.paymentstatus) from Customerpayment c")
    Page<Customerpayment> findAllBasic(PageRequest pageRequest);

    Customerpayment findByCode(String code);
    Customerpayment findByChequeno(String chequeno);
    Customerpayment findByChequebank(String chequebank);
    Customerpayment findByChequebranch(String chequebranch);
}