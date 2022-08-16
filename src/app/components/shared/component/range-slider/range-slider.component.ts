import { Component, Input, ViewChild, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
    selector: 'custom-range',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent implements OnInit {

    @Input() min :number=0
    @Input() max :number=10
    @Input() value :number=5
    @Input() width :number=140 
    @Output() changedTripValue =new EventEmitter<number>()
    range:number=this.max-this.min
    
    ngOnInit(): void {
    }
    constructor() { };
    getPercent():number{
        return (this.value - this.min) / this.range *100
    }
    changedValue(){
        this.changedTripValue.emit(this.value)
    }
}  