import { Component, Input,OnInit,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit{
  @Input() absPos:number[]=[];
  divRefStyle:{[kclass:string]:any} = {
    'display': 'flex',
  'flex-direction': 'column',
  'align-items': 'center',
  'align-content': 'flex-end',
  'justify-content': 'flex-end',
  'margin-top': '10px',
  }
  ngOnInit(){
    if(this.absPos.length===2){
      this.divRefStyle['position'] = 'absolute';
      this.divRefStyle['top'] = this.absPos[1].toString()+'px';
      this.divRefStyle['left'] = this.absPos[0].toString()+'px';
    }
  }
}
