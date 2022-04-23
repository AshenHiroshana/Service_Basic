import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Purchaseorder, PurchaseorderDataPage} from '../entities/purchaseorder';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PurchaseorderDataPage>{
    const url = pageRequest.getPageRequestURL('purchaseorders');
    const purchaseorderDataPage = await this.http.get<PurchaseorderDataPage>(ApiManager.getURL(url)).toPromise();
    purchaseorderDataPage.content = purchaseorderDataPage.content.map((purchaseorder) => Object.assign(new Purchaseorder(), purchaseorder));
    return purchaseorderDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PurchaseorderDataPage>{
    const url = pageRequest.getPageRequestURL('purchaseorders/basic');
    const purchaseorderDataPage = await this.http.get<PurchaseorderDataPage>(ApiManager.getURL(url)).toPromise();
    purchaseorderDataPage.content = purchaseorderDataPage.content.map((purchaseorder) => Object.assign(new Purchaseorder(), purchaseorder));
    return purchaseorderDataPage;
  }

  async get(id: number): Promise<Purchaseorder>{
    const purchaseorder: Purchaseorder = await this.http.get<Purchaseorder>(ApiManager.getURL(`purchaseorders/${id}`)).toPromise();
    return Object.assign(new Purchaseorder(), purchaseorder);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`purchaseorders/${id}`)).toPromise();
  }

  async add(purchaseorder: Purchaseorder): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`purchaseorders`), purchaseorder).toPromise();
  }

  async update(id: number, purchaseorder: Purchaseorder): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`purchaseorders/${id}`), purchaseorder).toPromise();
  }

}
