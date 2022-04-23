package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class UnitData extends AbstractSeedClass {

    public UnitData(){
        addIdNameData(1, "Item");
        addIdNameData(2, "Cube");
        addIdNameData(3, "Gram (g)");
        addIdNameData(4, "Kilogram (kg)");
        addIdNameData(5, "Meter (m)");
        addIdNameData(6, "Centimeter (cm)");
        addIdNameData(7, "Liter (l)");
        addIdNameData(8, "Mililiter (ml)");
    }

}