import { Component } from '@angular/core';
import { HrubService } from 'src/app/services/hrub.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  constructor(private hrubService:HrubService){
    
  }
}
