package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class CustomerpaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "customerpayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "customerpayment";
    }

    public CustomerpaymentDelete(){
        addBodyLine("    update sale set balance = balance + OLD.amount where id = OLD.sale_id;");
    }

}