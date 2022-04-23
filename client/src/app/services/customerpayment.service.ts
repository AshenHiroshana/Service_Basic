import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Customerpayment, CustomerpaymentDataPage} from '../entities/customerpayment';

@Injectable({
  providedIn: 'root'
})
export class CustomerpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<CustomerpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('customerpayments');
    const customerpaymentDataPage = await this.http.get<CustomerpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    customerpaymentDataPage.content = customerpaymentDataPage.content.map((customerpayment) => Object.assign(new Customerpayment(), customerpayment));
    return customerpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<CustomerpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('customerpayments/basic');
    const customerpaymentDataPage = await this.http.get<CustomerpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    customerpaymentDataPage.content = customerpaymentDataPage.content.map((customerpayment) => Object.assign(new Customerpayment(), customerpayment));
    return customerpaymentDataPage;
  }

  async get(id: number): Promise<Customerpayment>{
    const customerpayment: Customerpayment = await this.http.get<Customerpayment>(ApiManager.getURL(`customerpayments/${id}`)).toPromise();
    return Object.assign(new Customerpayment(), customerpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`customerpayments/${id}`)).toPromise();
  }

  async add(customerpayment: Customerpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`customerpayments`), customerpayment).toPromise();
  }

  async update(id: number, customerpayment: Customerpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`customerpayments/${id}`), customerpayment).toPromise();
  }

}
