package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PurchaseorderstatusData extends AbstractSeedClass {

    public PurchaseorderstatusData(){
        addIdNameData(1, "Ordered");
        addIdNameData(2, "Received");
        addIdNameData(3, "Canceled");
    }

}