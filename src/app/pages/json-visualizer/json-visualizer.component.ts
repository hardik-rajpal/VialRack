import { Component } from '@angular/core';

@Component({
  selector: 'app-json-visualizer',
  templateUrl: './json-visualizer.component.html',
  styleUrls: ['./json-visualizer.component.css']
})
export class JsonVisualizerComponent {
  invalidJson:boolean = false;
  jsonText:string = `
    [{
      "Name":"Hardik Rajpal"
    }]
  `;
  json:any = []
  ngOnInit(){
    this.updateTable()
  }
  updateTable(){
    console.log("updating")
    let parsedJson:any = {};
    try{
      parsedJson = JSON.parse(this.jsonText);
      this.invalidJson = false;
      this.json = parsedJson;
      console.log('parsed')
      console.log(this.json)
    }
    catch(e){
      console.log('invalid json')
      this.invalidJson = true;
    }
  }
}
