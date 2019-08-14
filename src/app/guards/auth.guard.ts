import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AppService} from '../app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private _appService: AppService, private activatedRouter: Router) {
    }

    canActivate() {
        if (!this._appService.authenticatedUser()) {
            this.activatedRouter.navigate(['/home']);
        } else {
            return true;
        }
    }
}
