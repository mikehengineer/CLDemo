import { Component, OnInit } from '@angular/core';
import { BigMacService } from '../services/bigmac.services';
import { concatMap, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private bigMacService: BigMacService, private currencyFormBuilder: FormBuilder) { }

  ngOnInit() {
    this.currencyBuildForm();
    this.populateBigMacMap();
    this.bigMacService.getClientIP().pipe(take(1)).subscribe((res:any) => {
        this.bigMacService.getClientCountry('json', res.ip).pipe(take(1)).subscribe((res:any) => {
            this.localCountryName = res.data.country_name;
            if(this.localCountryName == 'United States'){
              this.localCountryName = this.fancyUpUSA(this.localCountryName);
            }
          });
      });
  }

  populateBigMacMap() {
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
        });
      });
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
    const localPurchaseRatio = this.bigMacLocalPurchaseCalculator(this.randomCountry);
    const localDollarRatio = (this.dollarPriceLookUp(this.localCountryName) / this.dollarPriceLookUp(this.randomCountry));
    this.randomCountryBigMacNumber = (localPurchaseRatio * localDollarRatio);
    this.currencyRate =  (this.inputCurrency / localDollarRatio);
  }

  fancyUpUSA(america){
    let prefixUSA = 'The ';
    return prefixUSA + america;
  }
}
