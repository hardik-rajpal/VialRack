import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  ngOnInit(){
    // setTimeout(() => {
    //   this.googleService.getDocumentList().then((posts)=>{
    //     console.log(posts)
    //   })
    // }, 4000);
  }
}
