import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Purchasestatus} from '../entities/purchasestatus';

@Injectable({
  providedIn: 'root'
})
export class PurchasestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Purchasestatus[]>{
    const purchasestatuses = await this.http.get<Purchasestatus[]>(ApiManager.getURL('purchasestatuses')).toPromise();
    return purchasestatuses.map((purchasestatus) => Object.assign(new Purchasestatus(), purchasestatus));
  }

}
