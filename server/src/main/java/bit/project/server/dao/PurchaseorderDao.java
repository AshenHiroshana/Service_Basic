package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Purchaseorder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PurchaseorderDao extends JpaRepository<Purchaseorder, Integer>{
    @Query("select new Purchaseorder (p.id,p.code,p.ordereddate,p.requireddate,p.supplier,p.purchaseorderstatus) from Purchaseorder p")
    Page<Purchaseorder> findAllBasic(PageRequest pageRequest);

    Purchaseorder findByCode(String code);
}