import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule, MatFormFieldModule,
    MatIconModule, MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {ProfileInfoComponent} from '../app/dialogs/profile-info/profile-info.component';
import {PaperComponent} from '../app/dialogs/paper/paper.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {until} from 'selenium-webdriver';
import {ConditionsComponent} from '../app/dialogs/conditions/conditions.component';
import {RequestComponent} from '../app/dialogs/request/request.component';
import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [ProfileInfoComponent, PaperComponent ,  ConditionsComponent , RequestComponent],
    imports: [
        MatFormFieldModule,
        RouterModule,
        MatInputModule,
        TranslateModule,
        CommonModule,
        BrowserModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatSelectModule,
        FormsModule,
        ImageCropperModule,
        ReactiveFormsModule
    ],
    entryComponents: [

        PaperComponent,
        ProfileInfoComponent,
        ConditionsComponent,
        RequestComponent
    ],
    exports: [
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        ImageCropperModule,
        BrowserAnimationsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DialogModule {
}
