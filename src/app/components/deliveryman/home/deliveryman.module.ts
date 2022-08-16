import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { SharedModule } from '../../shared/shared.module';
import { AgentActionService } from '../../../service/agent/agent.action';


export const routes: Routes = [
  { path: '', redirectTo: "profiles", pathMatch: "full" },
  { path: 'profiles', component: IndexComponent },
  {path: 'profiles/create', component: CreateComponent},
];

@NgModule({
  declarations: [
    IndexComponent, CreateComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), SharedModule,
  ],
})
export class DeliverymanModule { }
