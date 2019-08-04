import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppService} from '../../app/app.service';

@Component({
    selector: 'app-faq-slider',
    templateUrl: './faq-slider.component.html',
    styleUrls: ['./faq-slider.component.css']
})
export class FaqSliderComponent {

    @Input() faqData: any;
    @Input() ServiceDataRight: any;
    @Input() ServiceDataLeft: any;
    @Input() pageCountArray: any = [];
    @Input() pageCount: number;
    @Output() changePage = new EventEmitter();
    @Input() size: number;
    activePage: number;
    public startPage = 0;
    public endPage = 6;
    page = 0;

    constructor(public _appService: AppService) {

        this.activePage = 0;


    }


    pageChanged(pageNumber) {
        this.changePage.emit(pageNumber);
        this.activePage = pageNumber;
    }

    nextPage() {
        if (this.pageCount != this.endPage) {
            this.endPage = this.endPage + 1;
            this.startPage = this.startPage + 1;
        }

    }

    previousPage() {
        if (this.startPage != 0) {
            this.endPage = this.endPage - 1;
            this.startPage = this.startPage - 1;
        }
    }

    openToggle(event) {
        event.target.classList.toggle('active');
        event.target.classList.toggle('closed');
        let panel = event.target.nextElementSibling;
        if (panel) {
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        }
    }

}
