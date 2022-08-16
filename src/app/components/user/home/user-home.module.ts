import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateComponent } from './create/create.component';

export const routes: Routes = [
  { path: 'home', component: IndexComponent },
  {path: 'home/create', component: CreateComponent},
]

@NgModule({
  declarations: [IndexComponent,CreateComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule
  ]
})
export class UserHomeModule { }
