package bit.project.server.dao;

import bit.project.server.entity.Purchaseorderstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PurchaseorderstatusDao extends JpaRepository<Purchaseorderstatus, Integer>{
}