package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Customerstatus;
import bit.project.server.dao.CustomerstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/customerstatuses")
public class CustomerstatusController{

    @Autowired
    private CustomerstatusDao customerstatusDao;

    @GetMapping
    public List<Customerstatus> getAll(){
        return customerstatusDao.findAll();
    }
}