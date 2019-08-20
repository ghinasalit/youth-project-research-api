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
        center: L.latLng(-37.87, 175.475),
        background: '#000',
        fillColor: 'yellow',
        color: 'black',


    };
    public socialFixed = false;
    private registerForm: any;
    private trans = {
        FeedbackMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
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

        translate.get(['_FeedbackMSG', '_Success', '_Failed', '_FailedMSG']).subscribe(res => {

            this.trans.Failed = res._Failed;
            this.trans.FailedMSG = res._FailedMSG;
            this.trans.FeedbackMSG = res._FeedbackMSG;
            this.trans.Success = res._Success;
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

        this._appService.api.getCountriesService()
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
                                        let avatar = (details.avatar) ? (this._appService.api.api.imgURL + details.avatar) : 'assets/img/default';
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
                                                    '                        <p>Member of the month</p>\n' +
                                                    '                    </div>\n' +
                                                    '                    <div>\n' +
                                                    '                        <a href="/profile/' + details.username + '"> Go to Profile</a>\n' +
                                                    '                    </div>\n' +
                                                    '                </div>\n' +
                                                    '            </div>\n' +
                                                    '         <div class="pop-up-body">\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-university"></i>\n' +
                                                    '                <div class="info-data">' + details.university_en + '</div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-suitcase"></i>\n' +
                                                    '                <div class="info-data">' + details.job + '</div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-eye"></i>\n' +
                                                    '                <div class="info-data">' + details.views + ' Views</div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon">\n' +
                                                    '                <i class="fa fa-file-text-o"></i>\n' +
                                                    '                <div class="info-data">' + details.count_papers + ' Research papers</div>\n' +
                                                    '            </div>\n' +
                                                    '            <div class="info-icon last-icon">\n' +
                                                    '              <div class="trophy">\n' +
                                                    '                <i class="fa fa-trophy"></i>\n' +
                                                    '                <div class="info-data">1 Recognized Research</div>\n' +
                                                    '              </div>\n' +
                                                    '              <div class="message">\n' +
                                                    '                <i class="fa fa-envelope-o"></i>\n' +
                                                    '                <div class="info-data"> <a href=mailto:' + details.email + '>Email ' + details.first_name + ' </a></div>\n' +
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

    scroll(element: any) {
        const el: HTMLElement | null = document.getElementById(element);
        if (el) {
            setTimeout(() =>
                el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'}), 0);
            this._appService.section = '';
        }
    }

    ngAfterViewInit(): void {
        AOS.refresh();
    }

    ngOnInit() {

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
        if (scrollTop > 700) {
            this.socialFixed = true;
            $('.social').css('position', 'fixed').css('top', '50%').css('z-index', '1000');
        } else {
            this.socialFixed = false;
            $('.social').css('position', 'initial').css('top', '0');
        }
    }

}













