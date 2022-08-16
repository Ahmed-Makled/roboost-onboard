import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ControlType } from 'src/app/enum/control-type.enum';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { Patterns } from 'src/app/pattern/patterns';
import { SharedService } from 'src/app/service/shared.service';
import { BranchHomeService } from '../branch-home.service';
import { BranchHomeCreateViewModel } from '../view-models/branch-home-create.model';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  model: BranchHomeCreateViewModel = new BranchHomeCreateViewModel();
  ControlType = ControlType
  constructor(
    private _sharedService: SharedService,
    private _pageService: BranchHomeService,
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
      NameEnglish: [this.model.NameEnglish, [Validators.required, Validators.minLength(6)]],
      NameArabic: [this.model.NameArabic, [Validators.required, Validators.minLength(6),Validators.pattern(Patterns.OnlyArabicLetters)]],
      Address: [this.model.Address, [Validators.required]],
      APIKey: [this.model.APIKey,]
    });
    this.page.isPageLoaded = true;
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
        this._sharedService.router.navigate(['/store/home'])
      }
    }, ((err) => { this.page.isSaving = false; }))
  }
  disabledSubmit() {
    return this.page.isSaving || this.page.form.invalid;
  }
  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
}
