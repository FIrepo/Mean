import { Component, OnInit , OnDestroy,ViewChild} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import{Router} from '@angular/router';
import {Http} from '@angular/http';

import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-videodetail',
  templateUrl: './videodetail.component.html',
  styleUrls: ['./videodetail.component.css'],
  providers:[AuthService]
})
export class VideodetailComponent implements OnInit, OnDestroy {

	req:any;
	routesub:any;
	slug:string;
	video:any;
  email:any;
  Comment:any;
  videoid:any;


  constructor(private routes:ActivatedRoute, private http:Http, private _video:AuthService, private router:Router) { }

  ngOnInit() {

    this.req = this._video.getProfile().subscribe(profile=>{

      this.email = profile.user.email;

    })



  	this.routesub = this.routes.params.subscribe(params=>{
  		this.slug = params['slug'];	
  		this.req = this._video.get(this.slug).subscribe(data=>{
        this.video = data;
        this.videoid = this.video._id;
        console.log(data);

      }) 
  	})

   

  }


comment(){
  const comment = {
    email:this.email,
    comment:this.Comment,
    id:this.videoid
  }
  console.log(comment)

  this.req = this._video.videocomment(comment).subscribe(data=>{
    console.log(data);
    this.router.navigate(["/videos/"]);
  });
  
}

  ngOnDestroy(){
    this.routesub.unsubscribe()
    this.req.unsubscribe()
  }

}
