import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SharedService } from 'src/app/service/shared.service';
import { PagesService } from '../page.service';
import { PageCreateViewModel } from '../view-models/page-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  model: PageCreateViewModel = new PageCreateViewModel();
  constructor(
    private _sharedService: SharedService,
    private _pageService: PagesService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.model.ID = +params.get('id');
        this.page.isEdit = true;
      }
    });
    this._activatedRoute.queryParams.subscribe((params) => {
      this.model.ParentPageID = params['parentID'] ? +params['parentID'] : null
    });
    if (this.page.isEdit) {
      this.getByID();
    } else {
      this.createForm();
    }
  }
  getByID() {
    this._pageService.getbyID(this.model.ID).subscribe((res) => {
      if (res.Success) {
        this.model = res.Data;
        this.createForm();
      }
    });
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      ID: [this.model.ID],
      ParentPageID: [this.model.ParentPageID],
      NameEnglish: [this.model.NameEnglish, [Validators.required]],
      NameArabic: [this.model.NameArabic, [Validators.required]],
      DisplayOrder: [this.model.DisplayOrder, [Validators.required]],
      Url: [this.model.Url, [Validators.required]],
      Icon: [this.model.Icon, [Validators.required]],
      ShowInMenu: [this.model.ShowInMenu, [Validators.required]],
      IsActive: [this.model.IsActive, [Validators.required]],
    });
    this.page.isPageLoaded = true;
  }
  save() {
    this.page.isSaving = true;
    Object.assign(this.model, this.page.form.value);
    this._pageService.postOrUpdate(this.model, this.page.isEdit).subscribe(response => {
      this.page.isSaving = false;
      this.page.responseViewModel = response;
      this._sharedService.showToastr(response);
      if (response.Success) {
        if (this.model.ID == 0) {
          this.createForm();
        }
      }
    }, ((err) => { this.page.isSaving = false; }))
  }

  isControlNotValidAndTouched(controlName: string) {
    let control = this.page.form.controls[controlName];
    return control.invalid && control.touched;
  }

  isControlValidAndDirty(controlName: string) {
    let control = this.page.form.controls[controlName];
    return control.valid && control.dirty;
  }

  isControlNotValidAndDirty(controlName: string) {
    let control = this.page.form.controls[controlName];
    return !control.valid && control.dirty;
  }

  isControlHasError(controlName: string, error: string) {
    return this.page.form.controls[controlName].hasError(error);
  }
  disabledSubmit() {
    return this.page.isSaving || !this.page.form.valid;
  }


}
