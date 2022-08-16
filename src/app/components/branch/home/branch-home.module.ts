import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';


export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'create', component: CreateComponent},
  {path: 'edit/:id', component: CreateComponent},
]


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes), SharedModule
  ]
})
export class BranchHomeModule { }
