import { Injectable } from '@angular/core';
import { HomeState } from './home.state';

@Injectable()
export class UserDataService {
    public homeState: HomeState;

    constructor() {
        this.homeState = new HomeState();
    }
}