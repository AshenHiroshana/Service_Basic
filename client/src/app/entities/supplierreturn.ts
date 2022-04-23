import {User} from './user';
import {Supplier} from './supplier';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Supplierreturnitem} from './supplierreturnitem';

export class Supplierreturn {
  id: number;
  code: string;
  supplier: Supplier;
  date: string;
  reason: string;
  returnedamount: number;
  paymenttype: Paymenttype;
  paymentstatus: Paymentstatus;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  description: string;
  supplierreturnitemList: Supplierreturnitem[];
  creator: User;
  tocreation: string;
}

export class SupplierreturnDataPage extends DataPage{
    content: Supplierreturn[];
}
