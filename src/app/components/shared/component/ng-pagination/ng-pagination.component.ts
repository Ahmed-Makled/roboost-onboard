import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'ng-pagination',
  templateUrl: './ng-pagination.component.html',
})
export class NgPaginationComponent implements OnInit {
  @Input() page 
  @Output() pageChange = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onChangePageSize() {
    return this.pageSizeChange.emit()
  }
  getNextPrevData(event) {
    return this.pageChange.emit(event)
  }

  
  
}
