package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Purchaseorderstatus;
import bit.project.server.dao.PurchaseorderstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/purchaseorderstatuses")
public class PurchaseorderstatusController{

    @Autowired
    private PurchaseorderstatusDao purchaseorderstatusDao;

    @GetMapping
    public List<Purchaseorderstatus> getAll(){
        return purchaseorderstatusDao.findAll();
    }
}