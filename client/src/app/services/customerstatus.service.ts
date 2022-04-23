import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Customerstatus} from '../entities/customerstatus';

@Injectable({
  providedIn: 'root'
})
export class CustomerstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Customerstatus[]>{
    const customerstatuses = await this.http.get<Customerstatus[]>(ApiManager.getURL('customerstatuses')).toPromise();
    return customerstatuses.map((customerstatus) => Object.assign(new Customerstatus(), customerstatus));
  }

}
