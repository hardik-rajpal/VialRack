import { Injectable } from '@angular/core';
import {google} from 'googleapis';
import {drive_v3} from 'googleapis/build/src/apis/drive/v3'
// import {} from '@types/gapi'
export interface BlogPost{
  title:string;
  publishedLink:string;
}
const blogReaderDetails = {
  email:'vialrackblogger@kytube-42.iam.gserviceaccount.com',
  privateKey:'-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmJGP8RF2TdcI7\ndXRiBMjQ2zNo8Y5gM4OMAGzkoULOOYPlrwcSodFEIN739kX8Dw/C8GdqIWd6cCVA\nDpeWvSo4Q+lZJw7vDaQ0cC/rUGQ9Q7TPy16hDDIrCAQ+t5Q04V0THJaFWVzNaQqC\nqZ2LSXqcP1fz0m9c3fwfEPtT3EwfgKR/Xiix3V909Zcw5g2h3TQR9nvJyD1q5pQY\ngaU5BTFVcWMTwDTpUhnfsr2le6fHr0Q3s19Th37g7UQanqyGmRe0PSwYP/Bohwvx\nkup19Sv5Gf/iTa2Vo9nb5C71/oTW2civ9bEZduMP14WRpwknfl2LmmIjN32Xr8yX\nvp5xjgUdAgMBAAECggEAR0sFVrqVdxIIo5AevXL1I150nJtPL6vbTofeMmuaqbjX\nhweI3u9uR7BdTYUx+dwStOGJVur3pvwZl/fLB8WrqNJHf1i52U3+wPvFLFJmeT2l\nCKfptuzvWDTL8YfAQsLUOD/DvXwfzQs+ldwn/R2uTf8GhFuwKucc6c3VM2KsjbVq\nDTsNKCNwMY4INYc8BdcrXI77M3ougZMSOSQB9xATY6yUYU9cLm6fpGHCCf5Fohkr\nGk5/M1zYCqvE5uGKucfYhTIf0e3M+mm5YgoF+2WrwV05zlvHMwrzvNNSykaf8ZW3\nlDBktsJlg+y8AZys7MZ3mImNDh2TpGMnVQVQPh1odwKBgQDfpg5Th+ruXcTXicbY\njhtnL1OIA1K2bgAY/B6OTP/Vj3b87CZnrMAYhUlhGaeNmBojCUUk3d6y3adMiOVo\nf2rC7kwhkx2S8nrhcXVXFDk7CU+oDaEF2HVA/Ftj7iTnNfzQOjiMNEal+ggx/mR2\nhJwm3V06Ykxb4TLTedOegj0QAwKBgQC+LM73dTJGFC4IlfQ/6eUeRf9femZX9ZSt\nqHi1UZCbpaT5x5DworjGQG6zfv62YaRUcNYW3jdkaTqelfKw9N/HQdGgWv/wMgvJ\nGaTAQFfD9VIXKqbcUdnyDZTbrLYW0wBOmSQKhuXyPwouyDzwDCbu/Vocdt03IfJf\ndxgweQxcXwKBgDGT3hkmSC4PG1OsdygKWIjHNP0xv2QxflQLj7p71zrAUuA+eUUC\nRpMo+NtNlJcO4LxjkbBafsOn3y5YKoK/vCr6KGZI9oVcu2C+hgSHtygfKElYvBlP\noq6FQr0kTYnzrdd7EI4ECKVCiA6NFjgvrW3wJHqMz+COS3YVy5OXy3GBAoGANfV6\nx+W93Ppu0UrS4auYsc1Ely+giEaK5/cMQM4izLbkJ2cDbfONn9q6Tj2zQcZUnQzj\nAdwNNXVSB5seIC1qrRu0wd3wDpP0mhunjlDzVgtuPlqAu7SRtUc7PFU12SYHSUXU\nXxRFfEV8uydfevDHvzmtbrQfMjx0i7e76kz+P9sCgYAC+I3atZ+AqH2DAHXSYksP\n5bOl8CeYP9o3QPbTSNY0CjNn/bWvnoOElEqwjswsK5MqOnfr3+XveUSz3E5AbXB8\ndK1WCGLavcbV+gLYK0jd4hELinnuy/MSWTd56VC5NBvSuBzMn7yIRauWVAV0rDB8\ndIKMdRVbp4UU4pFajEhyAQ==\n-----END PRIVATE KEY-----\n',
  scope:['https://www.googleapis.com/auth/drive.readonly'],
  blogFolderId:'1oKO2LteQho8BY7bHiSwjNxT9F_rRuNhS',
  shortcutMimeType:'application/vnd.google-apps.shortcut'
}
@Injectable({
  providedIn: 'root'
})

export class GoogleService {
  drive!:drive_v3.Drive;
  authorize() {
    
    return new google.auth.JWT(
      blogReaderDetails.email,
      undefined,
      blogReaderDetails.privateKey,
      blogReaderDetails.scope
    )
  }
  getPublishedLink(docid:string){
    //future work, allow this to publish site maybe.
    return `https://docs.google.com/document/d/${docid}/pub`;
  }
  constructor() {
    const authobj = this.authorize();
    this.drive = google.drive({
      auth:authobj,
      version:'v3'
    })

  }
  
  async getDocumentList(){
    const postFiles = (await this.drive.files.list({
      q:`'${blogReaderDetails.blogFolderId}' in parents`,
      fields:'nextPageToken, files(id, name, createdTime, modifiedTime, mimeType, contentHints)',
    })).data
    
    const posts:BlogPost[] =await Promise.all(postFiles.files!.map(async(file)=>{
      const post:BlogPost = {
        publishedLink:this.getPublishedLink(file.id!),
        title:file.name!
      };
      if(file.mimeType===blogReaderDetails.shortcutMimeType){
        const shortcutDetails = (await this.drive.files.get({
          fileId:file.id!,
          fields:'shortcutDetails',
          supportsAllDrives:true
        })).data.shortcutDetails;
        post.publishedLink = this.getPublishedLink(shortcutDetails?.targetId!);
      }
      return post;
    }))
    return posts;
  }
}
