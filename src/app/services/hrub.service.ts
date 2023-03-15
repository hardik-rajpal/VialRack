import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HrubService {
  apiBase:string = ((String(process.env['NODE_ENV']))=='dev')?'http://localhost:3000/':'https://hrub.hardikrajpal.repl.co/gapis/blogposts/';
  constructor() {
    console.log(this.apiBase)
  }
}
