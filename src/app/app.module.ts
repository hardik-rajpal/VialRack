import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShelfstackComponent } from './components/parts/shelfstack/shelfstack.component';
import { ShelfComponent } from './components/parts/shelf/shelf.component';

@NgModule({
  declarations: [
    AppComponent,
    ShelfstackComponent,
    ShelfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
