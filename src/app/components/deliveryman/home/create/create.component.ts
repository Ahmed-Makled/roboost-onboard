import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem, SelectItemCode } from 'src/app/model/shared/select-view-model';
import { Patterns } from 'src/app/pattern/patterns';
import { ListService } from 'src/app/service/list.service';
import { SharedService } from 'src/app/service/shared.service';
import { DeliverymanService } from '../deliveryman.service';
import { DeliverymanCreateViewModel } from '../view-models/deliveryman-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage()

  item: DeliverymanCreateViewModel = new DeliverymanCreateViewModel()
  createContactPerson: FormGroup
  branchList: SelectItem[] = [];
  serviceList:SelectItem[]=[]


  constructor(
    private _sharedService: SharedService,
    private _deliverymanService: DeliverymanService,
    private _router : Router,
    private _listService: ListService) { }

  ngOnInit(): void {
    
    this.initializePage()
  }
  initializePage() {
    this.page.isPageLoaded = false
    forkJoin([
      this._listService.getBranchList(),
      this._listService.getServiceList(),
    ]).subscribe((res) => {
      this.branchList = res[0].Data;
      this.serviceList = res[1].Data;
      this.page.isPageLoaded = true;
    });
  
    this.createForm()

  }


  createForm() {
    this.page.form =this._sharedService.formBuilder.group({
      Name: [this.item.Name, [Validators.required, Validators.minLength(2), Validators.maxLength(100),Validators.pattern(Patterns.NoNumber)]],
      EnrollID: [this.item.EnrollID],
      Mobile: [this.item.Mobile, [Validators.required, Validators.pattern(Patterns.PhoneMobile)]],
      BranchID: [this.item.BranchID, this.isSingleStore()?[]:[Validators.required ]],
      UserName: [this.item.UserName, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      Password: [this.item.Password, [Validators.required, Validators.minLength(7), Validators.maxLength(100)]],
      Address: [this.item.Address, [Validators.minLength(2), Validators.maxLength(100)]],
      NationalID: [this.item.NationalID, [Validators.required,Validators.pattern(Patterns.NationalID)]]
    })
    this.page.isPageLoaded = true
  }
  save() {
    Object.assign(this.item, this.page.form.value)
    this.item.ServicesID= this.serviceList.filter(i => i.Selected).map(i=>i.ID)
    this._deliverymanService.postOrUpdate(this.item).subscribe((res) => {
        this._sharedService.showToastr(res)
        if(res.Success)   this._router.navigate(["/agent/profiles"])
    })
  }
  
  isControlNotValidAndTouched( form:FormGroup ,controlName: string) {
    let control = form.controls[controlName];
    return control.invalid && control.touched;
  }
  isControlValidAndDirty(form:FormGroup ,controlName: string) {
    let control = form.controls[controlName];
    return control.valid && control.dirty;
  }

  isControlNotValidAndDirty(form:FormGroup ,controlName: string) {
    let control = form.controls[controlName];
    return !control.valid && control.dirty;
  }

  isControlHasError(form:FormGroup ,controlName: string, error: string) {
    return form.controls[controlName].hasError(error);
  }

  disabledSubmit() {
    return this.page.isSaving || !this.page.form.valid;
  }

  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }

}
