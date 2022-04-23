import {User} from './user';
import {Purchase} from './purchase';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Supplierpayment {
  id: number;
  code: string;
  amount: number;
  date: string;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  purchase: Purchase;
  paymenttype: Paymenttype;
  description: string;
  paymentstatus: Paymentstatus;
  creator: User;
  tocreation: string;
}

export class SupplierpaymentDataPage extends DataPage{
    content: Supplierpayment[];
}
