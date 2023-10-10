import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams,HttpContext} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
/*
Sample response:
{
  "name": "songs.json",
  "path": "VialRack/songs.json",
  "sha": "e281f19253bfa6b98d868272331790e3459602a6",
  "size": 348,
  "url": "https://api.github.com/repos/hardik-rajpal/gitdb/contents/VialRack/songs.json?ref=main",
  "html_url": "https://github.com/hardik-rajpal/gitdb/blob/main/VialRack/songs.json",
  "git_url": "https://api.github.com/repos/hardik-rajpal/gitdb/git/blobs/e281f19253bfa6b98d868272331790e3459602a6",
  "download_url": "https://raw.githubusercontent.com/hardik-rajpal/gitdb/main/VialRack/songs.json",
  "type": "file",
  "content": "<base 64 content here>",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/hardik-rajpal/gitdb/contents/VialRack/songs.json?ref=main",
    "git": "https://api.github.com/repos/hardik-rajpal/gitdb/git/blobs/e281f19253bfa6b98d868272331790e3459602a6",
    "html": "https://github.com/hardik-rajpal/gitdb/blob/main/VialRack/songs.json"
  }
}
*/
export class GitdbService {

  apiBase:string= 'https://api.github.com/repos/hardik-rajpal/gitdb/contents/'
  dbs = {
    vialrackSongs:'/VialRack/songs.json'
  }

  constructor(private http:HttpClient) { }
  getVialRackSongs(){
    const fileApiUrl = this.apiBase + this.dbs.vialrackSongs;
    return this.http.get(fileApiUrl);
  }
}
