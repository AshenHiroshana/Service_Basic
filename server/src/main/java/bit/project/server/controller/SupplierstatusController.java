package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Supplierstatus;
import bit.project.server.dao.SupplierstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/supplierstatuses")
public class SupplierstatusController{

    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @GetMapping
    public List<Supplierstatus> getAll(){
        return supplierstatusDao.findAll();
    }
}