import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams,HttpContext} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HrubService {
  // apiBase:string = 'http://localhost:3000';
  apiBase:string  = 'https://hrub.hardikrajpal.repl.co';
  constructor(private http:HttpClient) {
    console.log(this.apiBase)
  }
  getBlogs(){
    return this.http.get(this.apiBase+'/gapis/blogposts')
  }
  getBlogDetails(id:string){
    return this.http.get(this.apiBase+'/gapis/blogposts?id='+id)
  }
}
