package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ItemcategoryData extends AbstractSeedClass {

    public ItemcategoryData(){
        addIdNameData(1, "Building");
        addIdNameData(2, "Roofing & Ceiling");
        addIdNameData(3, "Steel");
        addIdNameData(4, "Garden & Deco");
        addIdNameData(5, "Paint");
        addIdNameData(6, "Plumbing");
        addIdNameData(7, "Safely Items");
        addIdNameData(8, "Electrical Machines");
        addIdNameData(9, "Electrical Items");
        addIdNameData(10, "Fasteners");
        addIdNameData(11, "Home & Kitchen");
        addIdNameData(12, "Bath-ware Items");
        addIdNameData(13, "Other Tools");
    }

}