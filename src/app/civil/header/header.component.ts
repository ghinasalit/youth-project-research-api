import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    active = 5;
    navActive = true;
    collapsed = false
    constructor(public _appService: AppService) {
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

        });


    }

    ngOnInit() {
    }

}
