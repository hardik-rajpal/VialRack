import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.css']
})
export class BlogpostComponent implements OnInit{
  embedLink:string = '';
  dataLoaded:boolean = false;
  getPublishedLink(docid:string,embed=true){
    return `https://docs.google.com/document/d/${docid}/pub`+(embed?'?embedded=true':'');
  }
  constructor(private route:ActivatedRoute){
    route.params.subscribe((params:any)=>{
      this.embedLink =  this.getPublishedLink(params.docid)
      console.log(this.embedLink)
      this.dataLoaded = true;
    });
  }
  ngOnInit(){

  }
}
