package bit.project.server.controller;

import bit.project.server.dao.TransmissionDao;
import bit.project.server.entity.Transmission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/transmissions")
public class TransmissionController {

    @Autowired
    private TransmissionDao transmissionDao;

    @GetMapping
    public List<Transmission> getAll(){
        return transmissionDao.findAll();
    }
}
