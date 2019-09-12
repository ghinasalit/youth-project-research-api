import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Shared} from '../../../classes/shared';
import {User} from '../../../classes/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
    collapsed = false;
    result: any;
    members: any = [];
    data = new Shared();
    member = new User();
    searchForm: FormGroup;
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    member_id: any;

    constructor(public _appService: AppService,
                public fb: FormBuilder) {

        this.data.page = 1;
        this.data.size = 10;
        this.member.page = 0;
        this.member.size = 10;

        this.searchForm = fb.group({


            'search': '',

        });

    }

    getMembers() {
        this.member.page = 0;
        if (this.data.page === 1) {
            this.members = [];
        }
        this._appService.api.getMembersService(this.data)
            .subscribe(response => {

                this.result = response;
                if (this.result.code === 1) {
                    this.result.data.forEach(item => {
                        this.members.push(item);
                    });

                    this.data.page = this.data.page + 1;

                } else {

                }

            });

    }

    sortMembers(sort) {
        this.data.sort = sort;
        this.data.page = 1;
        this.getMembers();
    }

    filter() {
        this.member.page = 0;
        this.searchMemeber();

    }

    searchMemeber() {
        this.data.page = 1;
        if (this.member.page === 0) {
            this.members = [];
        }
        this.member.keyword = this.searchForm.controls.search.value;

        this._appService.api.searchMemeberService(this.member)
            .subscribe(response => {

                this.result = response;
              this.members = [];
                if (this.result.code === 1) {
                    this.result.data.forEach(item => {
                        this.members.push(item);
                    });

                    this.member.page = this.member.page + 1;

                } else {

                }

            });

    }

    loadmore() {

        if (this.result.data.length === 6 && this.member.letter === '' && this.member.keyword === '') {
            this.getMembers();
        } else if (this.result.data.length === 6 && (this.member.letter != '' && this.member.keyword != '')) {

            this.searchMemeber();
        }

    }

    ngOnInit() {

        window.scrollTo(0, 0);
        this._appService.active = 3;
        this.getMembers();
        this.member_id = localStorage.getItem('id');

    }

}
