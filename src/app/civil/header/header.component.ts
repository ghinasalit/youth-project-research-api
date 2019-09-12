import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Shared} from '../../../classes/shared';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    active = 5;
    navActive = true;
    collapsed = false
    memberDetails: any = [];
    result: any;
    members: any;
    data = new Shared();
    constructor(public _appService: AppService) {
    }

  getMembers() {
    this._appService.api.getMembersService(this.data)
      .subscribe(response => {

        this.result = response;

        if (this.result.code === 1) {

          this.members = this.result.data;


        } else {

        }

      });

  }

  getMemberLoggedin() {
    this._appService.api.getMemberLoggedinService()
      .subscribe(response => {

        this.result = response;
        if (this.result.code === 1) {
          this.memberDetails = this.result.data;
          // this.getOneRecognized(this.memberDetails.country, this.memberDetails.member_id);
        } else {
          this._appService.clearLocalStorage();
        }

      });

  }

    ngAfterViewInit(){


        $(document).ready(function(){
            var foo = 0;
            $(window).scroll(function(){
                foo = $(window).scrollTop();

                if (foo >= 100) {
                    $('#nav-id').addClass('scrolled');
                    $('#nav-m-id').addClass('scrolled');
                    $('.logo-left').addClass('scroll-img');
                    $('.logo-right').addClass('scroll-img');
                } else if (foo < 100) {
                    $('#nav-id').removeClass('scrolled');
                    $('#nav-m-id').removeClass('scrolled');
                    $('.logo-left').removeClass('scroll-img');
                    $('.logo-right').removeClass('scroll-img');
                }

            });
              setImageOne();

        });

          function setImageOne() {
            // tslint:disable-next-line:max-line-length
            $('.mobileLogo').fadeIn(100).html('<img src="assets/img/logo-left.png" />').delay(5000).fadeOut(100, function () { setImageTwo(); });
          }

          function setImageTwo() {
            // tslint:disable-next-line:max-line-length
            $('.mobileLogo').fadeIn(100).html('<img src="assets/img/logo-right.png" />').delay(5000).fadeOut(100, function () { setImageOne(); });
          }


    }

    ngOnInit() {
      this.getMembers();
      this._appService.roleNotifier.subscribe(data => {
        if (data === 1) {
          this.getMemberLoggedin();
        }
      });
    }

}
