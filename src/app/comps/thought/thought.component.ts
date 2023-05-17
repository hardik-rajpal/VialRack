import { Component, Input,OnInit } from '@angular/core';
import { Thought } from 'src/app/pages/thought-board/thought-board.component';

@Component({
  selector: 'app-thought',
  templateUrl: './thought.component.html',
  styleUrls: ['./thought.component.css']
})
export class ThoughtComponent implements OnInit {
  @Input() thought!:Thought
  thoughtclass:string = 'quoteholder q0'
  numStyles = 4;
  ngOnInit(): void {
    if(this.thought){
      let rn = Math.floor(Math.random()*100)%this.numStyles;
      while(rn==2){
        rn = Math.floor(Math.random()*100)%this.numStyles;
      }
      this.thoughtclass = this.thoughtclass.slice(0,-1)+(rn).toString()
    }
  }
}
