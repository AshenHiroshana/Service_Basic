package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Itemstatus;
import bit.project.server.dao.ItemstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/itemstatuses")
public class ItemstatusController{

    @Autowired
    private ItemstatusDao itemstatusDao;

    @GetMapping
    public List<Itemstatus> getAll(){
        return itemstatusDao.findAll();
    }
}