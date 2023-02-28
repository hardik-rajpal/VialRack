import { Component, NgZone, OnInit } from '@angular/core';
import { BlogPost, GoogleService } from 'src/app/services/google.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit{
  public links:BlogPost[] = [
    {title:'Man',publishedLink:''}
  ]
  dataLoaded:boolean = true;
  postIndex:number = -1;
  constructor(private googleService:GoogleService,private zone:NgZone){
  }
  ngOnInit(){
    // this.googleService.onDriveInitChange$.subscribe((driveInit)=>{
    //   if(driveInit){
    //     this.googleService.getDocumentList().then((data)=>{
    //       this.links = data;
    //       this.dataLoaded = true;
    //       this.zone.run(()=>{})
    //       console.log(this.links,this.dataLoaded);
    //     })
    //   }
    // })
    // if(this.googleService.driveInit){
    //   this.googleService.getDocumentList().then((data)=>{
    //     this.links = data;
    //     this.dataLoaded = true;
    //     this.zone.run(()=>{})
    //     console.log(this.links,this.dataLoaded);
    //   })
    // }
  }
}
