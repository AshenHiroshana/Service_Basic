import {Sale} from './sale';
import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Customerpayment {
  id: number;
  code: string;
  amount: number;
  date: string;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  sale: Sale;
  paymenttype: Paymenttype;
  description: string;
  paymentstatus: Paymentstatus;
  creator: User;
  tocreation: string;
}

export class CustomerpaymentDataPage extends DataPage{
    content: Customerpayment[];
}
