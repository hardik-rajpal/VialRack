import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlaceholderPageComponent } from './pages/placeholder-page/placeholder-page.component';
import { AppRoutingModule } from './app-routing.module';
import { ParaspecboxComponent } from './comps/paraspecbox/paraspecbox.component';
import { FlashboxComponent } from './comps/flashbox/flashbox.component';
import { VersatileboxComponent } from './comps/versatilebox/versatilebox.component';
import { MiscPageComponent } from './pages/misc-page/misc-page.component';
import { SitefooterComponent } from './comps/sitefooter/sitefooter.component';
import { SiteheaderComponent } from './comps/siteheader/siteheader.component';
import { LinkboxComponent } from './comps/linkbox/linkbox.component';
import { NavbarComponent } from './comps/navbar/navbar.component';
import { SafePipe } from './safe.pipe';
import { VersatilePageComponent } from './comps/versatile-page/versatile-page.component';
import { HomePageComponent } from './comps/home-page/home-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ThoughtBoardComponent } from './pages/thought-board/thought-board.component';
import { JsonTableComponent } from './comps/json-table/json-table.component';
import { ShelfComponent } from './components/parts/shelf/shelf.component';
import { ShelfstackComponent } from './components/parts/shelfstack/shelfstack.component';
import { ImglinkComponent } from './components/imglink/imglink.component';
import { ThoughtComponent } from './comps/thought/thought.component';
import { InPraiseOfMoviesPageComponent } from './comps/in-praise-of-movies-page/in-praise-of-movies-page.component';
import { InPraiseOfSongsPageComponent } from './comps/in-praise-of-songs-page/in-praise-of-songs-page.component';
import { InPraiseOfOthersPageComponent } from './comps/in-praise-of-others-page/in-praise-of-others-page.component';
import { InPraiseOfShowsPageComponent } from './comps/in-praise-of-shows-page/in-praise-of-shows-page.component';
import { FormsModule } from '@angular/forms';
import { PlaqueComponent } from './components/parts/plaque/plaque.component';
import { JsonVisualizerComponent } from './pages/json-visualizer/json-visualizer.component';
import { BlogpostComponent } from './pages/blogpost/blogpost.component';
import { BlogComponent } from './pages/blog/blog.component';
import { HttpClientModule } from '@angular/common/http';
import { SongboxComponent } from './comps/songbox/songbox.component';

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    ParaspecboxComponent,
    FlashboxComponent,
    VersatileboxComponent,
    PlaceholderPageComponent,
    MiscPageComponent,
    SitefooterComponent,
    SiteheaderComponent,
    LinkboxComponent,
    NavbarComponent,
    PlaqueComponent,
    BlogComponent,
    VersatilePageComponent,
    HomePageComponent,
    JsonVisualizerComponent,
    HomeComponent,
    ThoughtBoardComponent,
    JsonTableComponent,
    BlogpostComponent,
    ShelfComponent,
    ShelfstackComponent,
    ImglinkComponent,
    ThoughtComponent,
    InPraiseOfMoviesPageComponent,
    InPraiseOfSongsPageComponent,
    InPraiseOfOthersPageComponent,
    InPraiseOfShowsPageComponent,
    SongboxComponent,
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
