import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';

@Component({
  selector: 'order-layout',
  templateUrl:'./order-layout.component.html',
})
export class OrderLayoutComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  tabs: SelectItem[] = [];

  @Input() code: string;
  @Output() hubName = new EventEmitter<string>();

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.tabs = [
      // {
      //   ID: 1,
      //   Name: 'shared.home',
      //   Url: undefined,
      // },
      // {
      //   ID: 2,
      //   Name: 'system.performance',
      //   Url: `performance`,
      // },
      // {
      //   ID: 3,
      //   Name: 'order.scheduled.scheduled',
      //   Url: `scheduled-order`,
      // },
      // {
      //   ID: 4,
      //   Name: 'order.transfer.transfer',
      //   Url: `transfer`,
      // },
      // {
      //   ID: 5,
      //   Name: 'order.preparation.order-preparation',
      //   Url: `user-preparation`,
      // },
    ];
  }

  selectTab(index: number) {
    this._router.navigate([`/task/${this.tabs[index].Url ?? ''}`]);
  }

  getCurrentTab(): string {
    return this._router.url.split('/')[2];
  }
}
