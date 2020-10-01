import { Component, OnInit } from '@angular/core';
import { BigMacService } from '../services/bigmac.services';

@Component({
  selector: 'app-bigmac',
  templateUrl: './bigmac.component.html',
  styleUrls: ['./bigmac.component.sass']
})
export class BigMacComponent implements OnInit {

  bigMacMap = new Map();
  bigMacMapKeys = new Array();
  constructor(private bigmac: BigMacService) { }

  ngOnInit() {
    this.populateBigMacMap();
  }

  populateBigMacMap() {
      this.bigmac.getAll().subscribe(data => {

        const countryList = (<string>data).split('\n');
        countryList.forEach( country => {
          // console.log('country: ', country); success
          const countryDetails = (<string>country).split(',');

          // console.log(countryDetails[0]); success

          let countryPricesArray = countryDetails.splice(1, 6);

          // console.log('countryPricesArray: ', countryPricesArray); success

          this.bigMacMap.set(countryDetails[0], countryPricesArray);
          this.bigMacMapKeys.push(countryDetails[0]);
        });
      });
  }

}
