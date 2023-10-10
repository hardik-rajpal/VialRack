import { Component } from '@angular/core';
import { GitdbService } from 'src/app/services/gitdb.service';
export interface songDataSpec{
  carousel:number[];
  groups:groupSpec[];//title=>song ids list
  songs:songSpec[];
}
export interface groupSpec{
  title:string;
  text:string;
  songs:number[];
}
export interface songSpec{
  id:number;
  link:string;
  title:string;
  text:string;
}
@Component({
  selector: 'app-in-praise-of-songs-page',
  templateUrl: './in-praise-of-songs-page.component.html',
  styleUrls: ['./in-praise-of-songs-page.component.css']
})
export class InPraiseOfSongsPageComponent {
  constructor(private gitdb:GitdbService){}
  data:songDataSpec|null = null;
  base64ToText(base64:string) {
    // Decode the Base64 string
    const binaryString = atob(base64);
  
    // Convert the binary string to text (UTF-8)
    const text = new TextDecoder('utf-8').decode(new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i)));
  
    return text;
  }
  ngOnInit(){
    this.gitdb.getVialRackSongs().subscribe((data:any)=>{
      const base64data = data["content"];
      const jsondata = this.base64ToText(base64data);
      console.log(jsondata);
      let tempData:songDataSpec = JSON.parse(jsondata);
      let identifier, parts;
      for(let song of tempData.songs){
        parts = song.link.split('/');
        identifier = parts[parts.length-1];
        song.link =`https://www.youtube.com/embed/${identifier}`
      }
      this.data = tempData;
      
    })
  }
}
