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
import bit.project.server.entity.Supplierreturn;
import bit.project.server.dao.SupplierreturnDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Supplierreturnitem;
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
@RequestMapping("/supplierreturns")
public class SupplierreturnController{

    @Autowired
    private SupplierreturnDao supplierreturnDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SupplierreturnController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("supplierreturn");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Supplierreturn> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all supplierreturns", UsecaseList.SHOW_ALL_SUPPLIERRETURNS);

        if(pageQuery.isEmptySearch()){
            return supplierreturnDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer supplierId = pageQuery.getSearchParamAsInteger("supplier");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        String chequeno = pageQuery.getSearchParam("chequeno");
        String chequebank = pageQuery.getSearchParam("chequebank");
        String chequebranch = pageQuery.getSearchParam("chequebranch");

        List<Supplierreturn> supplierreturns = supplierreturnDao.findAll(DEFAULT_SORT);
        Stream<Supplierreturn> stream = supplierreturns.parallelStream();

        List<Supplierreturn> filteredSupplierreturns = stream.filter(supplierreturn -> {
            if(code!=null)
                if(!supplierreturn.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(supplierId!=null)
                if(!supplierreturn.getSupplier().getId().equals(supplierId)) return false;
            if(paymenttypeId!=null)
                if(!supplierreturn.getPaymenttype().getId().equals(paymenttypeId)) return false;
            if(paymentstatusId!=null)
                if(!supplierreturn.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(chequeno!=null)
                if(!supplierreturn.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            if(chequebank!=null)
                if(!supplierreturn.getChequebank().toLowerCase().contains(chequebank.toLowerCase())) return false;
            if(chequebranch!=null)
                if(!supplierreturn.getChequebranch().toLowerCase().contains(chequebranch.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSupplierreturns, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Supplierreturn> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all supplierreturns' basic data", UsecaseList.SHOW_ALL_SUPPLIERRETURNS);
        return supplierreturnDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Supplierreturn get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get supplierreturn", UsecaseList.SHOW_SUPPLIERRETURN_DETAILS, UsecaseList.UPDATE_SUPPLIERRETURN);
        Optional<Supplierreturn> optionalSupplierreturn = supplierreturnDao.findById(id);
        if(optionalSupplierreturn.isEmpty()) throw new ObjectNotFoundException("Supplierreturn not found");
        return optionalSupplierreturn.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete supplierreturns", UsecaseList.DELETE_SUPPLIERRETURN);

        try{
            if(supplierreturnDao.existsById(id)) supplierreturnDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this supplierreturn already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Supplierreturn supplierreturn, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new supplierreturn", UsecaseList.ADD_SUPPLIERRETURN);

        supplierreturn.setTocreation(LocalDateTime.now());
        supplierreturn.setCreator(authUser);
        supplierreturn.setId(null);

        for(Supplierreturnitem supplierreturnitem : supplierreturn.getSupplierreturnitemList()) supplierreturnitem.setSupplierreturn(supplierreturn);

        EntityValidator.validate(supplierreturn);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplierreturn.getChequeno() != null){
            Supplierreturn supplierreturnByChequeno = supplierreturnDao.findByChequeno(supplierreturn.getChequeno());
            if(supplierreturnByChequeno!=null) errorBag.add("chequeno","chequeno already exists");
        }

        if(supplierreturn.getChequebank() != null){
            Supplierreturn supplierreturnByChequebank = supplierreturnDao.findByChequebank(supplierreturn.getChequebank());
            if(supplierreturnByChequebank!=null) errorBag.add("chequebank","chequebank already exists");
        }

        if(supplierreturn.getChequebranch() != null){
            Supplierreturn supplierreturnByChequebranch = supplierreturnDao.findByChequebranch(supplierreturn.getChequebranch());
            if(supplierreturnByChequebranch!=null) errorBag.add("chequebranch","chequebranch already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            supplierreturn.setCode(codeGenerator.getNextId(codeConfig));
            return supplierreturnDao.save(supplierreturn);
        });

        return new ResourceLink(supplierreturn.getId(), "/supplierreturns/"+supplierreturn.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Supplierreturn supplierreturn, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update supplierreturn details", UsecaseList.UPDATE_SUPPLIERRETURN);

        Optional<Supplierreturn> optionalSupplierreturn = supplierreturnDao.findById(id);
        if(optionalSupplierreturn.isEmpty()) throw new ObjectNotFoundException("Supplierreturn not found");
        Supplierreturn oldSupplierreturn = optionalSupplierreturn.get();

        supplierreturn.setId(id);
        supplierreturn.setCode(oldSupplierreturn.getCode());
        supplierreturn.setCreator(oldSupplierreturn.getCreator());
        supplierreturn.setTocreation(oldSupplierreturn.getTocreation());
        supplierreturn.setReturnedamount(oldSupplierreturn.getReturnedamount());

        for(Supplierreturnitem supplierreturnitem : supplierreturn.getSupplierreturnitemList()) supplierreturnitem.setSupplierreturn(supplierreturn);

        EntityValidator.validate(supplierreturn);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplierreturn.getChequeno() != null){
            Supplierreturn supplierreturnByChequeno = supplierreturnDao.findByChequeno(supplierreturn.getChequeno());
            if(supplierreturnByChequeno!=null)
                if(!supplierreturnByChequeno.getId().equals(id))
                    errorBag.add("chequeno","chequeno already exists");
        }

        if(supplierreturn.getChequebank() != null){
            Supplierreturn supplierreturnByChequebank = supplierreturnDao.findByChequebank(supplierreturn.getChequebank());
            if(supplierreturnByChequebank!=null)
                if(!supplierreturnByChequebank.getId().equals(id))
                    errorBag.add("chequebank","chequebank already exists");
        }

        if(supplierreturn.getChequebranch() != null){
            Supplierreturn supplierreturnByChequebranch = supplierreturnDao.findByChequebranch(supplierreturn.getChequebranch());
            if(supplierreturnByChequebranch!=null)
                if(!supplierreturnByChequebranch.getId().equals(id))
                    errorBag.add("chequebranch","chequebranch already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        supplierreturn = supplierreturnDao.save(supplierreturn);
        return new ResourceLink(supplierreturn.getId(), "/supplierreturns/"+supplierreturn.getId());
    }

}