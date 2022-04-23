import {User} from './user';
import {Customer} from './customer';
import {Saletype} from './saletype';
import {Saleitem} from './saleitem';
import {DataPage} from '../shared/data-page';

export class Sale {
  id: number;
  code: string;
  date: string;
  customer: Customer;
  total: number;
  balance: number;
  saletype: Saletype;
  datetobepayed: string;
  description: string;
  saleitemList: Saleitem[];
  creator: User;
  tocreation: string;
}

export class SaleDataPage extends DataPage{
    content: Sale[];
}
