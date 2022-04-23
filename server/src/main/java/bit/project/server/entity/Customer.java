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
public class Customer{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private String nic;

    private String contact1;

    private String contact2;

    private String email;

    @Lob
    private String address;

    private BigDecimal creditlimit;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Customerstatus customerstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private List<Sale> customerSaleList;


    public Customer(Integer id){
        this.id = id;
    }

    public Customer(Integer id, String code, Nametitle nametitle, String name, String contact1, String email, Customerstatus customerstatus){
        this.id = id;
        this.code = code;
        this.nametitle = nametitle;
        this.name = name;
        this.contact1 = contact1;
        this.email = email;
        this.customerstatus = customerstatus;
    }

}