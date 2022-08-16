import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { MapLocation } from './view-models/Map.model';
declare var google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @Input() mapLocation: MapLocation = new MapLocation()

    ngOnInit(): void {
    }



    constructor() { };

}  