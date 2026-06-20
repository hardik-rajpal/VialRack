import { linkSpec } from "./utils.rtl";

export interface headerSpec{
    logo:string;
    title:string;
    subtitle?:string;
}
export interface footerSpec{
    text:string;
    links:linkSpec[]
}
export const headerData:headerSpec = {
    logo:'assets/top.jpg',
    title:'Shelved Life',
    subtitle:'things I make & love, arranged shelf by shelf'
}

export const footerData:footerSpec = {
    text:'© Copyrights Hardik Rajpal, I think that\'s how it works.',
    links:[
        {
            label:'Email Me',
            target:'mailto:hardikraj08@gmail.com',
            type:'email'
        },
        {
            label:'Home',
            target:'/',
        }
    ]
}