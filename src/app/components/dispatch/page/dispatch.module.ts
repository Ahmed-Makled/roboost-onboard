import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FastTaskComponent } from './partial/fast-task/fast-task.component';




export const routes: Routes = [
  {path:'',component:IndexComponent},
]

@NgModule({
  declarations: [ IndexComponent,FastTaskComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})

export class DispatchModule { }
