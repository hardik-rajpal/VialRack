import { Component, Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-shelfstack',
  templateUrl: './shelfstack.component.html',
  styleUrls: ['./shelfstack.component.css']
})
export class ShelfstackComponent implements OnInit{
  @Input() width:number=100;
  @Input() absPos:number[] = [];
  divRefStyle:{[kclass:string]:any} = {

  }
  ngOnInit(){
    if(this.absPos.length===2){
      this.divRefStyle['position'] = 'absolute';
      this.divRefStyle['bottom'] = this.absPos[1].toString()+'px';
      this.divRefStyle['left'] = this.absPos[0].toString()+'px';
    }
  }
}
