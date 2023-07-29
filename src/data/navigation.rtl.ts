import { Routes } from "@angular/router";
import { miscRoutes, otherRoutes } from "./miscroutes.rtl";
import { objectToVals, parseRouteSpec, parseRoutes, routeSpec } from "./utils.rtl";
import { PlaceholderPageComponent } from "src/app/pages/placeholder-page/placeholder-page.component";
import { HomePageComponent } from "src/app/comps/home-page/home-page.component";
import { InPraiseOfSongsPageComponent } from "src/app/comps/in-praise-of-songs-page/in-praise-of-songs-page.component";
import { InPraiseOfMoviesPageComponent } from "src/app/comps/in-praise-of-movies-page/in-praise-of-movies-page.component";
import { InPraiseOfShowsPageComponent } from "src/app/comps/in-praise-of-shows-page/in-praise-of-shows-page.component";
import { InPraiseOfOthersPageComponent } from "src/app/comps/in-praise-of-others-page/in-praise-of-others-page.component";

export const NavBarRoutes: routeSpec[] = [
    {
        label:'Home',
        route:'',
        component:HomePageComponent
    },
    {
        label:'Menu (A wood)',
        children:[
            {
                label:'Path 1 (More Travelled By)',
                route:'https://youtu.be/dQw4w9WgXcQ',
            },
            {
                label:'Path 2 (Less Travelled By)',
                route:'https://youtu.be/xvFZjo5PgG0'
            }
        ]
    },
    {
        label:`Robert Frost Poems`,
        children:[
            {
                label:`Stopping by...`,
                route:`https://www.poetryfoundation.org/poems/42891/stopping-by-woods-on-a-snowy-evening`
            },
            {
                label:`The road not taken`,
                route:`https://www.poetrybooks.co.uk/blogs/news/poem-a-day-the-road-not-taken`
            }
        ]
    },
    {
        label:`In Praise Of`,
        children:[
            {
                label:`Songs`,
                route:`inpraiseof/songs/`,
                component:InPraiseOfSongsPageComponent
            },
            {
                label:`Movies`,
                route:`inpraiseof/movies/`,
                component:InPraiseOfMoviesPageComponent
            },
            {
                label:`Shows`,
                route:`inpraiseof/shows/`,
                component:InPraiseOfShowsPageComponent
            },
            {
                label:`Others`,
                route:`inpraiseof/others/`,
                component:InPraiseOfOthersPageComponent
            }
        ]
    }
]
export const footerRoutes:routeSpec[] = [
    
]
export function getAllRoutes():Routes{
    const routes = parseRoutes(NavBarRoutes)
    routes.push(...footerRoutes.map((routespec,index,[])=>parseRouteSpec(routespec)))
    routes.push(...objectToVals(otherRoutes).map((routespec,index,[])=>parseRouteSpec(routespec)))
    routes.push(...miscRoutes.map((routespec,index,[])=>parseRouteSpec(routespec)));
    routes.push({
        path:'**',
        redirectTo:''
    })
    return routes
}
