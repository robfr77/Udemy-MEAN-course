import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    onLogout() {
        // clear the token and inform interested parts about change
        this.authService.logoutUser();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }
}