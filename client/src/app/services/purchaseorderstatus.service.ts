import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Purchaseorderstatus} from '../entities/purchaseorderstatus';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Purchaseorderstatus[]>{
    const purchaseorderstatuses = await this.http.get<Purchaseorderstatus[]>(ApiManager.getURL('purchaseorderstatuses')).toPromise();
    return purchaseorderstatuses.map((purchaseorderstatus) => Object.assign(new Purchaseorderstatus(), purchaseorderstatus));
  }

}
