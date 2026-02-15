import { Component, OnInit } from '@angular/core';
import { ComboBoxComponent } from "../comboBox/comboBox.component";
import { Tools } from '../../service/Tools.service';

@Component({
  selector: 'app-LanguageControl',
  templateUrl: './LanguageControl.component.html',
  styleUrls: ['./LanguageControl.component.css'],
  imports: [ComboBoxComponent]
})
export class LanguageControlComponent implements OnInit {
  LanguageSoruce: Array<any> = []
  selectedLang: any = null;
  constructor(private _myTools: Tools) { }

  async ngOnInit() {

    this.LanguageSoruce = await this._myTools.Network._httpClient.get<any>(`Data/Language.json`).toPromise();
    this.selectedLang = this.LanguageSoruce.find(x => x.select == true);
    console.log(this.selectedLang)
  }
  selectLng(event: any) {
 
  }

}
