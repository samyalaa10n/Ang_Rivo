import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { StepConfiguration, ValidationConfiguration } from './stepper.configuration';

@Directive({
  selector: '[stepConfig]'
})
export class StepConfigurationDirective {
  @Input() Header: string = ""
  @Input() Disable: boolean = false
  @Input() Visible: boolean = true
  @Input() isViewMode: boolean = false
  @Input() namePropertyOfObject: string = ""
  @Input() ParametersIfArray: Array<any> = [];
  @Output() onSelected: EventEmitter<any> = new EventEmitter();
  validationConfiguration!: ValidationConfiguration 
  Template!: TemplateRef<any>
  StepConfig!: StepConfiguration
  constructor(private _template: TemplateRef<any>) {
    this.Template = _template;
  }
  ngAfterViewInit() {
    this.validationConfiguration = new ValidationConfiguration(this.namePropertyOfObject, this.ParametersIfArray)
  }
}

