import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { TaxBillService } from './tax-bill.service';
import { VendorsReceiptSearchViewModel } from './view-model/tax-bill-search.model';
import { TaxBillViewModel } from './view-model/tax-bill.model';
// import { SelectItem } from 'src/app/model/shared/select-view-model';

@Component({
  selector: 'app-tax-bill',
  templateUrl: './tax-bill.component.html',
  styleUrls: ['./tax-bill.component.css']
})
export class TaxBillComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: TaxBillViewModel = new TaxBillViewModel()
  selectItem: VendorsReceiptSearchViewModel = new VendorsReceiptSearchViewModel()
  @Input() fromDate: any
  @Input() toDate: any
  @Input() kmOrTask: boolean
  @Input() vendorCode: string
  @Input() duoDate: any
  @Input() billNo:number
  constructor(private _taxBillService: TaxBillService,
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initializePage()
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.selectItem.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    this.selectItem.toDate = moment(this.toDate).format('YYYY-MM-DD');
    this.duoDate = moment(this.duoDate).format('YYYY-MM-DD');
    this._taxBillService.getByCode(this.vendorCode, this.selectItem).subscribe((res) => {
      this.item = res.Data
    })
  }
 
  
}
