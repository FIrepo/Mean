import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-videolist',
  templateUrl: './videolist.component.html',
  styleUrls: ['./videolist.component.css'],
  providers:[AuthService]
})
export class VideolistComponent implements OnInit,OnDestroy {

	req:any;
	todayDate;
	videolist:[any];
  username:any;
  constructor(private _video:AuthService) { }

  ngOnInit() {
  	this.todayDate = new Date();
  	this.req = this._video.list().subscribe(data=>{
      //console.log(data)
  		//console.log(data);
  		this.videolist = data as [any];
  	})

     this._video.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      console.log(this.username);
    },
    err => {
      console.log(err);
      return false;
    });


  }



 

  getEmbedUrl(item){
  	return 'https://youtube.com/embed/' + item.embed + '?ecver=2'
  }

  deleteVideo(id){
    this.req = this._video.deleteVideo(id).subscribe(data=>{
      this._video.list().subscribe(videos=>{
        this.videolist = videos as [any];
      });
      if(data.success==true){
        console.log("Video is successfully Deleted");
      }
      else{
        console.log("Error in deletion");
      }
    })

  }



  ngOnDestroy(){
    this.req.unsubscribe()
  }
  updatevi(item){
    
  }

  likeBlog(id){
    const content = {
      id:id,
      username:this.username
    }
    this.req = this._video.likepost(content).subscribe(data=>{
      console.log(data);
      this.req = this._video.list().subscribe(data=>{
      console.log(data)
      //console.log(data);
      this.videolist = data as [any];
    })
    })
  }

   dislikeBlog(id){
     const content = {
      id:id,
      username:this.username
    }
    this.req = this._video.dislikepost(content).subscribe(data=>{
      console.log(data);
      this.req = this._video.list().subscribe(data=>{
      console.log(data)
      //console.log(data);
      this.videolist = data as [any];
    })
    })
  }




}
