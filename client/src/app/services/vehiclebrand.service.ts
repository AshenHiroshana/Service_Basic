import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Vehiclebrand} from '../entities/vehiclebrand';

@Injectable({
  providedIn: 'root'
})
export class Vehiclebrandservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Vehiclebrand[]>{
    const vehiclebrands = await this.http.get<Vehiclebrand[]>(ApiManager.getURL('vehiclebrands')).toPromise();
    return vehiclebrands.map((vehiclebrand) => Object.assign(new Vehiclebrand(), vehiclebrand));
  }

}
