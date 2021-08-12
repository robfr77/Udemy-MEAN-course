import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ErrorComponent } from "./error/error.component";
import { ErrorService } from "./error/error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog, private errorService: ErrorService) { }
    // Angular calls this method for every request leaving the app. see providers in app.module. Will kick in for error response.
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // handle gives back the response observable stream. hook into that stream and listen to events.
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occured!';
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
                // return an observable for posts/auth service
                return throwError(error);
            })
        );
    }
}