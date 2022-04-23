import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Vehicletype} from './vehicletype';
import {Customer} from './customer';
import {Vehiclebrand} from './vehiclebrand';
import {Transmission} from './transmission';
import {Fueltype} from './fueltype';

export class Vehicle {
  id: number;
  code: string;
  tocreation: string;
  description: string;
  creator: User;
  no: string;
  photo: string;
  vehicletype: Vehicletype;
  makeyear: number;
  customer: Customer;
  vehiclebrand: Vehiclebrand;
  model: string;
  transmission: Transmission;
  fueltype: Fueltype;

  constructor(id: number = null) {
    this.id = id;
  }
}

export class VehicleDataPage extends DataPage{
    content: Vehicle[];
}
