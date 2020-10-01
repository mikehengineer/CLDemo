import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BigMacService {
  private headers: HttpHeaders;
  private bigmacIndex = 'https://raw.githubusercontent.com/zelima/big-mac-index/master/data/big-mac-index.csv';

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  }

  public getAll() {
    return this.http.get(this.bigmacIndex, {responseType: 'text'});
  }
}