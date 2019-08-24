import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';
import {fadeInOut} from '../../../animations/fadeInOut';
import {TranslateService} from '@ngx-translate/core';
import * as $ from 'jquery';


@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    collapsed = false;
    itemIndex = 0;
    myForm: FormGroup;
    dataList: any = [];
    member_id: any;
    faqDetails = [
        {
            Question: 'This is Test',
            Answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos '
        },
        {
            Question: 'This is Test 2',
            Answer: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos '
        }
    ];
    private trans = {
        IncreaseKnowledge: null,
        Recognition: null,
        CareerAdvancement: null,
        ResearchersNetwork: null,
        IncreaseKnowledgeDesc: null,
        RecognitionDesc: null,
        CareerAdvancementDesc: null,
        ResearchersNetworkDesc: null,

    };

    constructor(public _appService: AppService,
                private translate: TranslateService,
    ) {


        translate.get(['_IncreaseKnowledge', '_Recognition', '_CareerAdvancement', '_ResearchersNetwork', '_IncreaseKnowledgeDesc', '_ResearchersNetworkDesc', '_CareerAdvancementDesc', '_RecognitionDesc']).subscribe(res => {

            this.dataList = [
                {
                    photo: 'assets/img/login.jpg',
                    text: res._IncreaseKnowledgeDesc,
                    title: res._IncreaseKnowledge
                },
                {
                    photo: 'assets/img/recognation.jpg',
                    text: res._RecognitionDesc,
                    title: res._Recognition
                },
                {
                    photo: 'assets/img/career.jpg',
                    text: res._CareerAdvancementDesc,
                    title: res._CareerAdvancement
                },
                {
                    photo: 'assets/img/Researcher_network.jpg',
                    text: res._ResearchersNetworkDesc,
                    title: res._ResearchersNetwork
                }
            ];
        });


        translate.onLangChange.subscribe(lang => {
            this.dataList = [
                {
                    photo: 'assets/img/login.jpg',
                    text: lang.translations._IncreaseKnowledgeDesc,
                    title: lang.translations._IncreaseKnowledge
                },
                {
                    photo: 'assets/img/recognation.jpg',
                    text: lang.translations._RecognitionDesc,
                    title: lang.translations._Recognition
                },
                {
                    photo: 'assets/img/career.jpg',
                    text: lang.translations._CareerAdvancementDesc,
                    title: lang.translations._CareerAdvancement
                },
                {
                    photo: 'assets/img/Researcher_network.jpg',
                    text: lang.translations._ResearchersNetworkDesc,
                    title: lang.translations._ResearchersNetwork
                }


            ];
        });
    }


    next() {
        if (this.itemIndex == (this.dataList.length - 1)) {
            this.itemIndex = 0;
        } else {
            this.itemIndex += 1;
        }
    }

    prev() {
        if (this.itemIndex == 0) {
            this.itemIndex = (this.dataList.length - 1);
        } else {
            this.itemIndex -= 1;
        }
    }

    ngOnInit() {
        this._appService.active = 2;
        window.scrollTo(0, 0);
        this.member_id = localStorage.getItem('id');



    }

}
