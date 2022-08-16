import { Component, OnInit } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';

@Component({
  selector: 'app-index',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {

  constructor(
  ) { }
  page: CRUDIndexPage = new CRUDIndexPage();
  phoneSearch:any=''
  ngOnInit(): void {
  }
}
