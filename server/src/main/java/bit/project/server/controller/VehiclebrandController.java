package bit.project.server.controller;

import bit.project.server.dao.VehiclebrandDao;
import bit.project.server.entity.Vehiclebrand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/vehiclebrands")
public class VehiclebrandController {

    @Autowired
    private VehiclebrandDao vehiclebrandDao;

    @GetMapping
    public List<Vehiclebrand> getAll(){
        return vehiclebrandDao.findAll();
    }
}
