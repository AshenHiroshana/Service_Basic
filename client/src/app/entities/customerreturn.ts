import {Sale} from './sale';
import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Customerreturnitem} from './customerreturnitem';

export class Customerreturn {
  id: number;
  code: string;
  sale: Sale;
  date: string;
  reason: string;
  amount: number;
  paymenttype: Paymenttype;
  paymentstatus: Paymentstatus;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  description: string;
  customerreturnitemList: Customerreturnitem[];
  creator: User;
  tocreation: string;
}

export class CustomerreturnDataPage extends DataPage{
    content: Customerreturn[];
}
