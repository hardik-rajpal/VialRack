import { Component, OnInit,ViewChildren,QueryList } from '@angular/core';
import { ShelfstackComponent } from './components/parts/shelfstack/shelfstack.component';
import { GoogleService } from './services/google.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'VialRack';
  numstacks = 1;
  autoOrgStackWidth=100;
  @ViewChildren('shelfstack') shelves!: QueryList<ShelfstackComponent>;
  constructor(private googleService:GoogleService){}
  ngOnInit(){
    this.googleService.getDocumentList().then((posts)=>{
      console.log(posts)
    })
  }
  ngAfterViewInit(){
    this.numstacks = (this.shelves.filter((item,index,[])=>item.absPos.length!==2)).length;
    setTimeout(() => {
      this.autoOrgStackWidth = 100/this.numstacks;
      console.log(this.autoOrgStackWidth)
      
    }, 500);
  }
  // getshelfstackwidth(el?:HTMLElement){
  //   return 100/this.numstacks;
  // }
}
