package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class SaletypeData extends AbstractSeedClass {

    public SaletypeData(){
        addIdNameData(1, "Retail");
        addIdNameData(2, "Whole Sale");
    }

}