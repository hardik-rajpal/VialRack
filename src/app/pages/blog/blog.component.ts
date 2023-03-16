import { Component } from '@angular/core';
import { HrubService } from 'src/app/services/hrub.service';
export interface blogPost{
  title:string;
  publishedLink:string;
  tags:string[]
  summary:string;
  docId:string;
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
    // this.hrubService.getBlogs().subscribe((data)=>{
      const data = dummyPosts;
      console.log(data)
      this.allBlogPosts = data as blogPost[];
      this.filteredBlogPosts = data as blogPost[]
      this.dataLoaded = true;
    // })
  }
  goToPost(id:string){
    window.location.href = 'blog/'+id;
  }
}
export const dummyPosts = [
  {
      "title": "A Quiet Kid’s Say on Ask Away.docx",
      "summary": "A classroom scene with characters borrowed from British Media.",
      "publishedLink": "https://docs.google.com/document/d/1Amd8tns63RBEVbLH461KxAZtB05gFNXe/pub?embedded=true",
      "docId":"1Amd8tns63RBEVbLH461KxAZtB05gFNXe",
      "tags": [
          "funnyish",
          "opinion"
      ]
  },
  {
      "title": "Gunmen and Gunwomen.docx",
      "summary": "",
      "publishedLink": "https://docs.google.com/document/d/10vybzvl1om3zWx9e2SgE_0D_m6PdtB8j/pub?embedded=true",
      "docId":"10vybzvl1om3zWx9e2SgE_0D_m6PdtB8j",
      "tags": []
  },
  {
      "title": "Daivik Gellaboina",
      "summary": "",
      "publishedLink": "https://docs.google.com/document/d/1IbHizFRABxP5xoSg9BfybuhBljGSULTtDmxfXemkHL8/pub?embedded=true",
      "docId":"1IbHizFRABxP5xoSg9BfybuhBljGSULTtDmxfXemkHL8",
      "tags": []
  },
  {
      "title": "Online Education",
      "summary": "",
      "publishedLink": "https://docs.google.com/document/d/1UrvO5uBoYCQJGmz3SwoJ2EvCbg_EBAsBrzW2ee14UWo/pub?embedded=true",
      "docId":"1UrvO5uBoYCQJGmz3SwoJ2EvCbg_EBAsBrzW2ee14UWo",
      "tags": []
  },
  {
      "title": "The Agony of Um",
      "summary": "",
      "publishedLink": "https://docs.google.com/document/d/1xdFOkp3etfDqTA8lHzDLcXI4ywfBC439367w7dE5Hwc/pub?embedded=true",
      "docId":"1xdFOkp3etfDqTA8lHzDLcXI4ywfBC439367w7dE5Hwc",
      "tags": []
  }
]