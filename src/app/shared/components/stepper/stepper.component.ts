import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { StepConfigurationDirective } from './Step-Configuration.directive';
import { StepConfiguration, StepperConfiguration } from './stepper.configuration';
import { Component, ContentChildren, ElementRef, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
//import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  imports:[NgFor,NgClass,NgIf,NgTemplateOutlet,FontAwesomeModule,ProgressSpinnerModule,ButtonModule],
  standalone:true,
})
export class StepperComponent {
  faArrowLeft = faArrowLeft;   // أيقونة Solid
  faArrowRight = faArrowRight;   // أيقونة Solid
  faSave = faSave;   // أيقونة Solid

  SelectedTemplate!: TemplateRef<any>
  loading: boolean = true;
  @ContentChildren(StepConfigurationDirective) steps!: QueryList<StepConfigurationDirective>;
  @ViewChildren("buttonHeader") buttonsHeader!: QueryList<ElementRef>
  @Input() Configuration: StepperConfiguration = new StepperConfiguration(this);
  selectStep(Step: StepConfiguration) {
    Step.select(true)
  }
  ngAfterViewInit() {
    let clear = setTimeout(() => {
      let buttons: Array<HTMLElement> = [];
      this.Configuration.Steps=[];
      this.buttonsHeader.forEach(btn => {
        buttons.push(btn.nativeElement)
      })
      this.steps.forEach((step, index) => {
        let gStep = new StepConfiguration()
        gStep.baseComponent = this;
        gStep.baseConfiguration = this.Configuration;
        gStep.buttonsHeader = buttons
        gStep.myBtn = buttons[index];
        gStep.InfoStep = step;
        step.validationConfiguration.numberStep = index + 1;
        this.Configuration.ValidationConfigurations.push(step.validationConfiguration);
        step.StepConfig = gStep;
        this.Configuration.Steps.push(gStep)
        gStep.selected = false;
      })
      let arraySteps = this.steps.toArray();
      if (arraySteps.length > 0) {
        for (let index = 0; index < arraySteps.length; index++) {
          const config = arraySteps[index];
          if (!config.Disable && config.Visible) {
            config.StepConfig.select();
            break;
          }
        }
      }
      let clear2 = setTimeout(() => {
        this.Configuration.onStepsLoaded();
        this.loading = false;
        clearTimeout(clear2);
      }, 1000)
      clearTimeout(clear);
    }, 3000)
  }
  Previous(SelectIn: number) {
    let prv = SelectIn - 1;
    if (prv >= 0) {
      if (this.Configuration.Steps[prv].InfoStep.Disable == false && this.Configuration.Steps[prv].InfoStep.Visible == true) {
        this.Configuration.Steps[prv].select();
      }
      else {
        this.Previous(prv)
      }
    }
  }
  Next(SelectIn: number) {
    let next = SelectIn + 1;
    if (next < this.Configuration.Steps.length) {
      if (this.Configuration.Steps[next].InfoStep.Disable == false && this.Configuration.Steps[next].InfoStep.Visible == true) {
        this.Configuration.Steps[next].select();
        this.checkDisableSave()
      }
      else {
        this.Next(next)
      }
    }
  }
  CheckIsViewMode(): boolean {
    if (this.Configuration.Steps[this.Configuration._ActiveStepIndex] == undefined) {
      return true;
    }
    else {
      return !this.Configuration.Steps[this.Configuration._ActiveStepIndex].InfoStep.isViewMode;
    }
  }
  checkDisableSave() {
    // if (!this.Configuration.StopControlSaveBtn){
    //   for (let index = 0; index < this.Configuration.Steps.length; index++) {
    //     const step = this.Configuration.Steps[index];
    //     if (step.InfoStep.Visible) {
    //       if (!step.selected) {
    //         this.Configuration.disableSave = true;
    //         break;
    //       }
    //     }
    //     this.Configuration.disableSave = false;
    //   }
    // }
    let getLast = (lastDx: number = this.Configuration.Steps.length - 1): StepConfiguration |null=> {
      let last = this.Configuration.Steps[lastDx];
      if (last == undefined) {
        return null;
      }
      else {
        if (last.InfoStep.Disable || !last.InfoStep.Visible) {
          lastDx -= 1;
          return getLast(lastDx)
        }
        else {
          return last;
        }
      }
    }

    let lastStep = getLast();
    if (lastStep != null && this.Configuration.Steps[this.Configuration._ActiveStepIndex]!=undefined) {
      if (this.Configuration.Steps[this.Configuration._ActiveStepIndex].InfoStep.Header == lastStep.InfoStep.Header) {
        this.Configuration.ShowNextButton = false;
        this.Configuration.disableSave = false;
      }
      else {
        this.Configuration.ShowNextButton = true;
        this.Configuration.disableSave = true;
      }
    }


    if (this.Configuration._ActiveStepIndex == 0) {
      this.Configuration.ShowPreviousButton = false;
    }
    else {
      this.Configuration.ShowPreviousButton = true;
    }
  }
  saveData() {
    this.checkDisableSave();
    if (!this.Configuration.disableSave) {
      this.Configuration.onSave();
    }
  }
  hideButton(btn: HTMLElement, hide: boolean) {
    if (hide) {
      btn.style.display = "none";
    }
    else {
      btn.style.display = "inline";
    }
  }
}
