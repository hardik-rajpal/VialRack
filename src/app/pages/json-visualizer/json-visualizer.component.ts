import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-json-visualizer',
  templateUrl: './json-visualizer.component.html',
  styleUrls: ['./json-visualizer.component.css']
})
export class JsonVisualizerComponent {
  modes:string[] = [
    'Regular',
    'JS Code'
  ]
  @ViewChild('textarea') textarea!:ElementRef<HTMLTextAreaElement>
  modeIndex:number = 0;
  invalidJson:boolean = false;
  jsonText:string = `
    [
      {
      "name":"Hardik Rajpal"
      }
    ]
  `;
  json:any = []
  ngAfterViewInit(){
    this.textarea.nativeElement.addEventListener('keydown',(e)=>{this.onKeyPress(e);});
  }
  ngOnInit(){
    this.updateTable()
  }
  stringify(object:any,quotes:boolean=true){
    const json = JSON.stringify(object,null,'\t');  // {"name":"John Smith"}
    if(quotes){
      return json
    }
    else{
      const unquoted = json.replace(/"([^"]+)":/g, '$1:');
      return unquoted; 
    }
  }
  updateMode(mode:string){
    let object = this.json
    let updatedText='';
    if(mode=='Regular'){
      updatedText = this.stringify(object,true)
    }
    else if(mode=='JS Code'){
      updatedText = this.stringify(object,false)
    }
    this.jsonText = updatedText;
    this.modeIndex = this.modes.indexOf(mode)
  }
  onTabPress(){
    let element = this.textarea.nativeElement;
    let selStart = element.selectionStart;
    let selEnd = element.selectionEnd;
    element.value = element.value.substring(0,selStart)  +'\t' + element.value.substring(selEnd)
    element.selectionStart = selStart + 1;
    element.selectionEnd = selStart + 1;
  }
  onKeyPress(event:any){
    if(event.key==='Tab'){
      event.preventDefault()
      this.onTabPress()
    }
    else if (event.key==='Enter' && event.ctrlKey){
      event.preventDefault()
      this.textarea.nativeElement.blur()
      this.updateTable()
    }
  }
  parse(jsontext:string,withquotes:boolean=true):boolean{
    try{
      let parsedJson;
      if(withquotes){
        parsedJson = JSON.parse(jsontext)
      }
      else{
        parsedJson = eval(jsontext)
      }
      this.invalidJson = false;
      this.json = parsedJson;
      return true
    }
    catch(e){
      this.invalidJson = true;
      return false;
    }
  }
  updateTable(){
    let parsedJson:boolean;
    parsedJson = this.parse(this.jsonText,this.modes[this.modeIndex]==='Regular');
    // if(parsedJson){
      
    // }
  }
}
