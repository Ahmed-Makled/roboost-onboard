export class Marker {
    lat: number;
    lng: number;
}

export class MapLocation {
    lat: number;
    lng: number;
    zoom: number;
    markers?: Marker[]=[];
}