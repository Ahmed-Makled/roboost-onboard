import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem, SelectItemCode } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { WalletTransactionCreateViewModel } from '../view-models/wallet-details-create.model';
import { WalletTransactionService } from '../wallet-details.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  model: WalletTransactionCreateViewModel = new WalletTransactionCreateViewModel();
  deliverymanList: SelectItem[] = [];
  typeList: SelectItem[] = [];

  trips: SelectItem[] = [];
  constructor(
    private _sharedService: SharedService,
    private _pageService: WalletTransactionService,
    private _listService: ListService,

  ) { }

  ngOnInit(): void {
    this.initializePage();
  }
  initializePage() {

      forkJoin([
        this._listService.getDeliverymanList(),
        this._pageService.getStatusList(),
      ]).subscribe(res => {
        this.deliverymanList = res[0].Data;
        this.typeList = res[1].Data;
        this.createForm();
        this.page.isPageLoaded = true;
      });


}

createForm() {
  this.page.form = this._sharedService.formBuilder.group({
    Amount: [this.model.Amount, [Validators.required, Validators.min(0)]],
    DeliverymanID: [this.model.DeliverymanID, [Validators.required]],
    IsAward: [this.model.IsAward],
    Note: [this.model.Note],
    TripNumber: [this.model.TripNumber, [Validators.required]],
    Type: [this.model.Type, [Validators.required]]
  })
}

save() {
  this.page.isSaving = true;
  Object.assign(this.model, this.page.form.value);

  this._pageService.postOrUpdate(this.model).subscribe(response => {
    this.page.isSaving = false;
    this.page.responseViewModel = response;
    this._sharedService.showToastr(response);
    if (response.Success) {
      if (this.model.ID == 0) {
        this.createForm();
      }
    }
  }, error => {
    this._sharedService.showErrorAlert(error);
    this.page.isSaving = false;
  }, () => { this.page.isSaving = false; });
}

disabledSubmit() {
  return this.page.isSaving || !this.page.form.valid;
}

featureEnum = FeatureEnum
hasFeature(value: FeatureEnum) {
  return SharedService.featureList.some(i => i == value)
}
}
