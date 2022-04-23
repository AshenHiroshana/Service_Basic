import {Injectable} from '@angular/core';
import {Saletype} from '../entities/saletype';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class SaletypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Saletype[]>{
    const saletypes = await this.http.get<Saletype[]>(ApiManager.getURL('saletypes')).toPromise();
    return saletypes.map((saletype) => Object.assign(new Saletype(), saletype));
  }

}
