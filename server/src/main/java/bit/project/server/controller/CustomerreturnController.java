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
import bit.project.server.entity.Customerreturn;
import bit.project.server.dao.CustomerreturnDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Customerreturnitem;
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
@RequestMapping("/customerreturns")
public class CustomerreturnController{

    @Autowired
    private CustomerreturnDao customerreturnDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public CustomerreturnController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("customerreturn");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Customerreturn> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all customerreturns", UsecaseList.SHOW_ALL_CUSTOMERRETURNS);

        if(pageQuery.isEmptySearch()){
            return customerreturnDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer saleId = pageQuery.getSearchParamAsInteger("sale");
        Integer paymenttypeId = pageQuery.getSearchParamAsInteger("paymenttype");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");
        String chequeno = pageQuery.getSearchParam("chequeno");
        String chequebank = pageQuery.getSearchParam("chequebank");
        String chequebranch = pageQuery.getSearchParam("chequebranch");

        List<Customerreturn> customerreturns = customerreturnDao.findAll(DEFAULT_SORT);
        Stream<Customerreturn> stream = customerreturns.parallelStream();

        List<Customerreturn> filteredCustomerreturns = stream.filter(customerreturn -> {
            if(code!=null)
                if(!customerreturn.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(saleId!=null)
                if(!customerreturn.getSale().getId().equals(saleId)) return false;
            if(paymenttypeId!=null)
                if(!customerreturn.getPaymenttype().getId().equals(paymenttypeId)) return false;
            if(paymentstatusId!=null)
                if(!customerreturn.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            if(chequeno!=null)
                if(!customerreturn.getChequeno().toLowerCase().contains(chequeno.toLowerCase())) return false;
            if(chequebank!=null)
                if(!customerreturn.getChequebank().toLowerCase().contains(chequebank.toLowerCase())) return false;
            if(chequebranch!=null)
                if(!customerreturn.getChequebranch().toLowerCase().contains(chequebranch.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredCustomerreturns, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Customerreturn> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all customerreturns' basic data", UsecaseList.SHOW_ALL_CUSTOMERRETURNS);
        return customerreturnDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Customerreturn get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get customerreturn", UsecaseList.SHOW_CUSTOMERRETURN_DETAILS, UsecaseList.UPDATE_CUSTOMERRETURN);
        Optional<Customerreturn> optionalCustomerreturn = customerreturnDao.findById(id);
        if(optionalCustomerreturn.isEmpty()) throw new ObjectNotFoundException("Customerreturn not found");
        return optionalCustomerreturn.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete customerreturns", UsecaseList.DELETE_CUSTOMERRETURN);

        try{
            if(customerreturnDao.existsById(id)) customerreturnDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this customerreturn already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Customerreturn customerreturn, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new customerreturn", UsecaseList.ADD_CUSTOMERRETURN);

        customerreturn.setTocreation(LocalDateTime.now());
        customerreturn.setCreator(authUser);
        customerreturn.setId(null);

        for(Customerreturnitem customerreturnitem : customerreturn.getCustomerreturnitemList()) customerreturnitem.setCustomerreturn(customerreturn);

        EntityValidator.validate(customerreturn);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(customerreturn.getChequeno() != null){
            Customerreturn customerreturnByChequeno = customerreturnDao.findByChequeno(customerreturn.getChequeno());
            if(customerreturnByChequeno!=null) errorBag.add("chequeno","chequeno already exists");
        }

        if(customerreturn.getChequebank() != null){
            Customerreturn customerreturnByChequebank = customerreturnDao.findByChequebank(customerreturn.getChequebank());
            if(customerreturnByChequebank!=null) errorBag.add("chequebank","chequebank already exists");
        }

        if(customerreturn.getChequebranch() != null){
            Customerreturn customerreturnByChequebranch = customerreturnDao.findByChequebranch(customerreturn.getChequebranch());
            if(customerreturnByChequebranch!=null) errorBag.add("chequebranch","chequebranch already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            customerreturn.setCode(codeGenerator.getNextId(codeConfig));
            return customerreturnDao.save(customerreturn);
        });

        return new ResourceLink(customerreturn.getId(), "/customerreturns/"+customerreturn.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Customerreturn customerreturn, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update customerreturn details", UsecaseList.UPDATE_CUSTOMERRETURN);

        Optional<Customerreturn> optionalCustomerreturn = customerreturnDao.findById(id);
        if(optionalCustomerreturn.isEmpty()) throw new ObjectNotFoundException("Customerreturn not found");
        Customerreturn oldCustomerreturn = optionalCustomerreturn.get();

        customerreturn.setId(id);
        customerreturn.setCode(oldCustomerreturn.getCode());
        customerreturn.setCreator(oldCustomerreturn.getCreator());
        customerreturn.setTocreation(oldCustomerreturn.getTocreation());
        customerreturn.setAmount(oldCustomerreturn.getAmount());

        for(Customerreturnitem customerreturnitem : customerreturn.getCustomerreturnitemList()) customerreturnitem.setCustomerreturn(customerreturn);

        EntityValidator.validate(customerreturn);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(customerreturn.getChequeno() != null){
            Customerreturn customerreturnByChequeno = customerreturnDao.findByChequeno(customerreturn.getChequeno());
            if(customerreturnByChequeno!=null)
                if(!customerreturnByChequeno.getId().equals(id))
                    errorBag.add("chequeno","chequeno already exists");
        }

        if(customerreturn.getChequebank() != null){
            Customerreturn customerreturnByChequebank = customerreturnDao.findByChequebank(customerreturn.getChequebank());
            if(customerreturnByChequebank!=null)
                if(!customerreturnByChequebank.getId().equals(id))
                    errorBag.add("chequebank","chequebank already exists");
        }

        if(customerreturn.getChequebranch() != null){
            Customerreturn customerreturnByChequebranch = customerreturnDao.findByChequebranch(customerreturn.getChequebranch());
            if(customerreturnByChequebranch!=null)
                if(!customerreturnByChequebranch.getId().equals(id))
                    errorBag.add("chequebranch","chequebranch already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        customerreturn = customerreturnDao.save(customerreturn);
        return new ResourceLink(customerreturn.getId(), "/customerreturns/"+customerreturn.getId());
    }

}