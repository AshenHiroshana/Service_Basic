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
public class Item{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String photo;

    private BigDecimal price;

    private BigDecimal qty;

    private BigDecimal rop;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Itemcategory itemcategory;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private Itemstatus itemstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Customerreturnitem> customerreturnitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Disposalitem> disposalitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Purchaseitem> purchaseitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Purchaseorderitem> purchaseorderitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Saleitem> saleitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Supplierreturnitem> supplierreturnitemList;


    public Item(Integer id){
        this.id = id;
    }

    public Item(Integer id, String code, String name, Itemcategory itemcategory, String photo, BigDecimal price, Itemstatus itemstatus){
        this.id = id;
        this.code = code;
        this.name = name;
        this.itemcategory = itemcategory;
        this.photo = photo;
        this.price = price;
        this.itemstatus = itemstatus;
    }

}
