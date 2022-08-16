import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styles: [
  ]
})
export class ImageViewComponent implements OnInit {
  @Input() ImageURL: string
  modalRef: BsModalRef;
  @ViewChild('showImage', { static: true }) showImage: any;
  constructor(private _sharedService: SharedService) { }
  ngOnChanges() {

  }
  ngOnInit(): void {
    if (this.ImageURL) {
      this.showPostingTemplate()
    }
  }
  showPostingTemplate() {
    this.modalRef = this._sharedService.modalService.show(this.showImage,{ class: 'modal-55' });
  }
}
