import { Component, OnInit,ViewChildren,QueryList } from '@angular/core';
import { ShelfstackComponent } from './components/parts/shelfstack/shelfstack.component';

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
  ngOnInit(){
    // let children:HTMLCollectionOf<Element> = document.querySelector('.main')?.children!;
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
