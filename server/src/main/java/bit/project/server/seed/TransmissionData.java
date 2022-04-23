package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class TransmissionData extends AbstractSeedClass {

    public TransmissionData(){
        addIdNameData(1, "Manual");
        addIdNameData(2, "Automatic");
        addIdNameData(3, "Semi-Automatic");
    }

}
