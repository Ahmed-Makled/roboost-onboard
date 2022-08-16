import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { VendorsReceiptSearchViewModel } from './view-model/tax-bill-search.model';

@Injectable({
  providedIn: 'root'
})
export class TaxBillService {
  controller: string = "/task";
  constructor(private _apiService: ApiService) { }
  getByCode(Code:string,searchViewModel?: VendorsReceiptSearchViewModel) {
    
    let params = new HttpParams();
    if(searchViewModel.fromDate)
    {
      params=params.set("fromDate",searchViewModel.fromDate.toString());
    }
    if(searchViewModel.toDate)
    {
      params=params.set("toDate",searchViewModel.toDate.toString());
    }
      return this._apiService.get(`${this.controller}/GetStoresReceipt?VendorCode=${Code}`, params);
    }
}
