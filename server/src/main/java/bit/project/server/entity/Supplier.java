package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Supplier{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String contact1;

    private String contact2;

    private String fax;

    private String email;

    @Lob
    private String address;

    private BigDecimal creditallowed;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Supplierstatus supplierstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Item> supplierItemList;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Purchase> supplierPurchaseList;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Purchaseorder> supplierPurchaseorderList;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private List<Supplierreturn> supplierSupplierreturnList;


    public Supplier(Integer id){
        this.id = id;
    }

    public Supplier(Integer id, String code, String name, String contact1, String email, Supplierstatus supplierstatus){
        this.id = id;
        this.code = code;
        this.name = name;
        this.contact1 = contact1;
        this.email = email;
        this.supplierstatus = supplierstatus;
    }

}