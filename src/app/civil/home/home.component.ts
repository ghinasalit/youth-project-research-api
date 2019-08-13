import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {fadeInOut} from '../../../animations/fadeInOut';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import * as L from 'leaflet';
import * as $ from 'jquery';
import {addressPoints} from '../../../assets/realworld.10000.ts';
// import 'leaflet.heat/dist/leaflet-heat.js';
import {icon, latLng, marker, polyline, tileLayer} from 'leaflet';
import {ErrorStateMatcher} from '@angular/material';
import {Feedback} from '../../../classes/feedback';
import {ToastrService} from 'ngx-toastr';
import {User} from '../../../classes/user';
import {Router} from '@angular/router';
import {Shared} from '../../../classes/shared';


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
    memberDetails = new User();

    feedback = new Feedback();
    layrs = [];
    data = new Shared();
    itemIndex = 0;
    dataList = [
        {
            photo: 'assets/img/research.jpg',
            text: '”Lorem ipsum dolor sit amet,\n' +
                'consectetuer adipiscing elit, sed diam\n' +
                'nonummy nibh euismod tincidunt ut laoreet\n' +
                'dolore magna aliquam erat volutpat. Ut wisi\n' +
                'enim ad minim veniam, quis nostrud exerci\n' +
                'tation ullamcorper suscipit lobortis nisl ut\n' +
                'aliquip ex ea commodo consequat.„\n'
        },
        {
            photo: 'assets/img/img223.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad asperiores atque cumque dignissimos doloremque ducimus eligendi excepturi iusto, minus nemo neque nostrum quae, qui quis quod ratione rem tenetur.'
        }];

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


    name = new FormControl('', [Validators.required]);
    email = new FormControl('', [Validators.required, Validators.email]);
    phone = new FormControl('', [Validators.required]);
    message = new FormControl('', [Validators.required]);


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
                    this.getOneRecognized(this.memberDetails.country, this.memberDetails.member_id);
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

    // Marker for the top of Mt. Ranier
    summit = marker([46.8523, -121.7603], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
        })
    });

    // Marker for the parking lot at the base of Mt. Ranier trails

    options = {
        layers: [

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 2,
                // fillColor: 'yellow',
                attribution: ''
            })
        ],
        zoom: 2,
        center: L.latLng(-37.87, 175.475),
        background: '#000',
        fillColor: 'yellow',
        color: 'black',


    };

    onMapReady(map) {
        // let newAddressPoints = addressPoints.map(function (p) {
        //     console.log(p[0]);
        //     console.log(p[1]);
        //     return [p[0], p[1]];
        // });
        // console.log(newAddressPoints);
        // const heat = L.heatLayer([
        //     [
        //         -37.8839, // lat, lng, intensity
        //         175.3745188667,
        //         "571"
        //     ],
        //
        // ], {
        //     minOpacity: 0.0,
        //     maxZoom: 8,
        //     blur: 0,
        //     radius: 15,
        //     gradient: {0.1: '#FDD97A', 0.3: '#FDD97A', 0.4: '#75CDDD', 0.6: '#FDD97A', 1: '#FDD97A'}
        // }).addTo(map);
        //
        //
        //
        // const heat = L.heatLayer([
        //
        //     [
        //         25.1820753,
        //         55.2590815,
        //         "486"
        //     ],
        // ], {
        //     minOpacity: 0.0,
        //     maxZoom: 8,
        //     blur: 0,
        //     radius: 15,
        //     gradient: {0.1: '#FDD97A', 0.3: '#FDD97A', 0.4: '#75CDDD', 0.6: '#FDD97A', 1: '#FDD97A'}
        // }).addTo(map);
        //


    }

    popupShow(map) {
        // console.log(map);
        // $('.one_recognized').css('display' , 'display' )

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












