import { Component, OnInit, ViewChild} from '@angular/core';
import { forkJoin } from 'rxjs';
import { GenerateQRCodeViewModel } from '../view-models/qr-code.model';
import { GenerateQRCodeService } from '../qr-code.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { ResponseViewModel } from 'src/app/model/shared/response.model';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  // styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  modalRef: BsModalRef;
  page: CRUDIndexPage = new CRUDIndexPage();
  item:GenerateQRCodeViewModel = new GenerateQRCodeViewModel();
  id:number
  constructor(
    private qrCodeService:GenerateQRCodeService,
    private activatedRoute : ActivatedRoute
  ) {
  }
  url:string;
  ngOnInit() {
    this.initializePage();
  }

  initializePage(){
    this.page.isPageLoaded =false

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
    })
    forkJoin([
      this.qrCodeService.get(this.id)
    ]).subscribe(res=>{
      this.item = res[0].Data
      this.item.Date = new Date().toDateString()
      this.page.isPageLoaded =true
    });
    var fullUrl = window.location.href.split('/')
    this.url = `${fullUrl[0]}//${fullUrl[2]}`
  }
  
  printPage() {
    window.print();

  //   var printContent = document.getElementById('print-qr-code').innerHTML
    
  //   var oldWindow = window
  //   document.body.innerHTML = 
  //   `<div  class="print-qr-code text-center pt-3 px-3" style="height:100vh;">
  //     <div class="d-flex align-items-center justify-content-between ">
  //         <p class="font-30">  ${this.item.BranchName} </p>
  //         <p class="font-30 ">${this.item.Date}</p>
  //     </div>
  //   <div class=" row mt-3 g-3">
  //    <div class=""col-12">
  //     <div class=" d-flex align-items-center justify-content-center  ">
  //         <p class="mx-3">Deliver</p>
  //         <p class="mx-3">Faster</p>
  //         <p class="mx-3">Smarter</p>
  //     </div>
  //    </div>
  //    <div class=""col-12">
  //    ${printContent}
  //    </div>
  //   c

  //    <div class=""col-12">
  //     <img class="me-2 mt-n15px" style="width: 40px;height: 40px;" src="https://api.tayar.app/uploads/icons/logo-favicon-32.png">
  //     <p class=" c-red d-inline-block font-45 ">Powered By TAYAR</p>
  //    </div>
  //   </div>
  // </div>
    // `;
  //   setTimeout(() => {
  //   oldWindow.print();
  //   window.location.reload();
  // }, 200);
  }

  

 
}