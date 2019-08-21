import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CivilComponent} from './civil/civil.component';
import {HomeComponent} from './civil/home/home.component';
import {RegisterComponent} from './civil/register/register.component';
import {ProfileComponent} from './civil/profile/profile.component';
import {UploadPaperComponent} from './civil/upload-research-paper/upload-paper/upload-paper.component';
import {LoginComponent} from './civil/login/login.component';
import {AboutComponent} from './civil/about/about.component';
import {MembersComponent} from './civil/members/members.component';
import {UploadResearchPaperComponent} from './civil/upload-research-paper/upload-research-paper.component';
import {DetailsPaperComponent} from './civil/upload-research-paper/details-paper/details-paper.component';
import {PermissionPeparComponent} from './civil/upload-research-paper/permission-pepar/permission-pepar.component';
import {PapersComponent} from './civil/papers/papers.component';
import {EditPaperComponent} from './civil/edit-paper/edit-paper.component';
import {MemberDetailsComponent} from './civil/member-details/member-details.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from './guards/login.guard';
import {AcceptRequestComponent} from './civil/accept-request/accept-request.component';
import {ResetPasswordComponent} from './civil/reset-password/reset-password.component';
import {ChangePasswordComponent} from './civil/change-password/change-password.component';

const routes: Routes = [
    {
        path: '',
        component: CivilComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },

            {
                path: 'register',
                component: RegisterComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'profile/:id',
                component: ProfileComponent,
            },
            {
                path: 'profile-info',
                component: MemberDetailsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'upload-paper',
                component: UploadResearchPaperComponent,
                canActivate: [AuthGuard],

                children: [
                    {
                        path: '',
                        component: UploadPaperComponent
                    },
                    {
                        path: 'details',
                        component: DetailsPaperComponent
                    },
                    {
                        path: 'upload-completed',
                        component: PermissionPeparComponent
                    },
                ]
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'members',
                component: MembersComponent
            },
            {
                path: 'papers',
                component: PapersComponent
            },
            {
                path: 'accept-request/:id',
                component: AcceptRequestComponent,
                canActivate:  [AuthGuard]
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
            {
                path: 'reset-password/:id',
                component: ChangePasswordComponent,
            },
            {
                path: 'edit-paper/:id',
                component: EditPaperComponent,
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },


        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
