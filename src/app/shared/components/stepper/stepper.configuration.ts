import { StepperComponent } from "./stepper.component";
import { StepConfigurationDirective } from "./Step-Configuration.directive";

export class StepperConfiguration {
    constructor(private _Component: any) {
        this.Component = _Component;
    }
    Component: any = null
    baseComponent!: StepperComponent
    _ActiveStepIndex: number = 0;
    ValidationWork: boolean = true;
    ValidationConfigurations: Array<ValidationConfiguration> = [];
    public set ActiveStepIndex(v: number) {
        this._ActiveStepIndex = v;
        this._ActiveStepIndex = v;
        if (this.baseComponent != null) {
            this.Steps[this._ActiveStepIndex].select()
        }
    }
    public get ActiveStepIndex(): number {
        this.Steps[this._ActiveStepIndex].select()
        return this._ActiveStepIndex;
    }
    StopControlSaveBtn: boolean = false;
    HeaderNext: string = "التالي"
    HeaderPrevious: string = "السابق"
    HeaderSave: string = "حفظ"
    disableSave: boolean = true
    ShowNextButton: boolean = true
    ShowPreviousButton: boolean = true
    Steps: Array<StepConfiguration> = []
    onSave() {

    }
    lastStepChange!: StepConfiguration;
    oncSelectChange(newStep: StepConfiguration, oldStep: StepConfiguration, stopCallBack: any) {

    }
    onStepsLoaded() {

    }
    getStepByHeader(header: string): StepConfiguration | null {
        return this.Steps.find(x => x.InfoStep.Header == header) ?? null;
    }
}
export class StepConfiguration {
    baseComponent!: StepperComponent
    baseConfiguration!: StepperConfiguration
    buttonsHeader: Array<HTMLElement> = []
    myBtn!: HTMLElement;
    private _selected: boolean = false;


    public set selected(v: boolean) {
        this._selected = v;
        this.EditStyleBtnOnSelect(v);
        this.baseComponent.checkDisableSave();
    }

    public get selected(): boolean {
        return this._selected
    }
    private EditStyleBtnOnSelect(selected: boolean) {
        if (selected) {
            if (this.myBtn != null) {
                if (!this.myBtn.classList.contains("EndStep")) {
                    this.myBtn.classList.add("EndStep")
                }
                if (this.myBtn.classList.contains("Before-step")) {
                    this.myBtn.classList.remove("Before-step")
                }
            }
        }
        else {
            if (this.myBtn != null) {
                if (!this.myBtn.classList.contains("Before-step")) {
                    this.myBtn.classList.add("Before-step")
                }
                if (this.myBtn.classList.contains("EndStep")) {
                    this.myBtn.classList.remove("EndStep")
                }
            }
        }
    }

    InfoStep!: StepConfigurationDirective
    onClick(e: StepConfiguration) {
    }
    onBeforeLoadTemplate() {

    }

    async select_Step(withClickEvent: boolean=true) {
        let dx = this.baseConfiguration.Steps.indexOf(this);
        if (this.InfoStep.Visible && !this.InfoStep.Disable) {
            this.buttonsHeader.forEach((btn: HTMLElement) => {
                if (btn.classList.contains("step-Select")) {
                    btn.classList.remove("step-Select")
                }
            })
            try {
                await this.onBeforeLoadTemplate()
            }
            finally {
                this.InfoStep.onSelected.emit(this)
                this.myBtn.classList.add("step-Select")
                this.baseConfiguration._ActiveStepIndex = dx
                this.selected = true;
                let clear = setTimeout(() => {
                    this.baseComponent.checkDisableSave();
                    clearTimeout(clear);
                }, 1000)
                this.baseComponent.SelectedTemplate = this.InfoStep.Template;
                if (withClickEvent) {
                    this.onClick(this)
                }
            }
        }
    }

    async select(withClickEvent = true) {
        if (this.baseComponent != null) {
            let stopCallBack: any = {};
            this.baseConfiguration.oncSelectChange(this, this.baseConfiguration.lastStepChange, stopCallBack);
            if (stopCallBack.value) {
                return;
            }
            let dx = this.baseConfiguration.Steps.indexOf(this);
            let result = true;

            if (this.baseConfiguration.ValidationWork) {
                for (let index = 1; index <= dx; index++) {
                    if (this.baseConfiguration.Steps[index - 1].InfoStep.Visible) {
                        let ValidationConfig = this.baseConfiguration.ValidationConfigurations.find(x => x.numberStep == index)
                        if (ValidationConfig != null) {
                            if (ValidationConfig.Validation != null) {
                                let onGetResultValidation = (res: any) => {
                                    if (res != null) {
                                        if (res == true) {
                                            result = true;
                                            this.baseConfiguration.Steps[index - 1].selected = true;
                                        }
                                        else {
                                            result = false;
                                            if ((index - 1) >= 0) {
                                                this.baseConfiguration.Steps[index - 1].select()
                                                for (let dx = index; dx < this.baseConfiguration.Steps.length; dx++) {
                                                    this.baseConfiguration.Steps[dx].selected = false;
                                                }
                                            }
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                if (typeof this.baseConfiguration.Component[ValidationConfig.Validation] == "function") {
                                    let newPrams: Array<any> = []
                                    ValidationConfig.pramsIfFunc.forEach(pram => {
                                        if (typeof pram == "string") {
                                            if (this.baseConfiguration.Component[pram] != undefined) {
                                                newPrams.push(this.baseConfiguration.Component[pram])
                                            }
                                            else newPrams.push(pram)
                                        }
                                        else {
                                            newPrams.push(pram)
                                        }
                                    })
                                    if (!onGetResultValidation(this.baseConfiguration.Component[ValidationConfig.Validation](...newPrams))) {
                                        break;
                                    }
                                }
                                if (typeof this.baseConfiguration.Component[ValidationConfig.Validation] == "boolean") {
                                    if (!onGetResultValidation(this.baseConfiguration.Component[ValidationConfig.Validation])) {
                                        break;
                                    }
                                }
                            }
                        }
                        this.baseConfiguration.Steps[index - 1].selected = true;
                    }
                }
            }
            if (result) {
                await this.select_Step(withClickEvent)
            }
        }
    }
}
export class ValidationConfiguration {
    numberStep: number = 0;
    Validation: any
    pramsIfFunc: Array<any> = []
    constructor(private _Validation: any, private _pramsIfFunc: Array<any> = []) {
        this.Validation = _Validation;
        this.pramsIfFunc = _pramsIfFunc;
    }
}