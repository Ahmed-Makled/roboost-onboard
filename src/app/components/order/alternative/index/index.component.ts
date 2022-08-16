import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlternativeOrderViewModel } from '../view-models/alternative-order.model';
import { AlternativeOrderService } from '../alternative-order.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  lat;
  lng;
  zoom = 15;
  previous;
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  onMapClick($event: MouseEvent) {
  }
  modalRef: BsModalRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _alternativeOrderService: AlternativeOrderService,
  ) { }
  page: CRUDIndexPage = new CRUDIndexPage();
  items: AlternativeOrderViewModel[] = [];
  firsIitem: AlternativeOrderViewModel = new AlternativeOrderViewModel();
  showMap: boolean = true;
  branch: any
  ngOnInit(): void {
    if (!environment.production) { this.showMap = false }
    this.initializePage()
    window.scrollTo(0, 0)
  }
  initializePage() {
    this.page.isPageLoaded = false;
    var id;
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })
    this._alternativeOrderService.get(id).subscribe(res => {
      this.page.isPageLoaded = true;
      this.items = res[0].Data;
      this.firsIitem = this.items[0]
      this.page.isPageLoaded = true;
      this.page.isLoading = true;
    });
  }
}
