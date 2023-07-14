import { Component,Input,OnInit } from '@angular/core';
export interface tableRow{
  key:string;
  type: 'recurse' | 'base';
  value:any;
}
export interface listData {
  type: 'recurse' | 'base';
  data: any[];
}
@Component({
  selector: 'app-json-table',
  templateUrl: './json-table.component.html',
  styleUrls: ['./json-table.component.css']
})
export class JsonTableComponent implements OnInit{
  @Input() json:{[key:string]:any}|any[]={
    "word":"definition"
  }
  dataType:'table'|'list' = 'table';
  tabularData:tableRow[] = [];
  listData:listData = {
    type:'base',
    data:[]
  };
  isArray(x:any):boolean{
    let type = typeof x
    if(type==="object"){
      if(Array.isArray(x)){
        return true;
      }
    }
    return false;
  }
  isObject(x:any):boolean{
    let type = typeof x
    if(this.isArray(x)){return false;}
    if(type==="object"){
      return true;
    }
    return false;
  }
  
  populateTable(){
    this.tabularData = [];
    let object:{[key:string]:any} = (this.json) as {[key:string]:any};
    for(let key of Object.keys(object)){
      let value = object[key];
      let row:tableRow = {
        key:key,
        type:'base',
        value:value
      }
      if(this.isArray(value)||this.isObject(value)){
        row.type = 'recurse'
      }
      else{
        row.type = 'base'
      }
      this.tabularData.push(row)
    }
  }
  populateList(){
    //assume array objects all have the same type
    let array:any[] = this.json as any[];
    if(array.length===0){
      return;
    }
    let element = array[0];
    if(this.isObject(element) || this.isArray(element)){
      this.listData.type = 'recurse'
    }
    else{
      this.listData.type = 'base'
    }
    this.listData.data = array;
  }
  ngOnChanges(){
    if(this.isArray(this.json)){
      this.populateList();
      this.dataType = 'list';
    }
    else if(this.isObject(this.json)){
      this.populateTable();
      this.dataType = 'table';
    }
  }
  ngOnInit(){
    if(this.isArray(this.json)){
      this.populateList();
      this.dataType = 'list';
    }
    else if(this.isObject(this.json)){
      this.populateTable();
      this.dataType = 'table';
    }
  }
}
