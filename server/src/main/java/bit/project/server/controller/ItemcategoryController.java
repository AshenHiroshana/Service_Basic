package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Itemcategory;
import bit.project.server.dao.ItemcategoryDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/itemcategories")
public class ItemcategoryController{

    @Autowired
    private ItemcategoryDao itemcategoryDao;

    @GetMapping
    public List<Itemcategory> getAll(){
        return itemcategoryDao.findAll();
    }
}