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
public class Customerpayment{
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
    private Sale sale;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Customerpayment(Integer id){
        this.id = id;
    }

    public Customerpayment(Integer id, String code, BigDecimal amount, LocalDate date, Sale sale, Paymentstatus paymentstatus){
        this.id = id;
        this.code = code;
        this.amount = amount;
        this.date = date;
        this.sale = sale;
        this.paymentstatus = paymentstatus;
    }

}