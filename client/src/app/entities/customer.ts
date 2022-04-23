import {User} from './user';
import {Nametitle} from './nametitle';
import {DataPage} from '../shared/data-page';
import {Customerstatus} from './customerstatus';

export class Customer {
  id: number;
  code: string;
  nametitle: Nametitle;
  name: string;
  nic: string;
  contact1: string;
  contact2: string;
  email: string;
  address: string;
  creditlimit: number;
  description: string;
  customerstatus: Customerstatus;
  creator: User;
  tocreation: string;
}

export class CustomerDataPage extends DataPage{
    content: Customer[];
}
