package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vehicle {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime tocreation;
    private String description;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;

    private String no;
    private String photo;

    @ManyToOne
    private Vehicletype vehicletype;

    private Integer makeyear;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Vehiclebrand vehiclebrand;

    private String model;

    @ManyToOne
    private Transmission transmission;

    @ManyToOne
    private Fueltype fueltype;

    public Vehicle(Integer id) {
        this.id = id;
    }

    public Vehicle(Integer id, String no) {
        this.id = id;
        this.no = no;
    }
}
