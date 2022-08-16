import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(private apiService: ApiService) { }

  get(code) {
    return this.apiService.get(`/Order/GetOrderInvoice?code=${code}`);
  }

  
}
