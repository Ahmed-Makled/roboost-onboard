import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { CustomerProfileViewModel } from '../view-models/customer-profile.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']

})
export class IndexComponent implements OnInit {

  sideActive: any[] = [{ isActive: true }, { isActive: false }, { isActive: false },
  { isActive: false }, { isActive: false }]

  IsSearchClicked:boolean=false;

  constructor(  ) { }
  page: CRUDIndexPage = new CRUDIndexPage();
  item: CustomerProfileViewModel;
  phoneSearch: string;
  phone:string
  ngOnInit(): void {
  }

  
  // onSearchClicked() {
  //   if(this.IsSearchClicked){
  //     this.phoneSearch = this.phone
  //     this.phone = null
  //   }
  //   this.IsSearchClicked = !this.IsSearchClicked
  // }
  // activeSide(index,el) {
  //   this.sideActive.forEach(element => {
  //     element.isActive = false
  //   });
  //   this.sideActive[index].isActive = true;
  //   document.getElementById(el).scrollIntoView({ behavior: "smooth" })
  // }
}
