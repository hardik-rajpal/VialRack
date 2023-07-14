import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogpostComponent } from './pages/blogpost/blogpost.component';
import { HomeComponent } from './pages/home/home.component';
import { ThoughtBoardComponent } from './pages/thought-board/thought-board.component';
import { JsonVisualizerComponent } from './pages/json-visualizer/json-visualizer.component';

const routes: Routes = [
  {
    path:'blog',children:[
      {
        path:'',component:BlogComponent,},
        {path:':docid',component:BlogpostComponent}
    ]
  },
  {
    path:'thoughts',component:ThoughtBoardComponent
  },
  {
    path:`jsonVisualizer`,component:JsonVisualizerComponent
  },
  {
    path:'',component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
