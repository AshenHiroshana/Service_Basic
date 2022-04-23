import {User} from './user';
import {Supplier} from './supplier';
import {DataPage} from '../shared/data-page';
import {Purchaseorderitem} from './purchaseorderitem';
import {Purchaseorderstatus} from './purchaseorderstatus';

export class Purchaseorder {
  id: number;
  code: string;
  ordereddate: string;
  requireddate: string;
  supplier: Supplier;
  description: string;
  reciveddate: string;
  purchaseorderstatus: Purchaseorderstatus;
  purchaseorderitemList: Purchaseorderitem[];
  creator: User;
  tocreation: string;
}

export class PurchaseorderDataPage extends DataPage{
    content: Purchaseorder[];
}
