import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BigMacService {
  private headers: HttpHeaders;

  private bigMacIndex = 'https://raw.githubusercontent.com/zelima/big-mac-index/master/data/big-mac-index.csv';

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public getAll() {
    return this.http.get(this.bigMacIndex, {responseType: 'text'});
  }

  public getClientIP() {
    return this.http.get('https://api.ipify.org/?format=json');
  }

  public getClientCountry(responseType: string, IP: string) {
    return this.http.get(`https://cors-anywhere.herokuapp.com/https://ipvigilante.com/${responseType}/${IP}`);
  }
}