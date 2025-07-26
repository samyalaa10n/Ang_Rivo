import { Component, OnInit } from '@angular/core';
import { Tools } from '../../service/Tools.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-Confermation',
  templateUrl: './Confermation.component.html',
  styleUrls: ['./Confermation.component.css'],
  imports: [ConfirmDialog],
  providers: [ConfirmationService],
  standalone: true,
})
export class ConfermationComponent implements OnInit {

  constructor(private _tools: Tools, private _ConfirmMessage: ConfirmationService) { }

  ngOnInit() {
    this._tools.Confermation = this;
  }
  show(message: string="هل انت متأكد من الحذف", header: string = 'تأكيد', acceptLabel: string = "نعم", rejectLabel: string = "لا"): Promise<boolean> {
    return new Promise((resolve) => {
      this._ConfirmMessage.confirm(
        {
          acceptLabel: acceptLabel,
          rejectLabel: rejectLabel,
          header: header,
          message: message,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        });
    })

  }


}
