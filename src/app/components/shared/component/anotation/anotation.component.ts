import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'anotation',
    templateUrl: './anotation.component.html',
    styleUrls: ['./anotation.component.css']
})
export class AnotationComponent implements OnInit {
    @Input() ID:string="popover"
    @Input() isSpan:boolean=false
    @Input() spanText:string=""
    @Input() title :string
    @Input() content :string
    @Input() place :string ="top"
    @Input() dissmiss :boolean =true

    constructor() { };

    ngOnInit(): void {
        
    }

}  