import { Component, Renderer, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StatusStateEnum } from '@app/base/enum/status-state.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@app/base/component/base.component';
import { ModalService } from '@app/base/service/modal.service';
import { ControlService } from '@app/base/service/control.service';
import { PermissionService } from '@app/config/app-permission.service';
import { TelaSistemaEnum } from '@app/base/enum/tela-sistema.enum';
import { DateService } from '@app/base/service/date.service';
import { AppConfig } from '@app/config/app.config';
import { EclesialNotificationService } from '@app/base/service/eclesial-notification.service';
import { ActionNoPermissionUiStatic } from '@app/features/action-no-permission-ui/action-no-permission-ui.static';
import { <%= classify(name) %>Application } from '../application/<%= dasherize(name) %>.application';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';
import { <%= classify(name) %>SearchComponent } from '../search/<%= dasherize(name) %>-search.component';

@Component({
    selector: 'app-<%= dasherize(name) %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component extends BaseComponent {
                                                    
    @ViewChild(<%= classify(name) %>SearchComponent) <%= tovariable(name) %>SearchComponent: <%= classify(name) %>SearchComponent;    

    public routeName: string = '';
    public userName: string = '';

    controlOrganismo: FormGroup;
    controlTelaSistema: FormControl;
    
<%= fields.length > 0 ? getFieldControlsVariables(fields) : "//TODO - Declare your control variables here!" %>

    
    constructor(
        application: <%= classify(name) %>Application,
        service: <%= classify(name) %>Service,
        formBuilder: FormBuilder,
        modalService: ModalService,
        cdr: ChangeDetectorRef,
        renderer: Renderer,
        controlService: ControlService,
        permissionService: PermissionService,
        router: Router,
        private _dateService: DateService,
        private _route: ActivatedRoute,
        private _eclesialNotificationService: EclesialNotificationService,
    ) {
        super(
            application,
            service,
            formBuilder,
            cdr,
            renderer,
            modalService,
            controlService,
            permissionService,
            <%= classify(name) %>Component.actPermissions.BBT_<%= toconst(name) %>,
            router,
        );

        this.routeName = _route.routeConfig.data.name;

        this._createForm();

        this.setIncludeState();
    }

    
    private _createForm() {
        this.formGroup = this.formBuilder.group({
<%= fields? getFieldControls(fields) : '//TODO - Define the controls here!' %>
        ,
        organismo: this.formBuilder.group({
            id: null,
            codigo: [''],
            descricao: null
        }),
        telaSistema: null
        });

        this._setControls();

    }
        

    private _setControls() {
        this.controlOrganismo = <FormGroup>this.formGroup.get('organismo');
        this.controlTelaSistema = <FormControl>this.formGroup.get('telaSistema');

        <%= fields?  getFieldControlsReferences(fields) : '//TODO - set the control references here!' %>
    }

    private _setDefaultValues() {
        this.userName = AppConfig.usuario.nome;  
        this.controlOrganismo.get('id').setValue(parseInt(AppConfig.organismoId));
        this.controlOrganismo.get('descricao').setValue(AppConfig.organismoNome);
        this.controlTelaSistema.setValue(TelaSistemaEnum.<%= tovariable(name) %>); 
    }
    
    onIncludeState() {
        this._setDefaultValues();
    }

    onEditState() {
        this.controlTelaSistema.setValue(TelaSistemaEnum.<%= tovariable(name) %>);
    }

    onViewState() {
        this.controlTelaSistema.setValue(TelaSistemaEnum.<%= tovariable(name) %>);
    }

    _hasPermissionToSave(){
        switch (this.statusState) {
            case StatusStateEnum.Include:
                return this.permissionService.PermissionInserir(this.action);
            case StatusStateEnum.Edit:
                return this.permissionService.PermissionEditar(this.action);
            default:
                return false;
        }       
    }



    save() {

        if (this._hasPermissionToSave()) {
           
            this.controlService.markAllTouched(this.formGroup);
            this.trySave = true;

            if (this.formGroup.valid) {
                this.trySave = false;
                this.application.save(this, this.formGroup, this.controlsDataTypes, isNew);
            } else {
                this.controlService.setFocusFirstControlInvalid(this.formGroup);
            }
        } else {
            ActionNoPermissionUiStatic.open();
        }
    }


    search() {
        if (this.permissionService.PermissionConsultar(this.action)) {   

            this.<%= tovariable(name) %>SearchComponent.setDefaultFormValues(this.formGroup.get('organismo').value, this.formGroup.get('telaSistema').value);
            this.modalService.open('<%= tosimplelowcase(name) %>search');

        } else {
            ActionNoPermissionUiStatic.open();
        }
    }

    searchSelected(result: any) {
        this.application.getById(result.id, this.formGroup, this.controlsDataTypes).then(() => {
            this.setViewState();
        });
    }

    
    ngOnDestroy(): void {
        this._eclesialNotificationService.clear();
    }

   
}