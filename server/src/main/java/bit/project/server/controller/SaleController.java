package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.entity.Sale;
import bit.project.server.dao.SaleDao;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Saleitem;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/sales")
public class SaleController{

    @Autowired
    private SaleDao saleDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SaleController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("sale");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("S");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Sale> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all sales", UsecaseList.SHOW_ALL_SALES);

        if(pageQuery.isEmptySearch()){
            return saleDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer customerId = pageQuery.getSearchParamAsInteger("customer");
        Integer saletypeId = pageQuery.getSearchParamAsInteger("saletype");

        List<Sale> sales = saleDao.findAll(DEFAULT_SORT);
        Stream<Sale> stream = sales.parallelStream();

        List<Sale> filteredSales = stream.filter(sale -> {
            if(code!=null)
                if(!sale.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(customerId!=null)
                if(!sale.getCustomer().getId().equals(customerId)) return false;
            if(saletypeId!=null)
                if(!sale.getSaletype().getId().equals(saletypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSales, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Sale> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all sales' basic data", UsecaseList.SHOW_ALL_SALES, UsecaseList.ADD_CUSTOMERPAYMENT, UsecaseList.UPDATE_CUSTOMERPAYMENT, UsecaseList.ADD_CUSTOMERRETURN, UsecaseList.UPDATE_CUSTOMERRETURN);
        return saleDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Sale get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get sale", UsecaseList.SHOW_SALE_DETAILS, UsecaseList.UPDATE_SALE);
        Optional<Sale> optionalSale = saleDao.findById(id);
        if(optionalSale.isEmpty()) throw new ObjectNotFoundException("Sale not found");
        return optionalSale.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete sales", UsecaseList.DELETE_SALE);

        try{
            if(saleDao.existsById(id)) saleDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this sale already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Sale sale, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new sale", UsecaseList.ADD_SALE);

        sale.setTocreation(LocalDateTime.now());
        sale.setCreator(authUser);
        sale.setId(null);

        for(Saleitem saleitem : sale.getSaleitemList()) saleitem.setSale(sale);

        EntityValidator.validate(sale);

        PersistHelper.save(()->{
            sale.setCode(codeGenerator.getNextId(codeConfig));
            return saleDao.save(sale);
        });

        return new ResourceLink(sale.getId(), "/sales/"+sale.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Sale sale, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update sale details", UsecaseList.UPDATE_SALE);

        Optional<Sale> optionalSale = saleDao.findById(id);
        if(optionalSale.isEmpty()) throw new ObjectNotFoundException("Sale not found");
        Sale oldSale = optionalSale.get();

        sale.setId(id);
        sale.setCode(oldSale.getCode());
        sale.setCreator(oldSale.getCreator());
        sale.setTocreation(oldSale.getTocreation());

        for(Saleitem saleitem : sale.getSaleitemList()) saleitem.setSale(sale);

        EntityValidator.validate(sale);

        sale = saleDao.save(sale);
        return new ResourceLink(sale.getId(), "/sales/"+sale.getId());
    }

}
