import { TemplateRef } from "@angular/core"
import { MultiselectComponent } from "../multiselect/multiselect.component"
import { ComboBoxComponent } from "../comboBox/comboBox.component"

export class Column {
    constructor(
        public name: string = '',
        public header: string = '',
        public columnType: "text" | "number" | "numberWithFraction" | "lapel" | "date-Time" | "Time" | "date" | "custom" | "comboBox" | "multiSelect" | "multiSelectObjectMode" | "yes-no" | "textarea" = "lapel",
        public filterType: "text" | "numeric" | "boolean" | "date" | "comboBox" | "yes-no" | "none" = "text",
        public width: number = 100,
        public frozen: boolean = false
    ) {
    }
    apiPathDataSource: string = ''
    columnComboBoxOptionLabel: string = ''
    columnComboBoxOptionValue: string = ''
    columnComboBoxPlaceholder: string = ''
    columnComboBoxDataSource: Array<any> = []
    columnComboBoxChange(selectNewItem: any, rowItem: any, comboBox: ComboBoxComponent) {

    }

    columnMultiOptionLabel: string = ''
    columnMultiPlaceholder: string = ''
    columnMultiSelectpropertyBind: string = ''
    columnMultiSelectselectIdKey: string = ''
    columnMultiSelectOptionValue: string = ''
    columnMultiSelectDataSource: Array<any> = []
    columnMaxDate: Date | null = null;
    columnMinDate: Date | null = null;
    columnMultiSelectChange(multiSelect: MultiselectComponent, rowItem: any) {

    }
    Style_Show(value: any): string {

        return value
    }
    templateColumn!: TemplateRef<any>

}
