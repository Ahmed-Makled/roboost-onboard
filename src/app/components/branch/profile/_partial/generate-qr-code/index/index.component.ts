import { Component, OnInit, ViewChild} from '@angular/core';
import { forkJoin } from 'rxjs';
import { GenerateQRCodeViewModel } from '../view-models/qr-code.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BranchProfileService } from '../../../branch-profile.service';
import { ActivatedRoute } from '@angular/router';
import { KpiViewModel } from '../../../view-models/kpi.model';
import { SharedService } from 'src/app/service/shared.service';
import { ResponseViewModel } from 'src/app/model/shared/response.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';


@Component({
  selector: 'qr-code',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class QRCodeComponent implements OnInit {
  modalRef: BsModalRef;
  page: CRUDIndexPage = new CRUDIndexPage();
  item:GenerateQRCodeViewModel = new GenerateQRCodeViewModel();
  kpi :KpiViewModel = new KpiViewModel()
  id:number
  @ViewChild('qrCodeTemplate', { static: false }) qrCodeTemplate: any;
  constructor(
    private branchProfileService:BranchProfileService,
    private _sharedService: SharedService,
    private activatedRoute:ActivatedRoute
  ) {
  }
  url:string;

  ngOnInit() {
    this.initializePage();
  }

  initializePage(){
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      forkJoin([
        this.branchProfileService.getQrCode(this.id),
        this.branchProfileService.getKPI(this.id)
      ]).subscribe((res:any)=>{
        this.item = res[0].Data
        this.item.Date = new Date().toDateString()
        this.kpi = res[1].Data ?? new KpiViewModel()
      });
      var fullUrl = window.location.href.split('/')
      this.url = `${fullUrl[0]}//${fullUrl[2]}`
    })
    
  }
  showQrCodeTemplate(){
    this.modalRef = this._sharedService.modalService.show(this.qrCodeTemplate, { class: 'modal-sm' });
  }
  updateService(){
    this.branchProfileService.updateQRCode(this.id).subscribe((ress:ResponseViewModel)=>{
      if(ress.Success){
        this.branchProfileService.getQrCode(this.id).subscribe((res)=>{
          this._sharedService.showToastr(res)
          this.item = res.Data
          this.item.Date = new Date().toDateString()
        })
      }
    })
  }

  printPage() {
    var printContent = document.getElementById('print-qr-code').innerHTML
    // var originalContent = document.body.innerHTML;
    var oldWindow = window

    document.body.innerHTML = 
    `<div  class="print-qr-code text-center pt-3 px-3" style="height:100vh;">
      <div class="text-start ">
          <p class=" c-0b d-inline-block font-30">${this.item.BranchName} Pharmacy</p>
          <p class=" c-0b d-inline-block pull-right font-30 ">${this.item.Date}</p>
      </div>
      
      <div class="c-0b mt-3 font-30 ">
          <span class="mx-3">Deliver</span>
          <span class="mx-3">Faster</span>
          <span class="mx-3">Smarter</span>
      </div>
      ${printContent}

      <p  class="c-a3 mb-3 font-30">Scan QR to complete your trip</p>
      <img class="mr-2 mt-n15px" style="width: 40px;height: 40px;" src="https://api.tayar.app/uploads/icons/logo-favicon-32.png">
      <p class=" c-red d-inline-block font-45 mt-100 mb-75">Powered By TAYAR</p>
    </div>`;
    // document.body.innerHTML = originalContent
    setTimeout(() => {
    oldWindow.print();
    window.location.reload();
  }, 200);
  }

  

 
}