import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Validators } from '@angular/forms';
import { TripBranchConfigurationViewModel } from '../view-models/trip-branch-configuration.model';
import { BranchProfileService } from '../../../branch-profile.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { Patterns } from 'src/app/pattern/patterns';



@Component({
  selector: 'trip-confg',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class TripConfigurationComponent implements OnInit {
  
  
  modalRef: BsModalRef;

  constructor(
    private _orderBranchConfiguratioService: BranchProfileService,
    public _sharedService: SharedService,
    private activatedRoute: ActivatedRoute
  ) { }
  page:CRUDCreatePage=new CRUDCreatePage();
  model: TripBranchConfigurationViewModel = new TripBranchConfigurationViewModel();

  ngOnInit() {
    this.createForm()

    // this.initializePage();
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })
    this._orderBranchConfiguratioService.getLastTripConfiguration(id).subscribe(res=>{
      if(res.Success)
      {
       this.model = res.Data
       this.createForm()
      }
    })
 
 
   }
  createForm() {
    
    this.page.form = this._sharedService.formBuilder.group({
      ID: [this.model.ID, [Validators.required]],
      MaxDistanceBetweenOrders: [this.model.MaxDistanceBetweenOrders, [Validators.required, Validators.pattern(Patterns.FLOATINGNUMBER)]],
      MaxOrders: [this.model.MaxOrders, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER)  ]],
      MaxOrdersWithoutLocation: [this.model.MaxOrdersWithoutLocation, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER)]],
      MaxServices: [this.model.MaxServices, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER) ]],
      AutoStartTrip: [this.model.AutoStartTrip, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER)]],
      ExcelantTimePercentage: [this.model.ExcelantTimePercentage, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER) ]],
      ExcelantTripRevenue: [this.model.ExcelantTripRevenue, [Validators.required, Validators.pattern(Patterns.FLOATINGNUMBER)]],
      GoodTimePercentage: [this.model.GoodTimePercentage, [Validators.required ,Validators.pattern(Patterns.FLOATINGNUMBER)]],
      GoodTripRevenue: [this.model.GoodTripRevenue, [Validators.required,Validators.pattern(Patterns.FLOATINGNUMBER) ]],
      LateTimePercentage: [this.model.LateTimePercentage, [Validators.required, Validators.pattern(Patterns.FLOATINGNUMBER)]],
      LateTripRevenue: [this.model.LateTripRevenue, [Validators.required]],
      TooLateTripRevenue: [this.model.TooLateTripRevenue, [Validators.required]],
     })
    this.page.isPageLoaded= true;
  }

  
  
 
  
 
   isControlNotValidAndTouched(controlName:string)
   {
     let control=this.page.form.controls[controlName];
     return control.invalid && control.touched;
   }
   
   isControlValidAndDirty(controlName:string)
   {
     let control=this.page.form.controls[controlName];
     return control.valid && control.dirty;
   }
   
   isControlNotValidAndDirty(controlName:string)
   {
     let control=this.page.form.controls[controlName];
     return !control.valid && control.dirty;
   }
   
   isControlHasError(controlName:string, error:string)
   {
     return this.page.form.controls[controlName].hasError(error);
   }
   disabledSubmit() {
     return this.page.isSaving || this.page.isUploading || !this.page.form.valid;
   }
   save() {
     //alert("save");
     this.page.isSaving = true;
     Object.assign(this.model, this.page.form.value);
     this._orderBranchConfiguratioService.updateTripConfiguration(this.model).subscribe(response => {
     this.page.isSaving = false;
       this.page.responseViewModel = response;
       this._sharedService.showToastr(response);
       //alert(this.page.responseViewModel.Message);
       if (response.Success) {
        
     }})
   }
 
   get controls() {
     return this.page.form.controls;
   } 
 

  

  
  }

