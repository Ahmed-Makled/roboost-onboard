import{BranchViewModel} from './branch.model';

export class SuperVisorFigurViewModel {
   
    BranchesList: BranchViewModel[]=[];
    UnderReviewRequestCount: number;
    ApprovedRequestCount: number;
    UnApprovedRequestCount: number;
    TotalRequest: number;
}
