import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppSliderComponent} from '../elements/app-slider/app-slider.component';
import {AppSlideshowComponent} from '../elements/app-slideshow/app-slideshow.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import {RouterModule} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SafePipe} from '../pipes/safeURLs.pipe';
import {SWIPER_CONFIG, SwiperConfigInterface, SwiperModule} from 'ngx-swiper-wrapper';
import {BsDatepickerModule, DatepickerModule} from 'ngx-bootstrap';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgProgressModule} from '@ngx-progressbar/core';
import {CivilComponent} from './civil/civil.component';
import {HeaderComponent} from './civil/header/header.component';
import {FooterComponent} from './civil/footer/footer.component';
import {HomeComponent} from './civil/home/home.component';
import {BreadcrumbComponent} from '../elements/breadcrumb/breadcrumb.component';
import {FormsExamplesComponent} from '../elements/forms-examples/forms-examples.component';
import {CaptchaComponent} from '../elements/captcha/captcha.component';
import {AppSwiperComponent} from '../elements/app-swiper/app-swiper.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './civil/register/register.component';
import {ProfileComponent} from './civil/profile/profile.component';
import {UploadPaperComponent} from './civil/upload-research-paper/upload-paper/upload-paper.component';
import {LoginComponent} from './civil/login/login.component';
import {AboutComponent} from './civil/about/about.component';
import {MembersComponent} from './civil/members/members.component';
import {DialogModule} from '../modules/dialog.module';
import {UploadResearchPaperComponent} from './civil/upload-research-paper/upload-research-paper.component';
import {DetailsPaperComponent} from './civil/upload-research-paper/details-paper/details-paper.component';
import {PermissionPeparComponent} from './civil/upload-research-paper/permission-pepar/permission-pepar.component';
import {MatRadioModule} from '@angular/material/radio';
import {FaqSliderComponent} from '../elements/faq-slider/faq-slider.component';
import {PapersComponent} from './civil/papers/papers.component';
import {EditPaperComponent} from './civil/edit-paper/edit-paper.component';
import {MemberDetailsComponent} from './civil/member-details/member-details.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {AppXgalleryComponent} from '../elements/app-xgallery/app-xgallery.component';
import {ToastrModule} from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';
import {ImageCropperModule} from 'ngx-image-cropper';
import {TruncatPipe} from '../pipes/truncat.pipe';



export function HttpLoaderFactory(httpClient: HttpClient) {
    return new MultiTranslateHttpLoader(httpClient, [
        {prefix: './assets/i18n/', suffix: '.json'}
    ]);
}


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};

@NgModule({
    declarations: [
        AppComponent,
        AppSliderComponent,
        AppXgalleryComponent,
        AppSlideshowComponent,
        SafePipe,
        TruncatPipe,
        CivilComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        BreadcrumbComponent,
        CaptchaComponent,
        AppSwiperComponent,
        FormsExamplesComponent,
        RegisterComponent,
        ProfileComponent,
        UploadPaperComponent,
        LoginComponent,
        AboutComponent,
        MembersComponent,
        FaqSliderComponent,
        UploadResearchPaperComponent,
        DetailsPaperComponent,
        PermissionPeparComponent,
        PapersComponent,
        EditPaperComponent,
        MemberDetailsComponent,



    ],
    imports: [
        DialogModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        SlideshowModule,
        SwiperModule,
        MatCardModule,
        HttpClientModule,
        RouterModule,
        MatFormFieldModule,
        MatRadioModule,
        MatIconModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        ImageCropperModule,
        MatAutocompleteModule,
        BsDatepickerModule.forRoot(),
        LeafletModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BsDropdownModule.forRoot(),
        DatepickerModule.forRoot(),
        NgProgressModule.withConfig({
            spinner: false,
            color: '#000'
        }),
        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        NgProgressHttpModule
    ],
    providers: [{
        provide: SWIPER_CONFIG,
        useValue: DEFAULT_SWIPER_CONFIG
    }],
    exports: [

    ],


    bootstrap: [AppComponent]
})
export class AppModule {


}

