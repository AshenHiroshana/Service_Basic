package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class CustomerpaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "customerpayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "customerpayment";
    }

    public CustomerpaymentInsert(){
        addBodyLine("    update sale set balance = balance - NEW.amount where id = NEW.sale_id;");
    }

}