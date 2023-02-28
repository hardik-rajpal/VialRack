import { Component } from '@angular/core';
import { BlogPost, GoogleService } from 'src/app/services/google.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  public links:BlogPost[] = []
  dataLoaded:boolean = false;
  constructor(private googleService:GoogleService){
    this.googleService.onDriveInitChange$.subscribe((driveInit)=>{
      if(driveInit){
        this.googleService.getDocumentList().then((data)=>{
          this.links = data;
          this.dataLoaded = true;
          console.log(this.links,this.dataLoaded);
        })
      }
    })
    if(this.googleService.driveInit){
      this.googleService.getDocumentList().then((data)=>{
        this.links = data;
        this.dataLoaded = true;
        console.log(this.links,this.dataLoaded);
      })
    }
    
  }
}
