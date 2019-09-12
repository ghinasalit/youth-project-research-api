import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router, RouterLinkActive} from '@angular/router';
import {User} from '../../../classes/user';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.css']
})


export class ProfileInfoComponent implements OnInit {
    public user = new User();
    profileForm: FormGroup;
    result: any;
    Countries = [];
    universities: any;
    fileName: string;
    university = new FormControl('', [Validators.required]);
    imageChangedEvent: any = '';
    croppedImage: any = 'assets/img/avatar_default.jpeg';
    private trans = {
        RegisterMSG: null,

    };

    constructor(private fb: FormBuilder,
                public _appService: AppService,
                private toaster: ToastrService,
                private toast: ToastrService,
                private router: Router,
                private translate: TranslateService,
                public dialogRef: MatDialogRef<ProfileInfoComponent>) {
        this.profileForm = fb.group({

            'university': [null, Validators.required],
            'job': '',
            'location': '',
            'countryCode': '',
            'phone': '',
            'description': '',
            'Linkedin': '',

        })

        translate.get(['_RegisterMSG']).subscribe(res => {

            this.trans.RegisterMSG = res._RegisterMSG;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.RegisterMSG = lang.translations._RegisterMSG;

        });
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;

    }

    imageCropped(image) {
        this.croppedImage = image;
    }

    imageLoaded() {
        // console.log('loaded');
    }

    loadImageFailed() {
        // console.log('failed');
    }

    register() {
        this.user.university = this.profileForm.controls.university.value;
        this.user.job = this.profileForm.controls.job.value;
        this.user.location = this.profileForm.controls.location.value;
        this.user.phone = this.profileForm.controls.phone.value;
        this.user.countryCode = this.profileForm.controls.countryCode.value;
        this.user.Linkedin = this.profileForm.controls.Linkedin.value;
        this.user.description = this.profileForm.controls.description.value;
        this.user.avatar = this.croppedImage.base64 ? this.croppedImage.base64 : '';
        this._appService.api.registerService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this._appService.getRoll();
                    this.toast.success('Thank you for registration , please check your email to active your account');
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                        this.dialogRef.close();

                    });
                } else {

                    this.toaster.error(this.result.msg, '');

                }

            });

    }


    getUniversities() {
        this._appService.api.getUniversitiesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.universities = result.data;
                } else {

                }

            });

    }

    ngOnInit() {

        this.getUniversities();

      this._appService.countiesNotifier.subscribe(data => {
        this.Countries = data;
        if (data != null) {
          this.Countries = data;
        }
      });


    }

}
