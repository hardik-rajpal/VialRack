import { Component } from '@angular/core';
export interface Thought{
  thought:string;
  context?:string;
  style?:string;
  image?:string;
}
@Component({
  selector: 'app-thought-board',
  templateUrl: './thought-board.component.html',
  styleUrls: ['./thought-board.component.css']
})
export class ThoughtBoardComponent {
  thoughts:Thought[] = [
    {
      thought:'Let us revel in our passing fancies, for they are fleeting!'
    },
    {
      thought:'Bobbleheads are a penny a dozen.',
      context:'In the spirit of encouraging analysis and the whole-hearted pursuit of logical answers'
    },
    {
      thought:`If they don't feel like a great catch, maybe you're the one in the net.`
    },
  ]
}
