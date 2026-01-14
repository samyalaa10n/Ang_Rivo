import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tools } from '../../service/Tools.service';
import { RequestOrder } from '../../Types/Request';
import { GalleriaModule } from 'primeng/galleria';
import { FileManagerComponent } from "../../components/FileManager/FileManager.component";
@Component({
  selector: 'app-ShowImages',
  templateUrl: './ShowImages.component.html',
  styleUrls: ['./ShowImages.component.css'],
  imports: [GalleriaModule, FileManagerComponent]
})
export class ShowImagesComponent implements OnInit {
  Request!: RequestOrder;
  images: any[] | undefined = [];
  constructor(private _ActiveRouter: ActivatedRoute, private _tools: Tools) { }
  ngOnInit() {
    this._ActiveRouter.queryParams.subscribe({
      next: async ({ Id }) => {
        if (Id == null) {
          return
        }
        var response = await this._tools.Network.getAsync<RequestOrder>("Requstes/GetByIdForImageOrder?id=" + Id) as RequestOrder;
        if (response?.ID > 0) {
          this.Request=response;
        }
      }
    })
  }
  


}
