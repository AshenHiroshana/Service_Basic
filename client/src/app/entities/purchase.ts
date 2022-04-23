import {User} from './user';
import {Supplier} from './supplier';
import {Purchaseitem} from './purchaseitem';
import {DataPage} from '../shared/data-page';
import {Purchaseorder} from './purchaseorder';
import {Purchasestatus} from './purchasestatus';

export class Purchase {
  id: number;
  code: string;
  date: string;
  supplier: Supplier;
  total: number;
  purchaseorder: Purchaseorder;
  description: string;
  purchasestatus: Purchasestatus;
  purchaseitemList: Purchaseitem[];
  creator: User;
  tocreation: string;
}

export class PurchaseDataPage extends DataPage{
    content: Purchase[];
}
