package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.dao.VehicleDao;
import bit.project.server.entity.File;
import bit.project.server.entity.User;
import bit.project.server.entity.Vehicle;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.FileHelper;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private AccessControlManager accessControlManager;

//    @Autowired
//    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
//    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public VehicleController(){
//        codeConfig = new CodeGenerator.CodeGeneratorConfig("vehicle");
//        codeConfig.setColumnName("code");
//        codeConfig.setLength(10);
//        codeConfig.setPrefix("IT");
//        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Vehicle> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all vehicles", UsecaseList.SHOW_ALL_VEHICLES);

        if(pageQuery.isEmptySearch()){
            return vehicleDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        // search fields
        String no = pageQuery.getSearchParam("no");
        String model = pageQuery.getSearchParam("model");
        Integer vehicletypeId = pageQuery.getSearchParamAsInteger("vehicletype");
        Integer vehiclebrandId = pageQuery.getSearchParamAsInteger("vehiclebrand");
        Integer transmissionId = pageQuery.getSearchParamAsInteger("transmission");
        Integer fueltypeId = pageQuery.getSearchParamAsInteger("fueltype");

        List<Vehicle> vehicles = vehicleDao.findAll(DEFAULT_SORT);
        Stream<Vehicle> stream = vehicles.parallelStream();

        List<Vehicle> filteredVehicles = stream.filter(vehicle -> {
            if(no!=null)
                if(!vehicle.getNo().toLowerCase().contains(no.toLowerCase())) return false;
            if(model!=null)
                if(!vehicle.getModel().toLowerCase().contains(model.toLowerCase())) return false;
            if(vehicletypeId!=null)
                if(!vehicle.getVehicletype().getId().equals(vehicletypeId)) return false;
            if(vehiclebrandId!=null)
                if(!vehicle.getVehiclebrand().getId().equals(vehiclebrandId)) return false;
            if(transmissionId!=null)
                if(!vehicle.getTransmission().getId().equals(transmissionId)) return false;
            if(fueltypeId!=null)
                if(!vehicle.getFueltype().getId().equals(fueltypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredVehicles, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Vehicle> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all vehicles' basic data", UsecaseList.SHOW_ALL_VEHICLES);
        return vehicleDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get vehicle", UsecaseList.SHOW_VEHICLE_DETAILS, UsecaseList.UPDATE_VEHICLE);
        Optional<Vehicle> optionalVehicle = vehicleDao.findById(id);
        if(optionalVehicle.isEmpty()) throw new ObjectNotFoundException("Vehicle not found");
        return optionalVehicle.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete vehicles", UsecaseList.DELETE_VEHICLE);

        try{
            if(vehicleDao.existsById(id)) vehicleDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this vehicle already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Vehicle vehicle, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new vehicle", UsecaseList.ADD_VEHICLE);

        System.out.println(vehicle);

        vehicle.setTocreation(LocalDateTime.now());
        vehicle.setCreator(authUser);
        vehicle.setId(null);

        EntityValidator.validate(vehicle);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(vehicle.getNo() != null){
            Vehicle vehicleByName = vehicleDao.findByNo(vehicle.getNo());
            if(vehicleByName!=null) errorBag.add("name","name already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            return vehicleDao.save(vehicle);
        });
        return new ResourceLink(vehicle.getId(), "/vehicles/"+vehicle.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Vehicle vehicle, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update vehicle details", UsecaseList.UPDATE_VEHICLE);

        Optional<Vehicle> optionalVehicle = vehicleDao.findById(id);
        if(optionalVehicle.isEmpty()) throw new ObjectNotFoundException("Vehicle not found");
        Vehicle oldVehicle = optionalVehicle.get();

        vehicle.setId(id);
        vehicle.setCreator(oldVehicle.getCreator());
        vehicle.setTocreation(oldVehicle.getTocreation());

        EntityValidator.validate(vehicle);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(vehicle.getNo() != null){
            Vehicle vehicleByName = vehicleDao.findByNo(vehicle.getNo());
            if(vehicleByName!=null)
                if(!vehicleByName.getId().equals(id))
                    errorBag.add("name","No already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        vehicle = vehicleDao.save(vehicle);
        return new ResourceLink(vehicle.getId(), "/vehicles/"+vehicle.getId());
    }

    @GetMapping("/{id}/photo")
    public HashMap<String,String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get vehicle Photo", UsecaseList.SHOW_VEHICLE_DETAILS);
        Optional<Vehicle> optionalVehicle = vehicleDao.findById(id);
        if (optionalVehicle.isEmpty()) throw new ObjectNotFoundException("Vehicle not Found");
        Vehicle vehicle = optionalVehicle.get();

        Optional<File> optionalFile = fileDao.findFileById(vehicle.getPhoto());

        if (optionalFile.isEmpty()){
            throw new ObjectNotFoundException("Photo not Found");
        }

        File photo = optionalFile.get();
        HashMap<String,String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(),photo.getFilemimetype()));

        return data;
    }

}
