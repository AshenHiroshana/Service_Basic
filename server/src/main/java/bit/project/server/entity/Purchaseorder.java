package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
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
public class Purchaseorder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate ordereddate;

    private LocalDate requireddate;

    @Lob
    private String description;

    private LocalDate reciveddate;

    private LocalDateTime tocreation;


    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private Purchaseorderstatus purchaseorderstatus;

    @OneToMany(mappedBy="purchaseorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Purchaseorderitem> purchaseorderitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "purchaseorder")
    private List<Purchase> purchaseorderPurchaseList;


    public Purchaseorder(Integer id){
        this.id = id;
    }

    public Purchaseorder(Integer id, String code, LocalDate ordereddate, LocalDate requireddate, Supplier supplier, Purchaseorderstatus purchaseorderstatus){
        this.id = id;
        this.code = code;
        this.ordereddate = ordereddate;
        this.requireddate = requireddate;
        this.supplier = supplier;
        this.purchaseorderstatus = purchaseorderstatus;
    }

}