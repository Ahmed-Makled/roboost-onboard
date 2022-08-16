import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApplicationRole } from 'src/app/enum/application-role';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem, SelectItemCode } from 'src/app/model/shared/select-view-model';
import { Patterns } from 'src/app/pattern/patterns';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { UsersService } from '../user-home.service';
import { UserCreateViewModel } from '../view-models/user-home-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  model: UserCreateViewModel = new UserCreateViewModel();
  roles: SelectItemCode[] = [];
  storeList: SelectItem[] = [];
  showStores: boolean = false

  constructor(
    private _sharedService: SharedService,
    private _userService: UsersService,
    private _listService: ListService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
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
    forkJoin([
      this._listService.getUserRolesList(),
      this._listService.getBranchList()])
      .subscribe((res) => {
        this.roles = res[0].Data;
        this.storeList = res[1].Data;
      });
    if (this.page.isEdit) {
      // this.getEditableItem();
    } else {
      this.createForm();
    }
  }
  // getEditableItem() {
  //   this._userService.getByCode(this.model.Code).subscribe((res) => {
  //     if (res.Success) {
  //       this.model = res.Data;
  //       this.model.StoreList.forEach((element) => {
  //         this.stores.find(i=>i.ID == element).Selected = true
  //       });
  //       this.createForm();
  //     }
  //   });
  // }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      Name: [this.model.Name, [Validators.required]],
      UserName: [this.model.UserName, [Validators.required]],
      Mobile: [this.model.Mobile, [Validators.required, Validators.pattern(Patterns.PhoneMobile)]],
      Email: [this.model.Email, [Validators.pattern(Patterns.Email)]],
      Password: [this.model.Password, this.page.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      RoleID: [this.model.RoleID, [Validators.required]],
    });
    // if(!this.page.isEdit){
    //   this.page.form.controls["Password"].setValidators([Validators.required]);
    // }
    this.page.isPageLoaded = true;
  }

  onRoleChange() {
    this.storeList.forEach(element => {
      element.Selected = false
    });
  }

  selectStore(item: SelectItem) {
    if (this.singleSelectStore()) {
      this.storeList.forEach(element => {
        element.Selected = false
      });
      item.Selected = true
    }
    else item.Selected = !item.Selected
  }
  multiSelectStore(): boolean {
    return this.role.value == ApplicationRole.SUBERVISOR || this.role.value == ApplicationRole.AREA_MANAGER || this.role.value == ApplicationRole.DISPATCHER
  }
  singleSelectStore(): boolean {
    return this.role.value == ApplicationRole.BRANCH_MANAGER || this.role.value == ApplicationRole.OPERATOR
  }
  get role() {
    return this.page.form.get('RoleID')
  }
  save() {
    this.page.isSaving = true
    Object.assign(this.model, this.page.form.value)
    this.getStoreSelected()

    this._userService.createUser(this.model).subscribe(res => {
      this._sharedService.showToastr(res)
      this.page.isSaving = false
      if (res.Success) this._router.navigate(['/user/home'])
    }, (err) => { this.page.isSaving = false })
  }

  getStoreSelected() {
    if (this.multiSelectStore()) {
      this.model.BranchesID = this.storeList.filter(i => i.Selected).map(x => x.ID)
    }
    else if (this.singleSelectStore()) {
      this.model.BranchesID.push(this.storeList.find(i => i.Selected).ID);
    }
  }

  isControlNotValidAndTouched(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return control.invalid && control.touched;
  }
  isControlValidAndDirty(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return control.valid && control.dirty;
  }
  isControlNotValidAndDirty(form: FormGroup, controlName: string) {
    let control = form.controls[controlName];
    return !control.valid && control.dirty;
  }
  isControlHasError(form: FormGroup, controlName: string, error: string) {
    return form.controls[controlName].hasError(error);
  }
  disabledSubmit() {
    return this.page.isSaving || !this.page.form.valid;
  }

  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }

}
