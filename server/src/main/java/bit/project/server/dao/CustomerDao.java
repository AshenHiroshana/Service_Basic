package bit.project.server.dao;

import bit.project.server.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerDao extends JpaRepository<Customer, Integer>{
    @Query("select new Customer (c.id,c.code,c.nametitle,c.name,c.contact1,c.email,c.customerstatus) from Customer c")
    Page<Customer> findAllBasic(PageRequest pageRequest);

    Customer findByCode(String code);
    Customer findByNic(String nic);
}