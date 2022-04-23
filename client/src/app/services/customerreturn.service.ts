import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Customerreturn, CustomerreturnDataPage} from '../entities/customerreturn';

@Injectable({
  providedIn: 'root'
})
export class CustomerreturnService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CustomerreturnDataPage>{
    const url = pageRequest.getPageRequestURL('customerreturns');
    const customerreturnDataPage = await this.http.get<CustomerreturnDataPage>(ApiManager.getURL(url)).toPromise();
    customerreturnDataPage.content = customerreturnDataPage.content.map((customerreturn) => Object.assign(new Customerreturn(), customerreturn));
    return customerreturnDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CustomerreturnDataPage>{
    const url = pageRequest.getPageRequestURL('customerreturns/basic');
    const customerreturnDataPage = await this.http.get<CustomerreturnDataPage>(ApiManager.getURL(url)).toPromise();
    customerreturnDataPage.content = customerreturnDataPage.content.map((customerreturn) => Object.assign(new Customerreturn(), customerreturn));
    return customerreturnDataPage;
  }

  async get(id: number): Promise<Customerreturn>{
    const customerreturn: Customerreturn = await this.http.get<Customerreturn>(ApiManager.getURL(`customerreturns/${id}`)).toPromise();
    return Object.assign(new Customerreturn(), customerreturn);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`customerreturns/${id}`)).toPromise();
  }

  async add(customerreturn: Customerreturn): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`customerreturns`), customerreturn).toPromise();
  }

  async update(id: number, customerreturn: Customerreturn): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`customerreturns/${id}`), customerreturn).toPromise();
  }

}
