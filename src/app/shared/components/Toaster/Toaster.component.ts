import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Tools } from '../../service/Tools.service';
@Component({
  selector: 'app-Toaster',
  templateUrl: './Toaster.component.html',
  styleUrls: ['./Toaster.component.css'],
  standalone: true,
  imports: [ToastModule],
  providers: [MessageService]
})
export class ToasterComponent implements OnInit {

  constructor(private messageService: MessageService,private _tools:Tools) { }

  ngOnInit() {
    this._tools.Toaster=this;
    this._tools.Network.Toaster=this;
  }
  showSuccess(detail:string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: detail });
  }

  showInfo(detail:string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: detail});
  }

  showWarn(detail:string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: detail });
  }

  showError(detail:string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
  }

  showContrast(detail:string) {
    this.messageService.add({ severity: 'contrast', summary: 'Error', detail: detail });
  }

  showSecondary(detail:string) {
    this.messageService.add({ severity: 'secondary', summary: 'Info', detail: detail });
  }
}