package bit.project.server.entity;

import lombok.Data;
import java.time.LocalDate;
import javax.persistence.*;
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
public class Supplierpayment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private BigDecimal amount;

    private LocalDate date;

    private String chequeno;

    private LocalDate chequedate;

    private String chequebank;

    private String chequebranch;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Purchase purchase;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Supplierpayment(Integer id){
        this.id = id;
    }

    public Supplierpayment(Integer id, String code, BigDecimal amount, LocalDate date, String chequebank, String chequebranch, Purchase purchase, Paymentstatus paymentstatus){
        this.id = id;
        this.code = code;
        this.amount = amount;
        this.date = date;
        this.chequebank = chequebank;
        this.chequebranch = chequebranch;
        this.purchase = purchase;
        this.paymentstatus = paymentstatus;
    }

}