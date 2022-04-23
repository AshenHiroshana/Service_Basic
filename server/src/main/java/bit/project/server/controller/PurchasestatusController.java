package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Purchasestatus;
import bit.project.server.dao.PurchasestatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/purchasestatuses")
public class PurchasestatusController{

    @Autowired
    private PurchasestatusDao purchasestatusDao;

    @GetMapping
    public List<Purchasestatus> getAll(){
        return purchasestatusDao.findAll();
    }
}