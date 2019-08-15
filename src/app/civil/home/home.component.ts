import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {fadeInOut} from '../../../animations/fadeInOut';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as L from 'leaflet';
import * as $ from 'jquery';
import 'leaflet.heat/dist/leaflet-heat.js';
import {Feedback} from '../../../classes/feedback';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../../classes/user';
import {Router} from '@angular/router';
import {Shared} from '../../../classes/shared';
import { Layer} from 'leaflet';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [fadeInOut]
})
export class HomeComponent implements OnInit {
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
    private registerForm: any;

    constructor(private translateService: TranslateService,
                public _appService: AppService,
                private router: Router,
                private fb: FormBuilder,
                private toaster: ToastrService) {

        this.data.page = 1;
        this.data.size = 100;
        this.feedbackForm = fb.group({
            'name': [null, Validators.required],
            'email': [null, Validators.required],
            'phone': [null, Validators.required],
            'message': [null, Validators.required],
        });
    }

    submitFeedback() {

        this.feedback.name = this.feedbackForm.controls.name.value;
        this.feedback.email = this.feedbackForm.controls.email.value;
        this.feedback.message = this.feedbackForm.controls.message.value;
        this.feedback.phone = this.feedbackForm.controls.phone.value;
        this._appService.api.feedbackService(this.feedback)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this.feedbackForm.reset();
                    this.toaster.success(this.result.msg, 'Success');

                } else {
                    console.log(this.result.msg);
                    this.toaster.error('Hello world!', 'Failed');

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

    // Marker for the parking lot at the base of Mt. Ranier trails

    prev() {
        if (this.itemIndex == 0) {
            this.itemIndex = (this.members.length - 1);
        } else {
            this.itemIndex -= 1;
        }
    }


    // getCounties() {
    //     this._appService.api.getCountriesService()
    //         .subscribe(response => {
    //             let result;
    //             result = response;
    //             if (result.code === 1) {
    //                 this.Counties = result.data;
    //                 this.Counties.forEach(item => {
    //                     this.addressPoints.push([-37.8839, 175.3745188667, '571']);
    //
    //                 });
    //
    //                 console.log(JSON.stringify(this.addressPoints));
    //             } else {
    //
    //             }
    //
    //         });
    //
    // }


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
                                        console.log(details);
                                        this.addressPoints.push([item.lat, item.lng, item.grade]);
                                        let marker = L.marker([item.lat, item.lng]).addTo(map).on('click', <LeafletMouseEvent>(e) => {

                                            popup
                                                .setLatLng(e.latlng)
                                                .setContent('        <div class="one_recognized">\n' +
                                                    '            <div class="avatar-name">\n' +
                                                    '                <div class="avatar"><img src="assets/img/member1.jpg" alt=""></div>\n' +
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
                                                    '                        <a routerLink="[/profile ,' + details.username + ' ]"> Go to Profile</a>\n' +
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
                                                    '                <div class="info-data">Email Sara</div>\n' +
                                                    '              </div>\n' +
                                                    '            </div>\n' +
                                                    '         </div>\n' +
                                                    '        </div>')
                                                .openOn(map);
                                        });


                                        this.markers.push(marker);
                                        console.log(this.markers);
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


    logout() {
        this._appService.api.logoutService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result === '1') {

                    this._appService.clearLocalStorage();
                    this.router.navigate(['/home']);

                } else {
                    console.log(this.result.msg);
                    this.toaster.error(this.result.msg, 'Failed');

                }

            });
    }

    ngOnInit() {

        this.getStatistics();
        window.scrollTo(0, 0);
        this.getMembers();
        console.log(this._appService.roll);
        this._appService.roleNotifier.subscribe(data => {
            if (data === 1) {
                this.getMemberLoggedin();
            }
        });


        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > 800) {
                $('.social').css('position', 'fixed').css('top', '0');
            } else {
                $('.social').css('position', 'initial').css('top', '0');
            }
        });

    }
}













