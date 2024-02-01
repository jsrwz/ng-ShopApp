import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationModule } from "../authentication/authentication.module";
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
    declarations: [
        NavbarComponent,
        HomeComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AuthenticationModule,
        RouterModule.forChild([
            { path: 'home', component: HomeComponent },
        ])
    ],
    exports: [
        NavbarComponent,
        HomeComponent,
    ],
})
export class SharedModule {

}