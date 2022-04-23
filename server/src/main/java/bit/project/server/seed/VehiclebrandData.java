package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class VehiclebrandData extends AbstractSeedClass {

    public VehiclebrandData(){
        addIdNameData(1, "Suzuki");
        addIdNameData(2, "Honda");
        addIdNameData(3, "Nissan");
        addIdNameData(4, "Bajaj");
        addIdNameData(5, "Mitsubishi");
        addIdNameData(6, "Hyundai");
        addIdNameData(7, "Mahindra");
    }

}
