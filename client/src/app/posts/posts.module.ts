import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { ImageFallbackDirective } from './image-fallback.directive';


@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
        ImageFallbackDirective
    ],
    imports: [
        CommonModule, //ngIf, etc.
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostsModule { }