package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PurchasestatusData extends AbstractSeedClass {

    public PurchasestatusData(){
        addIdNameData(1, "Completed");
        addIdNameData(2, "Not Completed");
    }

}