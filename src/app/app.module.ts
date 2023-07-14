import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShelfstackComponent } from './components/parts/shelfstack/shelfstack.component';
import { ShelfComponent } from './components/parts/shelf/shelf.component';
import { ImglinkComponent } from './components/imglink/imglink.component';
import { BlogComponent } from './pages/blog/blog.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { PlaqueComponent } from './components/parts/plaque/plaque.component';
import { BlogpostComponent } from './pages/blogpost/blogpost.component';
import { SafePipe } from 'src/safe.pipe';
import { ThoughtBoardComponent } from './pages/thought-board/thought-board.component';
import { ThoughtComponent } from './comps/thought/thought.component';
import { JsonVisualizerComponent } from './pages/json-visualizer/json-visualizer.component';
import { JsonTableComponent } from './comps/json-table/json-table.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    ShelfstackComponent,
    ShelfComponent,
    ImglinkComponent,
    BlogComponent,
    HomeComponent,
    PlaqueComponent,
    BlogpostComponent,
    SafePipe,
    ThoughtBoardComponent,
    ThoughtComponent,
    JsonVisualizerComponent,
    JsonTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
