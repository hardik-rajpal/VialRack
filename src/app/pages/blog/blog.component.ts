import { Component } from '@angular/core';
import { HrubService } from 'src/app/services/hrub.service';
export interface blogPost{
  title:string;
  publishedLink:string;
  tags:string[]
  summary:string;
}
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  allBlogPosts:blogPost[] = [];
  dataLoaded:boolean = false;
  filteredBlogPosts:blogPost[] = [];
  activePost:blogPost|null = null;
  constructor(private hrubService:HrubService){
    this.hrubService.getBlogs().subscribe((data)=>{
      console.log(data)
      this.allBlogPosts = data as blogPost[];
      this.filteredBlogPosts = data as blogPost[]
      this.dataLoaded = true;
    })
  }
}
