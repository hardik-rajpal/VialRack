import { Component } from '@angular/core';

@Component({
  selector: 'app-json-visualizer',
  templateUrl: './json-visualizer.component.html',
  styleUrls: ['./json-visualizer.component.css']
})
export class JsonVisualizerComponent {
  json:any = [
    {
      title: `Launch of Digital Platforms & Women’s Economic Empowerment Project`,
      dateTime: `9.30 am to 1.30 pm, May 8, 2023`,
      venue: `Multipurpose Hall, India International Centre, New Delhi`,
      description: [],
      contact: `cecfee[at]isid.ac.in`
    },
    {
        title: `17th Annual Conference on Economic Growth and Development`,
        dateTime: `December 19-21, 2021`,
        venue: `Indian Statistical Institute, New Delhi`,
        description: [
            {
                text: `The Economics and Planning Unit at the Indian 
                Statistical Institute, Delhi will organize its 17th Annual 
                Conference on Economic Growth and Development.`
            }
        ],
        contact: `acegd.isi [at] gmail.com (Tridip Ray)`
    }
  ]
}
