import { Component, OnInit,ViewChildren,QueryList } from '@angular/core';
import { ShelfstackComponent } from '../../components/parts/shelfstack/shelfstack.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  title = 'VialRack';
  numstacks = 1;
  autoOrgStackWidth=100;
  @ViewChildren('shelfstack') shelves!: QueryList<ShelfstackComponent>;
  constructor(){
  }
  ngOnInit(){
    // setTimeout(() => {
    //   this.googleService.getDocumentList().then((posts)=>{
    //     console.log(posts)
    //   })
    // }, 4000);
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
