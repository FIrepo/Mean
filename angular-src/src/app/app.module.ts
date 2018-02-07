import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {SafePipe} from './utility/safe.pipe';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashhboardComponent } from './dashhboard/dashhboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth.guard';

import {FlashMessagesModule } from 'angular2-flash-messages';
import { VideolistComponent } from './videolist/videolist.component';
import { VideodetailComponent } from './videodetail/videodetail.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SearchComponent } from './search/search.component';
import { SearchdetailComponent } from './searchdetail/searchdetail.component';
import { AddvideoComponent } from './addvideo/addvideo.component';
import { EditVideoComponent } from './edit-video/edit-video.component';
import { LocationComponent } from './location/location.component';

const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashhboardComponent,canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'videos',component:VideolistComponent},
  {path:'videos/:slug',component:VideodetailComponent},
  {path:'search',component:SearchdetailComponent},
  {path:'add',component:AddvideoComponent},
  {path:'edit/:slug',component:EditVideoComponent},
  {path:'location',component:LocationComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashhboardComponent,
    ProfileComponent,
    VideolistComponent,
    VideodetailComponent,
    SafePipe,
    SearchComponent,
    SearchdetailComponent,
    AddvideoComponent,
    EditVideoComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes),
    CarouselModule.forRoot(),
  ],
  providers: [ValidateService,AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
