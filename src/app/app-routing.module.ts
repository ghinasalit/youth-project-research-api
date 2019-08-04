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
                component: RegisterComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'profile-info',
                component: MemberDetailsComponent
            },
            {
                path: 'upload-paper',
                component: UploadResearchPaperComponent,
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
                component: LoginComponent
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
                path: 'edit-paper',
                component: EditPaperComponent
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
