import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation, TemplateRef, Inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Orientation, TourStep, ProgressIndicatorLocation } from './guided-tour.constants';
import { GuidedTourTestService } from './guided-tour.service';
import { WindowRefTestService } from "./windowref.service";
import { retry } from 'rxjs/operators';

@Component({
    selector: 'ngx-guided-tour-custom',
    templateUrl: './guided-tour.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GuidedTourCustomComponent implements AfterViewInit, OnDestroy {
    @Input() public topOfPageAdjustment?= 0;
    @Input() public tourStepWidth?= 400;
    @Input() public minimalTourStepWidth?= 400;
    @Input() public skipText?= 'Skip';
    @Input() public nextText?= 'Next';
    @Input() public doneText?= 'Done';
    @Input() public closeText?= 'Close';
    @Input() public backText?= 'Back';
    @Input() public progressIndicatorLocation?: ProgressIndicatorLocation = ProgressIndicatorLocation.BottomOfTourBlock;
    @Input() public progressIndicator?: TemplateRef<any> = undefined;
    @ViewChild('tourStep', { static: false }) public tourStep: ElementRef;
    public highlightPadding = 4;
    public currentTourStep: TourStep = null;
    public selectedElementRect: DOMRect = null;
    public isOrbShowing = false;
    public progressIndicatorLocations = ProgressIndicatorLocation;

    private resizeSubscription: Subscription;
    private scrollSubscription: Subscription;

    constructor(
        public guidedTourService: GuidedTourTestService,
        private windowRef: WindowRefTestService,
        @Inject(DOCUMENT) private dom: any
    ) { }

    public ngAfterViewInit(): void {
        this.guidedTourService.guidedTourCurrentStepStream.subscribe((step: TourStep) => {
            this.currentTourStep = step;
         
            if (step && step.selector) {
                const selectedElement = this.dom.querySelector(step.selector);
                if (selectedElement) {
                    this.scrollToAndSetElement();
                } else {
                    this.selectedElementRect = null;
                }
            } else {
                this.selectedElementRect = null;
            }
        });
        
        // this.guidedTourService.guidedTourOrbShowingStream.subscribe((value: boolean) => {
        //     this.isOrbShowing = value;
        // });

        this.resizeSubscription = fromEvent(this.windowRef.nativeWindow, 'resize').subscribe(() => {
            this.updateStepLocation();
        });

        this.scrollSubscription = fromEvent(this.windowRef.nativeWindow, 'scroll').subscribe(() => {
            this.updateStepLocation();
        });
    }

    public ngOnDestroy(): void {
        this.resizeSubscription?.unsubscribe();
        this.scrollSubscription?.unsubscribe();
    }

    private get maxWidthAdjustmentForTourStep(): number {
        return this.tourStepWidth - this.minimalTourStepWidth;
    }

    private get widthAdjustmentForScreenBound(): number {
        if (!this.tourStep) {
            return 0;
        }
        let adjustment = 0;
        if (this.calculatedLeftPosition < 0) {
            adjustment = -this.calculatedLeftPosition;
        }
        if (this.calculatedLeftPosition > this.windowRef.nativeWindow.innerWidth - this.tourStepWidth) {
            adjustment = this.calculatedLeftPosition - (this.windowRef.nativeWindow.innerWidth - this.tourStepWidth);
        }

        return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
    }

    public get calculatedTourStepWidth() {
        return this.tourStepWidth - this.widthAdjustmentForScreenBound;
    }

    public scrollToAndSetElement(): void {
        this.updateStepLocation();
        // Allow things to render to scroll to the correct location
        setTimeout(() => {
            if (!this.isOrbShowing && !this.isTourOnScreen()) {
                if (this.selectedElementRect && this.isBottom()) {
                    // Scroll so the element is on the top of the screen.
                    const topPos = ((this.windowRef.nativeWindow.scrollY + this.selectedElementRect.top) - this.topOfPageAdjustment)
                        - (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        + this.getStepScreenAdjustment();
                    try {
                        this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    } catch (err) {
                        if (err instanceof TypeError) {
                            this.windowRef.nativeWindow.scroll(0, topPos);
                        } else {
                            throw err;
                        }
                    }
                } else {
                    // Scroll so the element is on the bottom of the screen.
                    const topPos = (this.windowRef.nativeWindow.scrollY + this.selectedElementRect.top + this.selectedElementRect.height)
                        - this.windowRef.nativeWindow.innerHeight
                        + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        - this.getStepScreenAdjustment();
                    try {
                        this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    } catch (err) {
                        if (err instanceof TypeError) {
                            this.windowRef.nativeWindow.scroll(0, topPos);
                        } else {
                            throw err;
                        }
                    }
                }
            }
        });
    }



    // public handleOrb(): void {
    //     this.guidedTourService.activateOrb();
    //     if (this.currentTourStep && this.currentTourStep.selector) {
    //         this.scrollToAndSetElement();
    //     }
    // }

    private isTourOnScreen(): boolean {
        return this.tourStep
            && this.elementInViewport(this.dom.querySelector(this.currentTourStep.selector))
            && this.elementInViewport(this.tourStep.nativeElement);
    }

    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    private elementInViewport(element: HTMLElement): boolean {
        let top = element.offsetTop;
        const height = element.offsetHeight;

        while (element.offsetParent) {
            element = (element.offsetParent as HTMLElement);
            top += element.offsetTop;
        }
        if (this.isBottom()) {
            return (
                top >= (this.windowRef.nativeWindow.pageYOffset
                    + this.topOfPageAdjustment
                    + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                    + this.getStepScreenAdjustment())
                && (top + height) <= (this.windowRef.nativeWindow.pageYOffset + this.windowRef.nativeWindow.innerHeight)
            );
        } else {
            return (
                top >= (this.windowRef.nativeWindow.pageYOffset + this.topOfPageAdjustment - this.getStepScreenAdjustment())
                && (top + height + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)) <= (this.windowRef.nativeWindow.pageYOffset + this.windowRef.nativeWindow.innerHeight)
            );
        }
    }

    public backdropClick(event: Event): void {
        if (this.guidedTourService.preventBackdropFromAdvancing) {
            event.stopPropagation();
        } else {
            this.guidedTourService.nextStep();
        }
    }

    public updateStepLocation(): void {
        if (this.currentTourStep && this.currentTourStep.selector) {
            const selectedElement = this.dom.querySelector(this.currentTourStep.selector);
            if (selectedElement && typeof selectedElement.getBoundingClientRect === 'function') {
                this.selectedElementRect = (selectedElement.getBoundingClientRect() as DOMRect);
            } else {
                this.selectedElementRect = null;
            }
        } else {
            this.selectedElementRect = null;
        }
    }

    private isBottom(): boolean {
        return this.currentTourStep.orientation
            && (this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.BottomLeft
                || this.currentTourStep.orientation === Orientation.BottomRight);
    }

    public get topPosition(): number {
        const paddingAdjustment = this.getHighlightPadding();

        if (this.isBottom()) {
            return this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
        }

        if( this.currentTourStep.subSelector)
            return this.subELementRect(this.currentTourStep.subSelector).top  - (this.subELementRect(this.currentTourStep.subSelector).height / 2)  
        else
        return this.selectedElementRect.top - this.getHighlightPadding(); 
    }

    public  subELementRect(el) {

        return   this.dom.querySelector(el).getBoundingClientRect() as DOMRect
    }
    


    // public get orbTopPosition(): number {
    //     if (this.isBottom()) {
    //         return this.selectedElementRect.top + this.selectedElementRect.height;
    //     }

    //     if (
    //         this.currentTourStep.orientation === Orientation.Right
    //         || this.currentTourStep.orientation === Orientation.Left
    //     ) {
    //         return (this.selectedElementRect.top + (this.selectedElementRect.height / 2));
    //     }

    //     return this.selectedElementRect.top;
    // }

    private get calculatedLeftPosition(): number {
        const paddingAdjustment = this.getHighlightPadding();

        if (
            this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.BottomRight
        ) {
            return (this.selectedElementRect.right - this.tourStepWidth);
        }

        if (
            this.currentTourStep.orientation === Orientation.TopLeft
            || this.currentTourStep.orientation === Orientation.BottomLeft
        ) {
            return (this.selectedElementRect.left);
        }

        if (this.currentTourStep.orientation === Orientation.Left) {
            return this.selectedElementRect.left - this.tourStepWidth - paddingAdjustment;
        }

        if (this.currentTourStep.orientation === Orientation.Right) {
            console.log('Right');
            return (this.selectedElementRect.left + this.selectedElementRect.width + paddingAdjustment);
        }
     

        return (this.selectedElementRect.right - (this.selectedElementRect.width / 2) - (this.tourStepWidth / 2));
    }

    public get leftPosition(): number {
        if (this.calculatedLeftPosition >= 0) {
            return this.calculatedLeftPosition;
        }
        const adjustment = Math.max(0, -this.calculatedLeftPosition)
        const maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        return this.calculatedLeftPosition + maxAdjustment;
    }


    public get transform(): string {
        if (
            !this.currentTourStep.orientation
            || this.currentTourStep.orientation === Orientation.Top
            || this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.TopLeft
        ) {
            return 'translateY(-100%)';
        }
        return null;
    }


    public get overlayTop(): number {
        if (this.selectedElementRect) {
            // return this.selectedElementRect. - this.getHighlightPadding();

            if (this.currentTourStep && this.currentTourStep.sub) 
            return  this.subELementRect(this.currentTourStep.sub).top - (this.getHighlightPadding() * 2) ;
        else   return this.selectedElementRect.top - (this.getHighlightPadding() * 2) ;
        }


        
        return 0;
    }

    public get overlayLeft(): number {
        if (this.selectedElementRect) {
            // return this.selectedElementRect.left - this.getHighlightPadding();

            if (this.currentTourStep && this.currentTourStep.sub) 
            return  this.subELementRect(this.currentTourStep.sub).left - (this.getHighlightPadding() * 2) ;
        else   return this.selectedElementRect.left - (this.getHighlightPadding() * 2) ;
        }
        return 0;
    }

    public get overlayHeight(): number {
        if (this.selectedElementRect) {
         if (this.currentTourStep && this.currentTourStep.sub) 
            return  this.subELementRect(this.currentTourStep.sub).height + (this.getHighlightPadding() * 2) ;
        else   return this.selectedElementRect.height + (this.getHighlightPadding() * 2) ;
        }
        return 0;
    }

    public get overlayWidth(): number {
        if (this.currentTourStep && this.currentTourStep.sub) 
        return  this.subELementRect(this.currentTourStep.sub).width + (this.getHighlightPadding() * 2) ;
    else   return this.selectedElementRect.width + (this.getHighlightPadding() * 2) ;
    }

    private getHighlightPadding(): number {
        let paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.highlightPadding : 0;
        if (this.currentTourStep.highlightPadding) {
            paddingAdjustment = this.currentTourStep.highlightPadding;
        }
        return paddingAdjustment;
    }

    // This calculates a value to add or subtract so the step should not be off screen.
    private getStepScreenAdjustment(): number {
        if (
            this.currentTourStep.orientation === Orientation.Left
            || this.currentTourStep.orientation === Orientation.Right
            || this.currentTourStep.orientation === Orientation.RightBottom
        ) {
            return 0;
        }

        const scrollAdjustment = this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0;
        const tourStepHeight = typeof this.tourStep.nativeElement.getBoundingClientRect === 'function' ? this.tourStep.nativeElement.getBoundingClientRect().height : 0;
        const elementHeight = this.selectedElementRect.height + scrollAdjustment + tourStepHeight;

        if ((this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment) < elementHeight) {
            return elementHeight - (this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment);
        }
        return 0;
    }
}
