package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class VehicletypeData extends AbstractSeedClass {

    public VehicletypeData(){
        addIdNameData(1, "Car");
        addIdNameData(2, "Motorbikes");
        addIdNameData(3, "Lorry");
        addIdNameData(4, "Suv");
        addIdNameData(5, "Van");
        addIdNameData(6, "Three Wheel");
        addIdNameData(7, "Bus");
    }

}
