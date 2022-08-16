import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {

    @Input() size :number=12
    @Input() rate :number=0
    @Input() startsNumber :number=5
    @Input() starsClass :string=""
    @Input() lableClass :string=""
    @Input() showNumber :boolean=false



    ngOnInit(): void {
    }
    constructor() { };

}  