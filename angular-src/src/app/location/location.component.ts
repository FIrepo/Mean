import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import {Http} from '@angular/http';


import {AuthService} from '../services/auth.service';





@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers:[AuthService]
})
export class LocationComponent implements OnInit {

	location:any;
	req:any;
	address_component:any;
	address:any;
	geometry:any;
	content:any;

  constructor(private http:Http, private router:Router,private _video:AuthService) { }

  ngOnInit() {

  }

  onLocationSubmit(){
  	const loca = {
  		location: this.location,
  	}

  	this.req = this._video.location(loca).subscribe(data=>{

  		this.content = data.body.results[0];

  		this.address = this.content.formatted_address

  		this.address_component = this.content.address_components

  		this.geometry =this.content.geometry

  		//console.log(data.body.results[0].formatted_address);
  		console.log(this.content);
  		
  	})
  }



}
