import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { PostsService } from "../posts/posts.service";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    userId: string;

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuth = this.authService.getIsAuthenticated();
        if (!isAuth) {
            this.router.navigate(['/auth/login']);
        }
        return isAuth;
    }

}