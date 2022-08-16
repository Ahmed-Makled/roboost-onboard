import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchAreaCreateViewModel } from '../view-models/branch-area-create.model';
import { BranchAreaService } from '../branch-area.service';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
@Component({
  selector: 'app-index',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  modalRef: BsModalRef;
  storeList: SelectItem[] = [];
  model: BranchAreaCreateViewModel = new BranchAreaCreateViewModel()
  @ViewChild('branchesTemplate', { static: false }) branchesTemplate: any;
  constructor(
    public _sharedService: SharedService,
    private _listService: ListService,
    private _activatedRoute: ActivatedRoute,
    private _areaService: BranchAreaService,
    private _router: Router
  ) { }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.model.ID = +params.get('id');
        this.page.isEdit = true;
      } else {
        this.model.ID = 0
      }
    });
    this._listService.getBranchList().subscribe((res) => {
      this.storeList = res.Data;
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    });
  }
  getEditableItem() {
    this._areaService.getbyID(this.model.ID).subscribe((res) => {
      if (res.Success) {
        this.model = res.Data;
        this.model.BranchesID.forEach((element) => {
          let foundStore = this.storeList.find(i => i.ID == element)
          if (foundStore) foundStore.Selected = true
        });
        this.createForm();
      }
    });
  }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      Name: [this.model.Name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    })
    this.page.isPageLoaded = true;
  }
  save() {
    this.page.isSaving = true;
    Object.assign(this.model, this.page.form.value);
    this.getStoreSelected()
    this._areaService.postOrUpdate(this.model).subscribe(res => {
      if (res.Success) {
        this._sharedService.showToastr(res);
        this.page.isSaving = false;
        this._router.navigate(['store/area'])
      }
    }, () => { this.page.isSaving = false; })
  }
  saveData() {
    this.model.BranchesID = this.storeList.filter(i => i.Selected == true).map(x => x.ID)
  }
  selectStore(item: SelectItem) {
    return item.Selected = !item.Selected
  }
  getStoreSelected() {
    this.model.BranchesID = this.storeList.filter(i => i.Selected).map(x => x.ID)
  }
  disabledSubmit() {
    return this.page.isSaving || !this.page.form.valid
  }
}
