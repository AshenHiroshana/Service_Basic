import {Unit} from './unit';
import {User} from './user';
import {Supplier} from './supplier';
import {Itemstatus} from './itemstatus';
import {Itemcategory} from './itemcategory';
import {DataPage} from '../shared/data-page';

export class Item {
  id: number;
  code: string;
  name: string;
  itemcategory: Itemcategory;
  unit: Unit;
  supplier: Supplier;
  photo: string;
  price: number;
  qty: number;
  rop: number;
  description: string;
  itemstatus: Itemstatus;
  creator: User;
  tocreation: string;
}

export class ItemDataPage extends DataPage{
    content: Item[];
}
