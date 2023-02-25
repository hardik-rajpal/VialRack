import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'VialRack';
  numshelves = 1;
  ngOnInit(){
    this.numshelves=document.querySelector('.main')?.childNodes.length!
  }
  getshelfstackwidth(el?:HTMLElement){
    return 100/this.numshelves;
  }
}
