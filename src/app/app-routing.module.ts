import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getAllRoutes } from 'src/data/navigation.rtl';

const routes: Routes = getAllRoutes();
console.log(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
