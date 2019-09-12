import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {fadeInOut} from '../../../animations/fadeInOut';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as L from 'leaflet';
import {Layer} from 'leaflet';
import * as $ from 'jquery';
import 'leaflet.heat/dist/leaflet-heat.js';
import {Feedback} from '../../../classes/feedback';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../../classes/user';
import {Router} from '@angular/router';
import {Shared} from '../../../classes/shared';
import * as AOS from 'aos';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeInOut]
})
export class HomeComponent implements OnInit, AfterViewInit {
    collapsed = false;
    feedbackForm: FormGroup;
    result: any;
    members: any;
    isOneRecognized = false;
    user = new User();
    memberDetails: any = [];
    details: any;
    feedback = new Feedback();
    markers: Layer[] = [];
    layrs = [];
    points: any;
    data = new Shared();
    itemIndex = 0;
    addressPoints = [];
    Counties: any = [];
    statistics: any;
    @ViewChild('input') input: ElementRef;

    name = new FormControl('', [Validators.required]);
    email = new FormControl('', [Validators.required, Validators.email]);
    phone = new FormControl('', [Validators.required]);
    message = new FormControl('', [Validators.required]);
    options = {
        layers: [

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 2,
                // fillColor: 'yellow',
                attribution: ''
            }),
        ],
        zoom: 2,
        scrollWheelZoom: false,
        center: L.latLng(-37.87, 175.475),
        background: '#000',
        fillColor: 'yellow',
        color: 'black',


    };
    public socialFixed = false;
    private trans = {
        FeedbackMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
        MemberMonth: null,
        GoProfile: null,
        Views: null,
        Email: null,
        ResearchPaper: null,
        RecognizedResearch: null,
    };

    constructor(private translateService: TranslateService,
                public _appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                private translate: TranslateService,
                private toaster: ToastrService) {

        this.data.page = 1;
        this.data.size = 100;
        this.feedbackForm = fb.group({
            'name': [null, Validators.required],
            'email': [null, Validators.required],
            'phone': [null, Validators.required],
            'message': [null, Validators.required],
        });

        translate.get(['_FeedbackMSG', '_Success', '_ResearchPaper', '_Failed', '_Email', '_FailedMSG', '_MemberMonth', '_GoProfile', '_Views', '_RecognizedResearch']).subscribe(res => {

            this.trans.Failed = res._Failed;
            this.trans.FailedMSG = res._FailedMSG;
            this.trans.FeedbackMSG = res._FeedbackMSG;
            this.trans.Success = res._Success;
            this.trans.MemberMonth = res._MemberMonth;
            this.trans.GoProfile = res._GoProfile;
            this.trans.ResearchPaper = res._ResearchPaper;
            this.trans.Views = res._Views;
            this.trans.Email = res._Email;
            this.trans.RecognizedResearch = res._RecognizedResearch;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.Failed = lang.translations._Failed;
            this.trans.FailedMSG = lang.translations._FailedMSG;
            this.trans.FeedbackMSG = lang.translations._FeedbackMSG;
            this.trans.Success = lang.translations._Success;
            this.trans.MemberMonth = lang.translations._MemberMonth;
            this.trans.ResearchPaper = lang.translations._ResearchPaper;
            this.trans.GoProfile = lang.translations._GoProfile;
            this.trans.Views = lang.translations._Views;
            this.trans.Email = lang.translations._Email;
            this.trans.RecognizedResearch = lang.translations._RecognizedResearch;

        });

    }

    submitFeedback(formDirective) {
        this.feedback.name = this.feedbackForm.controls.name.value;
        this.feedback.email = this.feedbackForm.controls.email.value;
        this.feedback.message = this.feedbackForm.controls.message.value;
        this.feedback.phone = this.feedbackForm.controls.phone.value;
        this._appService.api.feedbackService(this.feedback)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    formDirective.resetForm();
                    this.feedbackForm.reset();
                    this.toaster.success(this.trans.FeedbackMSG, '');
                    this.input.nativeElement.value = '';

                } else {
                    this.toaster.error(this.trans.FailedMSG, '');

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

    getOneRecognized(country, member_id) {

        this.user.country = country;
        this._appService.api.getOneRecognizedService(this.user)
            .subscribe(response => {
                let result: any;
                result = response;
                if (result.code === 1) {
                    this.details = result.data;
                    if (member_id === result.data.member_id && result.data.views != 0) {
                        this.isOneRecognized = true;
                    }

                } else {

                }

            });


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

    next() {
        if (this.itemIndex == (this.members.length - 1)) {
            this.itemIndex = 0;
        } else {
            this.itemIndex += 1;
        }
    }

    prev() {
        if (this.itemIndex == 0) {
            this.itemIndex = (this.members.length - 1);
        } else {
            this.itemIndex -= 1;
        }
    }

    // Marker for the parking lot at the base of Mt. Ranier trails

    onMapReady(map) {
        this.user.language = localStorage.getItem('language') === 'en' ? 1 : 2
        this._appService.api.getCountriesService(this.user)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.Counties = result.data;
                    this.Counties.forEach(item => {
                        this.user.country = item.name_en;
                        this._appService.api.getOneRecognizedService(this.user)
                            .subscribe(response => {
                                let result: any;
                                result = response;
                                let details: any;
                                if (result.code === 1) {
                                    details = result.data;


                                    if (details !== '' && details.views > 0) {
                                        var popup = L.popup();
                                        let avatar = (details.avatar) ? (this._appService.api.api.imgURL + details.avatar) : 'assets/img/avatar_default.jpeg';
                                        let job = (details.job) ? ' <div class="info-icon">\n' +
                                            '                <i class="fa fa-suitcase"></i>\n' +
                                            '                <div class="info-data">' + details.job + '</div>\n' +
                                            '            </div>\n' : '';
                                        this.addressPoints.push([item.lat, item.lng, item.grade]);
                                        let marker = L.marker([item.lat, item.lng]).addTo(map).on('click', <LeafletMouseEvent>(e) => {
                                            popup
                                                .setLatLng(e.latlng)
                                                .setContent('        <div class="one_recognized">\n' +
                                                    '            <div class="avatar-name">\n' +
                                                    '                   <div class="avatar">' +
                                                    '                       <img src=" ' + avatar + '" >' +
                                                    '                   </div>\n' +
                                                    '                <div class="name">\n' +
                                                    '                    <div class="title">\n' +
                                                    '                        <p>' + details.first_name + ' ' + details.last_name + '</p>\n' +
                                                    '                        <div></div>\n' +
                                                    '                    </div>\n' +
                                                    '                    <div class="recently-joint">\n' +
                                                    '                        <i class="fa fa-star"></i>\n' +
                                                    '                        <p>' + this.trans.MemberMonth + '</p>\n' +
                                                    '                    </div>\n' +
                                                    '                    <div>\n' +
                                                    '                        <a href="/#/profile/' + details.member_id + '"> ' + this.trans.GoProfile + '</a>\n' +
                                                    '                    </div>\n' +
                                                    '                </div>\n' +
                                                    '            </div>\n' +
                                                    '         <div class="pop-up-body">\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-university"></i>\n' +
                                                    '                <div class="info-data">' + details.university_en + '</div>\n' +
                                                    '            </div>\n' + job +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-eye"></i>\n' +
                                                    '                <div class="info-data">' + details.views + this.trans.Views + ' </div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-file-text-o"></i>\n' +
                                                    '                <div class="info-data">' + details.count_papers + this.trans.ResearchPaper + ' </div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon last-icon">\n' +
                                                    '              <div class="trophy">\n' +
                                                    '                <i class="fa fa-trophy"></i>\n' +
                                                    '                <div class="info-data">1 ' + this.trans.RecognizedResearch + '</div>\n' +
                                                    '              </div>\n' +
                                                    '              <div class="message">\n' +
                                                    '                <i class="fa fa-envelope-o"></i>\n' +
                                                    '                <div class="info-data"> <a href=mailto:' + details.email + '> ' + this.trans.Email + ' ' + details.first_name + ' </a></div>\n' +
                                                    '              </div>\n' +
                                                    '            </div>\n' +
                                                    '         </div>\n' +
                                                    '        </div>')
                                                .openOn(map);
                                        });


                                        this.markers.push(marker);
                                        // if (this.addressPoints.length === this.Counties.length) {
                                        let heat = (<any>L).heatLayer(
                                            this.addressPoints
                                            , {
                                                minOpacity: 0.0,
                                                maxZoom: 8,
                                                blur: 0,
                                                radius: 15,
                                                someCustomProperty: 'Syria',
                                                gradient: {
                                                    0.1: '#FDD97A',
                                                    0.3: '#FDD97A',
                                                    0.4: '#75CDDD',
                                                    0.6: '#FDD97A',
                                                    1: '#FDD97A'
                                                },

                                            }).addTo(map);


                                        // }
                                    }
                                }
                            });

                    });


                } else {

                }

            });


    }

    popupShow(map) {

    }

    getStatistics() {

        this._appService.api.getStatisticsService()
            .subscribe(response => {
                let result1: any;
                result1 = response;
                if (result1.code === 1) {
                    this.statistics = result1.data;

                } else {

                }

            });

    }

    // scroll(element: any) {
    //     // this.collapsed = false;
    //     const el: HTMLElement | null = document.getElementById(element);
    //     if (el) {
    //         setTimeout(() =>
    //             el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'}), 0);
    //         this._appService.section = '';
    //     }
    // }

    scroll(el: HTMLElement) {
        const element = document.getElementById(el.id);
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);

        this._appService.section = '';
        this.collapsed = false;
    }

    ngAfterViewInit(): void {
        AOS.refresh();
      $(document).ready(function(){
        $("#preloader").remove();
        $(".social-paper .card-icon-research").mouseover(function () {
          $('.social-paper .card-icon-research img').attr('src','assets/img/ResearchPaper.gif');
        });
        $(".social-paper .card-icon-research").mouseout(function () {
          $('.social-paper .card-icon-research img').attr('src','assets/img/ResearchPaper.png');
        });
        $(".social-paper .card-icon-submit").mouseover(function () {
          $(".social-paper .card-icon-submit img").attr('src','assets/img/UploadPaper.gif');
        });
        $('.social-paper .card-icon-submit').mouseout(function () {
          $('.social-paper .card-icon-submit img').attr('src','assets/img/UploadPaper.png');
        });
      });
    }

ngOnInit() {
 this._appService.active = 0;
        this.getStatistics();
        window.scrollTo(0, 0);
        this.getMembers();
        this._appService.roleNotifier.subscribe(data => {
            if (data === 1) {
                this.getMemberLoggedin();
            }
        });

        if (this._appService.section) {
            this.scroll(this._appService.section);
        }

    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollTop = $(window).scrollTop();
        if (scrollTop > 700 && !this._appService.roll) {
            this.socialFixed = true;
            $('.social').css('position', 'fixed').css('top', '200px').css('z-index', '1000');
        } else if (scrollTop <= 700 && !this._appService.roll) {
            this.socialFixed = false;
            $('.social').css('position', 'initial').css('top', '0');
        } else if (scrollTop > 200 && this._appService.roll) {
            this.socialFixed = true;
            $('.social').css('position', 'fixed').css('top', '20px').css('z-index', '1000');
        } else if (scrollTop <= 200 && this._appService.roll) {
            this.socialFixed = false;
            $('.social').css('position', 'initial').css('top', '0');
        }
    }

}













