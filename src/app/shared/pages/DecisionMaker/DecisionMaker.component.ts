import { Component, OnInit } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { Tools } from '../../service/Tools.service';
import { Button } from "primeng/button";

@Component({
  selector: 'app-DecisionMaker',
  templateUrl: './DecisionMaker.component.html',
  styleUrls: ['./DecisionMaker.component.css'],
  imports: [Dialog, Button]
})
export class DecisionMakerComponent implements OnInit {

  MESSAGE: string = "";
  Choses: Array<string> = [];
  visable: boolean = false;
  constructor(private _tools: Tools) { }

  ngOnInit() {
    this._tools.DecisionMaker = this
  }
  Show(_MESSAGE: string, _Choses: Array<string>): Promise<string | null> {
    this.visable = true;
    this.MESSAGE = _MESSAGE;
    this.Choses = _Choses;
    return new Promise((resolve) => {
      this.Select = (Chose) => {
        this.visable = false
        resolve(Chose)
      }
      this.Cancel = () => {
        this.visable = false
        resolve(null)
      }
    })
  }
  Select(Chose: string) {
    this.visable = false;
  }
  Cancel() {
    this.visable = false;
  }

}
