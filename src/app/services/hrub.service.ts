import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams,HttpContext} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HrubService {
  apiBase:string = 'http://localhost:3000';
  // apiBase:string  = 'https://hrub.hardikrajpal.repl.co/gapis/blogposts/';
  constructor(private http:HttpClient) {
    console.log(this.apiBase)
  }
  getBlogs(){
    return this.http.get(this.apiBase+'/gapis/blogposts/')
  }
}
