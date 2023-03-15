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
@NgModule({
  declarations: [
    AppComponent,
    ShelfstackComponent,
    ShelfComponent,
    ImglinkComponent,
    BlogComponent,
    HomeComponent,
    PlaqueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
