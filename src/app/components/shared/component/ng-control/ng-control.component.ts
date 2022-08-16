import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ControlType } from 'src/app/enum/control-type.enum';
@Component({
  selector: 'ng-control',
  templateUrl: './ng-control.component.html',
})
export class NgControlComponent implements OnInit {
  @Input() form!: FormGroup
  @Input() control!: string
  @Input() type: ControlType = ControlType.INPUT_TEXT
  @Input() label!: string
  @Input() inputClass: string = ''
  @Input() labelClass: string = ''
  @Input() placeholder: string = ''
  @Input() bindValue: string = 'ID'
  @Input() bindLabel: string = 'Name'
  @Input() items: []
  @Input() clearable:boolean=true
  @Output() change = new EventEmitter<any>();
  controlType = ControlType
  constructor() { }
  ngOnInit(): void {
  }
  isControlNotValidAndTouched() {
    let control = this.form.controls[this.control];
    return control.invalid && control.touched;
  }
  isControlValidAndDirty() {
    let control = this.form.controls[this.control];
    return control.valid && control.dirty;
  }
  isControlNotValidAndDirty() {
    let control = this.form.controls[this.control];
    return !control.valid && control.dirty;
  }
  isControlHasError(error: string) {
    return this.form.controls[this.control].hasError(error);
  }
  isEmail(){
    return this.control=='Email';
  }
  isMobile(){
    return this.control=='Mobile';
  }
  isNationalID(){
    return this.control==='NationalID'
  }
  isNameAraibic(){
    return this.control==='NameArabic'
  }
  validator() {
    if (this.form.get(this.control).validator != null) {
      const validator = this.form.get(this.control).validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false
  }
  onChange(event) {
    return this.change.emit(event)
  }
}
