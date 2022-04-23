package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Purchaseorder;
import bit.project.server.dao.PurchaseorderDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Purchaseorderitem;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Purchaseorderstatus;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/purchaseorders")
public class PurchaseorderController{

    @Autowired
    private PurchaseorderDao purchaseorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PurchaseorderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("purchaseorder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Purchaseorder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all purchaseorders", UsecaseList.SHOW_ALL_PURCHASEORDERS);

        if(pageQuery.isEmptySearch()){
            return purchaseorderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer supplierId = pageQuery.getSearchParamAsInteger("supplier");
        Integer purchaseorderstatusId = pageQuery.getSearchParamAsInteger("purchaseorderstatus");

        List<Purchaseorder> purchaseorders = purchaseorderDao.findAll(DEFAULT_SORT);
        Stream<Purchaseorder> stream = purchaseorders.parallelStream();

        List<Purchaseorder> filteredPurchaseorders = stream.filter(purchaseorder -> {
            if(code!=null)
                if(!purchaseorder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(supplierId!=null)
                if(!purchaseorder.getSupplier().getId().equals(supplierId)) return false;
            if(purchaseorderstatusId!=null)
                if(!purchaseorder.getPurchaseorderstatus().getId().equals(purchaseorderstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPurchaseorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Purchaseorder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all purchaseorders' basic data", UsecaseList.SHOW_ALL_PURCHASEORDERS, UsecaseList.ADD_PURCHASE, UsecaseList.UPDATE_PURCHASE);
        return purchaseorderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Purchaseorder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get purchaseorder", UsecaseList.SHOW_PURCHASEORDER_DETAILS, UsecaseList.UPDATE_PURCHASEORDER);
        Optional<Purchaseorder> optionalPurchaseorder = purchaseorderDao.findById(id);
        if(optionalPurchaseorder.isEmpty()) throw new ObjectNotFoundException("Purchaseorder not found");
        return optionalPurchaseorder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete purchaseorders", UsecaseList.DELETE_PURCHASEORDER);

        try{
            if(purchaseorderDao.existsById(id)) purchaseorderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this purchaseorder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Purchaseorder purchaseorder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new purchaseorder", UsecaseList.ADD_PURCHASEORDER);

        purchaseorder.setTocreation(LocalDateTime.now());
        purchaseorder.setCreator(authUser);
        purchaseorder.setId(null);
        purchaseorder.setPurchaseorderstatus(new Purchaseorderstatus(1));;

        for(Purchaseorderitem purchaseorderitem : purchaseorder.getPurchaseorderitemList()) purchaseorderitem.setPurchaseorder(purchaseorder);

        EntityValidator.validate(purchaseorder);

        PersistHelper.save(()->{
            purchaseorder.setCode(codeGenerator.getNextId(codeConfig));
            return purchaseorderDao.save(purchaseorder);
        });

        return new ResourceLink(purchaseorder.getId(), "/purchaseorders/"+purchaseorder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Purchaseorder purchaseorder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update purchaseorder details", UsecaseList.UPDATE_PURCHASEORDER);

        Optional<Purchaseorder> optionalPurchaseorder = purchaseorderDao.findById(id);
        if(optionalPurchaseorder.isEmpty()) throw new ObjectNotFoundException("Purchaseorder not found");
        Purchaseorder oldPurchaseorder = optionalPurchaseorder.get();

        purchaseorder.setId(id);
        purchaseorder.setCode(oldPurchaseorder.getCode());
        purchaseorder.setCreator(oldPurchaseorder.getCreator());
        purchaseorder.setTocreation(oldPurchaseorder.getTocreation());

        for(Purchaseorderitem purchaseorderitem : purchaseorder.getPurchaseorderitemList()) purchaseorderitem.setPurchaseorder(purchaseorder);

        EntityValidator.validate(purchaseorder);

        purchaseorder = purchaseorderDao.save(purchaseorder);
        return new ResourceLink(purchaseorder.getId(), "/purchaseorders/"+purchaseorder.getId());
    }

}