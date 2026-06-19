import { Routes } from "@angular/router";
import { miscRoutes, otherRoutes } from "./miscroutes.rtl";
import { objectToVals, parseRouteSpec, parseRoutes, routeSpec } from "./utils.rtl";
import { PlaceholderPageComponent } from "src/app/pages/placeholder-page/placeholder-page.component";
import { HomePageComponent } from "src/app/comps/home-page/home-page.component";
import { InPraiseOfSongsPageComponent } from "src/app/comps/in-praise-of-songs-page/in-praise-of-songs-page.component";
import { InPraiseOfMoviesPageComponent } from "src/app/comps/in-praise-of-movies-page/in-praise-of-movies-page.component";
import { InPraiseOfShowsPageComponent } from "src/app/comps/in-praise-of-shows-page/in-praise-of-shows-page.component";
import { InPraiseOfOthersPageComponent } from "src/app/comps/in-praise-of-others-page/in-praise-of-others-page.component";
import { BlogComponent } from "src/app/pages/blog/blog.component";
import { BlogpostComponent } from "src/app/pages/blogpost/blogpost.component";
import { ThoughtBoardComponent } from "src/app/pages/thought-board/thought-board.component";
import { HomeComponent } from "src/app/pages/home/home.component";
import { PlaylistsComponent } from "src/app/pages/playlists/playlists.component";
import { LiteraryWorksComponent } from "src/app/pages/literary-works/literary-works.component";

export const NavBarRoutes: routeSpec[] = [
    {
        label:'Home',
        route:'',
        component:HomePageComponent
    }
]
export const footerRoutes:routeSpec[] = [
    
]
export const HomePageRoutes = [
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
      path:'literature',component:LiteraryWorksComponent
    },
    {
      path:'inpraiseof/songs',component:InPraiseOfSongsPageComponent
    },
    {
      path:'inpraiseof/playlists',component:PlaylistsComponent
    },
    {
      path:'',component:HomeComponent
    }
  ];;
export function getAllRoutes():Routes{
    const routes = parseRoutes(NavBarRoutes)
    routes.push(...footerRoutes.map((routespec,index,[])=>parseRouteSpec(routespec)))
    routes.push(...objectToVals(otherRoutes).map((routespec,index,[])=>parseRouteSpec(routespec)))
    routes.push(...miscRoutes.map((routespec,index,[])=>parseRouteSpec(routespec)));
    routes.push(...HomePageRoutes)
    // routes.push({
    //     path:'**',
    //     redirectTo:''
    // })
    console.log(routes)
    return routes
}
