import { Component,ElementRef,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrubService } from 'src/app/services/hrub.service';
import { blogPost } from '../blog/blog.component';

@Component({
  selector: 'app-blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.css']
})
export class BlogpostComponent implements OnInit{
  embedLink:string = '';
  dataLoaded:boolean = false;
  blogpost?:blogPost;
  getPublishedLink(docid:string,embed=true){
    return `https://docs.google.com/document/d/${docid}/pub`+(embed?'?embedded=true':'');
  }

  constructor(private route:ActivatedRoute, private hrubService:HrubService){
    route.params.subscribe((params:any)=>{
      this.embedLink =  this.getPublishedLink(params.docid)
      this.hrubService.getBlogDetails(params.docid).subscribe((details)=>{
        this.blogpost = details as blogPost;
        this.dataLoaded = true;
      })
    });
  }
  ngOnInit(){

  }
  goToPosts(){
    window.location.href = 'blog'
  }
}
