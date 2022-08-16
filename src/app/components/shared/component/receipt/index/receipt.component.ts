import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { ReceiptService } from '../receipt.service';
import { ReceiptViewModel } from '../view-models/receipt.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  footer: string;
  item: ReceiptViewModel = new ReceiptViewModel()
  code: string
  itemTotal: number
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private receiptService: ReceiptService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.activatedRoute.params.subscribe(params => {
      this.code = params['code']
      this.initializePage()
    })


  }
  initializePage() {
    this.receiptService.get(this.code).subscribe(res => {
      this.page.isLoading = true
      this.item = res.Data
      console.log(res.Data);
      
      this.footer = this.item.Footer
      setTimeout(() => {
        if (this.router.url.includes('/print-receipt')) {
          this.printPage();
        }
      }, 200);
    })
  }

  printPage() {
    window.print();
  }

}
