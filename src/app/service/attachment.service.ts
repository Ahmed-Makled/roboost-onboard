import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable( {
  providedIn: 'root'
} )
export class AttachmentService {

  constructor( private _apiService: ApiService ) { }
  upload( object: any ) {
    return this._apiService.post( '/Upload/Upload', object,true );
  }
}
