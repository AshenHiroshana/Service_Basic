import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Supplierreturn, SupplierreturnDataPage} from '../entities/supplierreturn';

@Injectable({
  providedIn: 'root'
})
export class SupplierreturnService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<SupplierreturnDataPage>{
    const url = pageRequest.getPageRequestURL('supplierreturns');
    const supplierreturnDataPage = await this.http.get<SupplierreturnDataPage>(ApiManager.getURL(url)).toPromise();
    supplierreturnDataPage.content = supplierreturnDataPage.content.map((supplierreturn) => Object.assign(new Supplierreturn(), supplierreturn));
    return supplierreturnDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<SupplierreturnDataPage>{
    const url = pageRequest.getPageRequestURL('supplierreturns/basic');
    const supplierreturnDataPage = await this.http.get<SupplierreturnDataPage>(ApiManager.getURL(url)).toPromise();
    supplierreturnDataPage.content = supplierreturnDataPage.content.map((supplierreturn) => Object.assign(new Supplierreturn(), supplierreturn));
    return supplierreturnDataPage;
  }

  async get(id: number): Promise<Supplierreturn>{
    const supplierreturn: Supplierreturn = await this.http.get<Supplierreturn>(ApiManager.getURL(`supplierreturns/${id}`)).toPromise();
    return Object.assign(new Supplierreturn(), supplierreturn);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`supplierreturns/${id}`)).toPromise();
  }

  async add(supplierreturn: Supplierreturn): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`supplierreturns`), supplierreturn).toPromise();
  }

  async update(id: number, supplierreturn: Supplierreturn): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`supplierreturns/${id}`), supplierreturn).toPromise();
  }

}
