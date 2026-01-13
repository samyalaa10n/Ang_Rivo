import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tools } from '../../service/Tools.service';
import { RequestOrder } from '../../Types/Request';
import { GalleriaModule } from 'primeng/galleria';
import { Button } from "primeng/button";
@Component({
  selector: 'app-ShowImages',
  templateUrl: './ShowImages.component.html',
  styleUrls: ['./ShowImages.component.css'],
  imports: [Button, GalleriaModule]
})
export class ShowImagesComponent implements OnInit {

  constructor(private _ActiveRouter: ActivatedRoute, private _tools: Tools) { }
  images: any[] | undefined = [];
  ngOnInit() {
    this._tools.transfareSherdData.sherdMood = true;
    this._ActiveRouter.queryParams.subscribe({
      next: async ({ Id }) => {
        if (Id == null) {
          return
        }
        // /Resources/OrderImage
        //"[{\"id\":\"1768316832704-xkw3y5umj\",\"fileName\":\"13‏_1‏_20267f681809-bb82-454e-8cb9-059b3b7d9623.jpg\",\"fileSizeKB\":71,\"filePath\":\"OrderImage/13‏_1‏_20267f681809-bb82-454e-8cb9-059b3b7d9623.jpg\",\"uploadDate\":\"2026-01-13T15:07:12.704Z\",\"fileHint\":\"Test\"}]"
        var response = await this._tools.Network.getAsync<RequestOrder>("Requstes/GetById?id=" + Id) as RequestOrder;
        if (response?.ID > 0) {
          console.log(response)
          response.FILES
          if (response.FILES != "") {
            let files = JSON.parse(response.FILES) as Array<any>
            this.images = files.map(fl => {
              return { filePath: `${this._tools.Network.baseUrl}/Resources/${fl.filePath}` }
            })
          }

        }
      }
    })
  }
  


}
