import { Component, Renderer, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConditionEnum } from '@app/base/enum/condition.enum';
import { BaseSearchComponent } from '@app/base/component/base.search.component';
import { ModalService } from '@app/base/service/modal.service';
import { PageCalculatorService } from '@app/base/service/page-calculator.service';
import { ControlService } from '@app/base/service/control.service';
import { EclesialNotificationService } from '@app/base/service/eclesial-notification.service';
import { ErrorHandlerService } from '@app/base/service/error-handler.service';
import { DateService } from '@app/base/service/date.service';
import { MoneyService } from '@app/base/service/money.service';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';
import { LoaderUiStatic } from '@app/features/loader-ui/loader-ui.static';
import { ListDataAdapter, AdapterType } from './../../../../../../../base/list/list-data-adapter';

@Component({
    selector: 'app-<%= dasherize(name) %>-search',
    templateUrl: '../../../../../../base/component/base.search.component.html',
})
export class <%= classify(name) %>SearchComponent extends BaseSearchComponent {

    public modalId =  '<%= tosimplelowcase(name) %>search';
    public titleSearch: string = '<%= totext(name) %>';

    private adapter:ListDataAdapter = new ListDataAdapter();

    constructor(
        service: <%= classify(name) %>Service,
        formBuilder: FormBuilder,
        modalService: ModalService,
        cdr: ChangeDetectorRef,
        renderer: Renderer,
        pageCalculatorService: PageCalculatorService,
        controlService: ControlService,
        eclesialNotificationService: EclesialNotificationService,
        errorHandlerService: ErrorHandlerService,
        dateService: DateService,
        moneyService: MoneyService,
    ) {
        super(
            service,
            formBuilder,
            modalService,
            cdr,
            renderer,
            pageCalculatorService,
            controlService,
            eclesialNotificationService,
            errorHandlerService,
            dateService,
            moneyService,
        );

        this.campos = [
            <%= fields.length > 0 ? getConditionalFieldConfig(fields) : "Map the conditional fields here!" %>  
        ];       


        this.DEFAULTFIELDVALUE = '<%= fields.length > 0 ? fields[0].name : "codigo" %>';

        super.afterConstructor();
    } 

   
    setDefaultFormValues(organismo: any, telaSistema: number) {
        this.organismo = organismo;
        this.telaSistema = telaSistema;
    }

    search() {

        if (this.verifySearchIsValid()) {
            LoaderUiStatic.open();
            this.service.getSearch(this.modalFormGroup, 1, this.organismo.id, this.telaSistema, this.searchApiArgument, this.searchApiArgumentValue).subscribe((data) => {
                try {
                    if (data.data[0] === undefined) {
                        this.rowData = [];
                        this.overlayNoRowsTemplate = '<span>Nenhum registro encontrado.</span>';
                        this.totalSearchData = undefined;
                        this.totalSearchPages = undefined;
                    } else {
                        this.rowData = this.dataAdapter(data);
                        this.totalSearchData = data.totalRows;
                        this.searchCurrentPage = 1;
                        this.totalSearchPages = this.pageCalculatorService.calculate(data.totalRows);
                    }
                } finally {
                    LoaderUiStatic.close();
                }
            }, (error) => {
                try {
                    this.errorHandlerService.handle(error);
                } finally {
                    LoaderUiStatic.close();
                }
            });
        }
        this.restoreConditionState();
    }

    newPageSearch(event: number) {
        if (this.verifySearchIsValid()) {
            LoaderUiStatic.open();
            this.service.getSearch(this.modalFormGroup, event, this.organismo.id, this.telaSistema, this.searchApiArgument, this.searchApiArgumentValue).subscribe((data) => {
                try {
                    if (data.data[0] === undefined) {
                        this.rowData = [];
                        this.overlayNoRowsTemplate = '<span>Nenhum registro encontrado.</span>';
                        this.totalSearchData = undefined;
                        this.totalSearchPages = undefined;
                        this.gridApi.sizeColumnsToFit();
                    } else {
                        this.rowData = this.dataAdapter(data);
                        this.gridApi.sizeColumnsToFit();
                    }
                } finally {
                    LoaderUiStatic.close();
                }
            }, (error) => {
                try {
                    this.errorHandlerService.handle(error);
                } finally {
                    LoaderUiStatic.close();
                }
            });
        }
        this.restoreConditionState();
    } 

    dataAdapter(data) {
        return this.adapter.adaptList(
            [                
                //this.adapter.simple('situacao',         AdapterType.enumType, ConditionEnum.Situacao),             
            ]
        )(data.data);        
        
    }
}
