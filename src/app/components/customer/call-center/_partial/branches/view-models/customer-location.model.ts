import { BranchViewModel } from './branch-location.model';

export class CustomerLocationViewModel {
    CustomerID: number;
    Latitude: number;
    Longitude: number;
    BranchID: number;
    // Distance: number;
    // BranchName: string;
    Branches: BranchViewModel[]=[]
}
