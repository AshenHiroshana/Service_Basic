import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Supplierstatus} from './supplierstatus';

export class Supplier {
  id: number;
  code: string;
  name: string;
  contact1: string;
  contact2: string;
  fax: string;
  email: string;
  address: string;
  creditallowed: number;
  description: string;
  supplierstatus: Supplierstatus;
  creator: User;
  tocreation: string;
}

export class SupplierDataPage extends DataPage{
    content: Supplier[];
}
