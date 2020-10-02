import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private localStorage: Storage;

  constructor() { 
    this.localStorage = window.localStorage;
  }

  public getStorage(key: string) {
      if (this.storageSupported()){
          const JSONparsestring = JSON.parse(this.localStorage.getItem(key));
          return JSONparsestring;
      }
      else{
          return null;
      }
  }

  public setStorage(key: string, value: any): boolean {
      if (this.storageSupported()){
          this.localStorage.setItem(key, JSON.stringify(value));
          return true;
      }
      else{
          return false;
      }    
  }

  public remove(key:string):boolean{
      if (this.storageSupported()){
          this.localStorage.removeItem(key);
          return true;
      }
      else{
          return false;
      }
  }

  public clearStorage() {
      this.localStorage.clear();
  }

  public storageSupported(): boolean{
      return !!this.localStorage
  }
}