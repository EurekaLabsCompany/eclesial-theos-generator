import { Component, ElementRef, ComponentFactoryResolver, Input } from '@angular/core';
import { ModalService } from '@app/base/service/modal.service';
import { ControlService } from '@app/base/service/control.service';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';
import { <%= classify(name) %>SearchComponent } from '../search/<%= dasherize(name) %>-search.component';
import { ErrorHandlerService } from '@app/base/service/error-handler.service';
import { EclesialInputSearchComponent } from '@app/base/component/eclesial/eclesial-input-search/eclesial-input-search.component';

@Component({
    selector: 'app-eclesial-input-search-<%= dasherize(name) %>',
    templateUrl: '../../../../../../base/component/eclesial/eclesial-input-search/eclesial-input-search.component.html',    
    
})

export class EclesialInputSearch<%= classify(name) %>Component extends EclesialInputSearchComponent {

    @Input() configInputTheos: string;
    @Input() isNumberOnly: boolean = false;

    protected modalId: string = '<%= tosimplelowcase(name) %>Dynamic';

    constructor(
        el: ElementRef,
        service: <%= classify(name) %>Service,
        componentFactoryResolver: ComponentFactoryResolver,
        modalService: ModalService,
        controlService: ControlService,
        errorHandlerService: ErrorHandlerService,
    ) {
        super(
            el,
            service,
            componentFactoryResolver,
            controlService,
            modalService,
            errorHandlerService,
        );
    }

    openModal(controlValue: string) {

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(<%= classify(name) %>SearchComponent);

        let viewContainerRef = this.eclesialDinamicoDirective.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);

        (<<%= classify(name) %>SearchComponent>componentRef.instance).modalId = this.modalId;
        (<<%= classify(name) %>SearchComponent>componentRef.instance).openOnStart = 'true';
        (<<%= classify(name) %>SearchComponent>componentRef.instance).defaultSource = this.field;
        (<<%= classify(name) %>SearchComponent>componentRef.instance).organismo = this.formGroup.get('organismo').value;

        (<<%= classify(name) %>SearchComponent>componentRef.instance).defaultSearch = Object.is(controlValue, '') ? null : this.formGroup.get(this.groupName + '.' + this.controlName).value;

        (<<%= classify(name) %>SearchComponent>componentRef.instance).searchApiArgument = this.searchApiArgument;
        (<<%= classify(name) %>SearchComponent>componentRef.instance).searchApiArgumentValue = this.searchApiArgumentValue;

        (<<%= classify(name) %>SearchComponent>componentRef.instance).telaSistema = this.formGroup.get('telaSistema').value;

        (<<%= classify(name) %>SearchComponent>componentRef.instance).selected.subscribe((dataSearch: any) => {

            let data = {
                'id': dataSearch.id,
                'codigo': dataSearch.codigo,
                'descricao': dataSearch.descricao,
            };

            this.setSelectedEvent(data);
            this.isOpen = false;
        });

        (<<%= classify(name) %>SearchComponent>componentRef.instance).closed.subscribe((isSelected: boolean) => {

            let lastResult = this.formGroup.get(this.groupName + '.lastResult');

            if (Object.is(this.notFound, true) && lastResult !== null && lastResult.value !== undefined && Object.is(isSelected, true)) {
                this.setSelectedEvent(lastResult.value);
            }

            if (Object.is(isSelected, false) && Object.is(lastResult.value, null)) {
                this.controlService.setFocus(this.groupName + '.' + this.controlName);
                this.formGroup.get(this.groupName + '.' + this.controlName).setValue(null);
            } else {
                this.controlService.setFocus(this.groupName + '.' + this.controlName);
            }

            viewContainerRef.clear();
            componentRef.destroy();
            this.isOpen = false;
        });

        componentRef.changeDetectorRef.detectChanges();

        this.modalService.open(this.modalId);
    }
}
