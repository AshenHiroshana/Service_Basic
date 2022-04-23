package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Saletype;
import bit.project.server.dao.SaletypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/saletypes")
public class SaletypeController{

    @Autowired
    private SaletypeDao saletypeDao;

    @GetMapping
    public List<Saletype> getAll(){
        return saletypeDao.findAll();
    }
}