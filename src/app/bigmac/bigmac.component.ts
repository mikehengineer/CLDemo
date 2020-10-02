import { Component, OnInit } from '@angular/core';
import { BigMacService } from '../services/bigmac.services';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../services/localstorage.services';

@Component({
  selector: 'app-bigmac',
  templateUrl: './bigmac.component.html',
  styleUrls: ['./bigmac.component.sass']
})
export class BigMacComponent implements OnInit {
  bigMacMap = new Map();
  bigMacMapKeys = new Array();
  localCountryName: string;
  inputCurrency: number;
  currencyForm: FormGroup;
  localBigMacNumber: number;
  dollarPurchasingParity: number;
  randomCountry: string;
  randomCountryBigMacNumber: number;
  randomLocalBigMacPurchase: number;
  currencyRate: number;
  cacheFlag:string = 'cacheFlag';
  cacheEmpty:string = 'cacheEmpty';
  cacheFull:string = 'cacheFull';
  cacheKeyArray:string = 'cacheArray';

  constructor(private bigMacService: BigMacService, private currencyFormBuilder: FormBuilder, private localStorageService: LocalStorageService)
  { }

  ngOnInit() {
    //this.localCountryName = 'The United States';
    const flagHolder:string = this.localStorageService.getStorage(this.cacheFlag);
    if (flagHolder != null && flagHolder === this.cacheFull){
      this.cachePopulateBigMacMap();
    }
    else {
      this.httpPopulateBigMacMap();
    }
    this.currencyBuildForm();
    this.bigMacService.getClientIP().pipe(take(1)).subscribe((res:any) => {
        this.bigMacService.getClientCountry('json', res.ip).pipe(take(1)).subscribe((res:any) => {
            this.localCountryName = res.data.country_name;
            if(this.localCountryName == 'United States'){
              this.localCountryName = this.fancyUpUSA(this.localCountryName);
            }
          });
      });
  }

  httpPopulateBigMacMap() {
      this.bigMacService.getAll().subscribe(data => {
        const countryList = (<string>data).split('\n');
        countryList.forEach( country => {
          const countryDetails = (<string>country).split(',');
          let countryPricesArray = countryDetails.splice(1, 6);
          if(countryDetails[0] == 'United States'){
            countryDetails[0] = this.fancyUpUSA(countryDetails[0]);
          }
          this.bigMacMap.set(countryDetails[0], countryPricesArray);
          this.bigMacMapKeys.push(countryDetails[0]);
          this.localStorageService.setStorage(countryDetails[0], countryPricesArray);
        });
        this.localStorageService.setStorage(this.cacheKeyArray, this.bigMacMapKeys);
      });
      this.localStorageService.setStorage(this.cacheFlag, this.cacheFull);
  }

  cachePopulateBigMacMap(){
    this.bigMacMapKeys = this.localStorageService.getStorage(this.cacheKeyArray);
    var i;
    for (i = 0; i < this.bigMacMapKeys.length; i++) {
      const bigMacCacheKey = this.bigMacMapKeys[i]
      this.bigMacMap.set(bigMacCacheKey, this.localStorageService.getStorage(bigMacCacheKey));
    }
  }

  currencyBuildForm() {
    this.currencyForm = this.currencyFormBuilder.group({
    currency: ['', [Validators.required]]
    });
  }

  addCurrency(){
    this.inputCurrency = this.currencyForm.value.currency;
    this.localBigMacNumber = this.bigMacLocalPurchaseCalculator(this.localCountryName);
    this.dollarPurchaseParityLookUp(this.localCountryName);
    this.getRandomCountry();
  }

  bigMacLocalPurchaseCalculator(country){
    const countryPurchaseArray = this.bigMacMap.get(country);
    return (this.inputCurrency / countryPurchaseArray[1]);
  }

  dollarPurchaseParityLookUp(country){
    const countryParityArray = this.bigMacMap.get(country);
    this.dollarPurchasingParity = countryParityArray[4];
  }

  dollarPriceLookUp(country){
    const countryDollarPriceArray = this.bigMacMap.get(country);
    return countryDollarPriceArray[3];
  }

  getRandomCountry(){
    this.randomCountry = this.bigMacMapKeys[Math.floor(Math.random() * this.bigMacMapKeys.length)];
    const localPurchaseRatio = this.bigMacLocalPurchaseCalculator(this.localCountryName);
    const localDollarRatio = (this.dollarPriceLookUp(this.localCountryName) / this.dollarPriceLookUp(this.randomCountry));
    this.randomCountryBigMacNumber = (localPurchaseRatio * localDollarRatio);
    this.currencyRate =  (this.inputCurrency * localDollarRatio);
  }

  cacheCSV(key: string, value: any){
    this.localStorageService.setStorage(key, value);
  }

  getCachedCSV(key: string): any{
    return this.localStorageService.getStorage(key);
  }

  fancyUpUSA(america){
    let prefixUSA = 'The ';
    return prefixUSA + america;
  }

  clearCachedCSV(){
    this.localStorageService.clearStorage();
    this.localStorageService.setStorage(this.cacheFlag, this.cacheEmpty);
  }

  ngOnDestroy() {
  }
}
