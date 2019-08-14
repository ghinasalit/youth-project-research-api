import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {DataService} from '../../services/data.service';
import {AppService} from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _appService: AppService, private activatedRouter: Router) {
  }
  canActivate(){
    if (!this._appService.authenticatedUser()) {
      this.activatedRouter.navigate(['/home']);
    } else {
      return true;
    }
  }
}
