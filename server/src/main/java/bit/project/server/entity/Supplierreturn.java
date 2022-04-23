package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Supplierreturn{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    @Lob
    private String reason;

    private BigDecimal returnedamount;

    private String chequeno;

    private LocalDate chequedate;

    private String chequebank;

    private String chequebranch;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @OneToMany(mappedBy="supplierreturn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supplierreturnitem> supplierreturnitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Supplierreturn(Integer id){
        this.id = id;
    }

    public Supplierreturn(Integer id, String code, Supplier supplier, LocalDate date, BigDecimal returnedamount){
        this.id = id;
        this.code = code;
        this.supplier = supplier;
        this.date = date;
        this.returnedamount = returnedamount;
    }

}