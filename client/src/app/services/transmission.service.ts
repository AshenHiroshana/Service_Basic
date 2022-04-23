import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Transmission} from '../entities/transmission';

@Injectable({
  providedIn: 'root'
})
export class Transmissionservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Transmission[]>{
    const transmissions = await this.http.get<Transmission[]>(ApiManager.getURL('transmissions')).toPromise();
    return transmissions.map((transmission) => Object.assign(new Transmission(), transmission));
  }

}
