import { capitalize, dasherize } from '@angular-devkit/core/src/utils/strings';
import { tovariable } from './strings';

declare class FieldGeneralConfig {
    alias:string[];
    tag:string;
    hasLimit:boolean;
    conditionType:string;
    dataType:string;
    width: number;
    getFieldProperties:Function;
}

//private***************************************************
//HTML

const getFieldCommomProperties = (field: any) => (
`   
                                                                [formGroup]="${field.formGroup || 'formGroup'}" 
                                                                controlName="${field.name}"
                                                                labelDescription="${field.label}"                                                                
                                                                (lastFocusControlChange)="lastFocusControlChange($event)"
                                                                [trySave]="trySave"
                                                                `
)

const getFindProperties = (field: any) => (
`
                                                                groupName="${field.name}" 
                                                                configInputTheos="grid-It ${field.name != 'codigo' ? '' : 'no-label'}" 
                                                                (selected)="${tovariable(field.name)}SearchSelected($event)"`
)

const getSituacaoProperties = () => (
    `                           
                                                                configInputTheos="grid-It" `
)


const getSelectProperties = (field: any) => (
    `                           
                                                                [options]="${field.name}List" 
                                                                value="id"
                                                                description="descricao"
                                                                [lastFocusControl]="lastFocusControl"
                                                                configInputTheos="grid-It" `
                                                                
)

const getCheckboxProperties = () => (
    `                           
                                                                configInputTheos="grid-It" `
)

const getDateProperties = (field: any) => (
    `                           
                                                                errorDescription="${field.label}"
                                                                place="dd/mm/aaaa"
                                                                [lastFocusControl]="lastFocusControl"
                                                                configInputTheos="grid-It" `
)

const getStringProperties = (field: any) => (
    `                           
                                                                ${field.limit ? '[limit]="' + field.limit + '"': ''}
                                                                [lastFocusControl]="lastFocusControl"
                                                                configInputTheos="grid-It" `
) 

const getMoneyProperties = () => (
        `                           
                                                                place="R$ 0,00"
                                                                configInputTheos="grid-It" `
)

const getMaskProperties = () => (
    `
                                                                configInputTheos="grid-It"
                                                                mask="00/0000"
    `
)

const noopProperties = () => (
                                                                ""
)


const getSearchFields = (fields: any[]) => fields.filter(f => f.entries && f.entries.indexOf("search") >= 0);

const getFormFields = (fields: any[]) => fields.filter(f => !f.entries || f.entries.indexOf("form") >= 0);


const findControls: any[] = [
    {name: "id",            type: "number"},
    {name: "codigo",        type: "number"},
    {name: "descricao",     type: "string"},
    {name: "lastResult",    type: "number"}
]

const fieldMapper:FieldGeneralConfig[] = [
    {
        alias: ["number", "integer"], 
        tag: "app-eclesial-input-number",
        hasLimit: false,
        conditionType: 'ConditionEnum.Numerico',
        dataType:'number',
        width: 80,
        getFieldProperties: getStringProperties
    },
    {
        alias: ["money"], 
        tag: "app-eclesial-input-money",
        hasLimit: true,
        conditionType: 'ConditionEnum.Money',
        dataType:'number',
        width: 80,
        getFieldProperties: getMoneyProperties
    },
    {
        alias: ["string", "text"], 
        tag: "app-eclesial-input",
        hasLimit: true,
        conditionType: 'ConditionEnum.String',
        dataType:'string',
        width: 200,
        getFieldProperties: getStringProperties
    },
    {
        alias: ["mask"], 
        tag: "app-eclesial-input-masked",
        hasLimit: true,
        conditionType: 'ConditionEnum.String',
        dataType:'string',
        width: 200,
        getFieldProperties: getMaskProperties
    },
    {
        alias: ["select", "options", "array"], 
        tag: "app-eclesial-select",
        hasLimit: false,
        conditionType: 'ConditionEnum.Numerico',
        dataType:'number',
        width: 100,
        getFieldProperties: getSelectProperties
    },
    {
        alias: ["bool", "boolean", "boolean"], 
        tag: "app-eclesial-checkbox",
        hasLimit: false,
        conditionType: 'ConditionEnum.Bool',
        dataType:'boolean',
        width: 80,
        getFieldProperties: getCheckboxProperties
    },
    {
        alias: ["textArea"], 
        tag: "app-eclesial-input-text-area",
        hasLimit: true,
        conditionType: 'ConditionEnum.String',
        dataType:'string',
        width: 400,
        getFieldProperties: getStringProperties
    },
    {
        alias: ["date"], 
        tag: "app-eclesial-input-date",
        hasLimit: false,
        conditionType: 'ConditionEnum.Data',
        dataType:'string',
        width: 400,
        getFieldProperties: getDateProperties
    },
    {
        alias: ["find"], 
        tag: "app-eclesial-input-search-class",
        hasLimit: false,
        conditionType: 'ConditionEnum.Numerico',
        dataType:'number',
        width: 400,
        getFieldProperties: getFindProperties
    },
    {
        alias: ["situacao"], 
        tag: "app-eclesial-inativacao",
        hasLimit: false,
        conditionType: 'ConditionEnum.Situacao',
        dataType:'boolean',
        width: 400,
        getFieldProperties: getSituacaoProperties
    },
        
]

const getFieldGeneralConfig = (field: any) => {    
    var fieldConfig = fieldMapper.filter(f => f.alias.indexOf(field.type)>= 0).pop();    
    
    if(!fieldConfig){
        return  {
            alias: [], 
            tag: field.tag,
            hasLimit: false,
            conditionType: 'ConditionEnum.String',
            dataType: field.type,
            width: 200,
            getFieldProperties: noopProperties
        }
    }

    return fieldConfig;    
}


const generateField = (field: any) => {
    const fieldConfig:FieldGeneralConfig = getFieldGeneralConfig(field);
    var fieldHtml = '';
    
    if(field.type == 'find'){        
        const fieldCodigo = {name: 'codigo', type: 'number',  label: field.label};
        const fieldDescricao = {name: 'descricao', type: 'string'};
        fieldHtml = 
        `
                                                <div class="col-12" (keydown.tab)="keyEnter($event)">
                                                    <div class="row">
                                                        <div class="col-12 col-md-4">
                                                            <div class="theos-label-inline">
                                                                <app-eclesial-input-search-${dasherize(field.name)} ${getFieldCommomProperties(fieldCodigo)}${fieldConfig.getFieldProperties(field)}>                                                            
                                                                </app-eclesial-input-search-${dasherize(field.name)}>
                                                            </div>    
                                                        </div>
                                                        <div class="col-12 col-md-8">
                                                        <div class="theos-label-inline">
                                                            <app-eclesial-input-search-${dasherize(field.name)} ${getFieldCommomProperties(fieldDescricao)}${fieldConfig.getFieldProperties(field)}
                                                            [showLabel]="false">                                                            
                                                            </app-eclesial-input-search-${dasherize(field.name)}>
                                                        </div>    
                                                    </div>
                                                    </div>
                                                </div>
        `

    }else{
        fieldHtml = 
        `
                                                <div class="col-12" (keydown.tab)="keyEnter($event)">
                                                    <div class="row">
                                                        <div class="col-12 col-md-4">
                                                            <div class="theos-label-inline">
                                                                <${fieldConfig.tag} ${getFieldCommomProperties(field)}${fieldConfig.getFieldProperties(field)}>                                                            
                                                                </${fieldConfig.tag}>
                                                            </div>    
                                                        </div>
                                                    </div>
                                                </div>
        `

    }

  
    return fieldHtml;
}

//Controls
const isFormGroup = (field:any) => field.formGroup && field.formGroup != 'formGroup'

const getControlConfig = (field:any) => {
    var controlConfig: any = {isGroup: false, options:{}};   
    if(isFormGroup(field)){
        controlConfig.name = field.formGroup;
        controlConfig.isGroup = true;
        controlConfig.required = field.required;
    }else{
        controlConfig.name = field.name;        
        controlConfig.options = getFieldGeneralConfig(field);
    }
    
    return controlConfig;
}


const getGroupsConfig = (fiedls: any[]) => {
    
    var names:any = {};
    
    var controlsConfigs:any[] = [];
    
    var controlConfig;
    
    fiedls.map(f => {
    
        controlConfig = getControlConfig(f)    
        if(!names[controlConfig.name]){
            controlsConfigs.push(controlConfig);
            names[controlConfig.name] = true;
        }
    });    
    return controlsConfigs;
}


const generateFieldControl = (fields:any[]) => (fieldConfig: any) =>{
    var filteredFields: any[];
    
    if(fieldConfig.isGroup){
        filteredFields = fields.filter(f=> f.formGroup === fieldConfig.name);
        return `          ${fieldConfig.name}: this.formBuilder.group({\n  ${filteredFields.map(generateSimpleFieldControlToGroup).join(', \n  ')}
          }${fieldConfig.required ? ', { validator: EclesialInputSearchValidatorRequired }' : '' })`
    }else{        
        filteredFields = fields.filter(f => !isFormGroup(f) && f.name === fieldConfig.name);        
        return filteredFields.map(generateSimpleFieldControl);
    }
}

const generateSimpleFieldControlToGroup = (field:any) => {
    var notRequiredField = {...field, required: false};
    return generateSimpleFieldControl(notRequiredField);
}

const generateSimpleFieldControl = (field:any) =>`          ${field.name}: ${field.required? '[ null , Validators.required ]' : 'null'}`

const generateSimpleFieldReferenceControl =  (fieldConfig:any) =>(`
    this.control${capitalize(fieldConfig.name)} = <${fieldConfig.isGroup ? 'FormGroup' :'FormControl'}>this.formGroup.get('${fieldConfig.name}');`
)

const generateSimpleFieldVariable =  (fieldConfig:any) =>{
    return (`     control${capitalize(fieldConfig.name)}: ${fieldConfig.isGroup ? 'FormGroup' : 'FormControl'};`)}

const getConditionField = (field:any, index: number) => {
    const fieldConfig:FieldGeneralConfig = getFieldGeneralConfig(field);    
    return (`
        { 'id': ${index},  'width': ${fieldConfig.width},   'minWidth': ${Math.ceil(fieldConfig.width - fieldConfig.width * 0.40)},  'maxWidth':  ${Math.ceil(fieldConfig.width + fieldConfig.width * 0.40)},  'columnShow': 'true',   'descricao': '${field.label}', 'field': '${field.name}', 'condition': ${fieldConfig.conditionType} }`
    )
}

const getFieldReferenceForViewModel = (fieldConfig: any) => {    
    
    if(fieldConfig.isGroup){
        return `    public ${fieldConfig.name}Id: number;`
    }else{ 
        return `    public ${fieldConfig.name}: ${fieldConfig.options.dataType};`        
    }
}

const getParsedValue = (fieldConfig: any) => {
    const fieldType = fieldConfig.options ? fieldConfig.options.dataType : 'string';
    switch(fieldType){
        case 'boolean':
            return `
            this.${fieldConfig.name} = this.sauce.getBooleanValue(formGroup.get('${fieldConfig.name}').value);`;
        case 'date':
            return `
            this.${fieldConfig.name} = this.sauce.getDataValue(formGroup.get('${fieldConfig.name}').value);`;
        case 'money':
            return `
            this.${fieldConfig.name} = this.sauce.getMoneyValue(formGroup.get('${fieldConfig.name}').value);`;
        default:
            return `
            this.${fieldConfig.name} = formGroup.get('${fieldConfig.name}').value;`
    }    
}

const getFieldSetterForViewModel = (fieldConfig: any) => {
    if(fieldConfig.isGroup){
        return `
        this.${fieldConfig.name}Id = formGroup.get('${fieldConfig.name}').get('id').value;`
            
    }else{
        return getParsedValue(fieldConfig);
    }
}



const getFindFields = (findField:any) =>{
   var newFindField;
    const generatedFields:any[] = [];

        findControls.map(fc => {
            newFindField = {...fc, formGroup: findField.name, required: findField.required};
            
            if(newFindField.name == 'codigo'){
                newFindField.label = findField.label;
            }

            generatedFields.push(newFindField);
        })

    return generatedFields;
   
}

const proccessFields = (originalFields:any[])=>{
    var processedFields:any[] = [];
    var findFields:any[] = [];
    originalFields.map(f=> {
        
        if(f.type == 'find'){           
            findFields = getFindFields(f);            
            processedFields = processedFields.concat(findFields);
        }else{
            processedFields.push(f);
        }
    })  

    return processedFields;
}



//public***************************************************
export const getDefaultHtmlComponent = () => generateField({type: "string", name:'addThisName', label: "Add This Label" });

export const getHtmlComponents = (fields: Array<any>) =>  fields.map(generateField).join('')

export const getFieldControls = (fields: Array<any>) => { 
    var formFields = getFormFields(fields);
    var proccessedFields = proccessFields(formFields);
    var groupsConfig:any[] = getGroupsConfig(proccessedFields);    
    return groupsConfig.map(generateFieldControl(proccessedFields)).join(',\n');
    
}

export const getFieldControlsVariables = (fields: Array<any>) => { 
    
    var formFields = getFormFields(fields);  
    var proccessedFields = proccessFields(formFields);  
    var groupsConfig:any[] = getGroupsConfig(proccessedFields);    
    var generatedCode = groupsConfig.map(generateSimpleFieldVariable).join('\n');  
    
    
    return generatedCode;
}

export const getFieldControlsReferences = (fields: Array<any>) => {
    var formFields = getFormFields(fields);     
    var proccessedFields = proccessFields(formFields);  
    var groupsConfig:any[] = getGroupsConfig(proccessedFields);    
    return groupsConfig.map(generateSimpleFieldReferenceControl).join('');    
}

export const getConditionalFieldConfig = (fields: any[]) => {    
    var searchFields = getSearchFields(fields);
    var results:string[] = [];
    searchFields.forEach((field, index) => {
        results.push(getConditionField(field, index++));
    });
    return results.join(',');    
}


export const getFieldsReferenceForViewModel = (fields: any[]) => {    
    var formFields = getFormFields(fields);
    var proccessedFields = proccessFields(formFields);  
    var groupsConfig:any[] = getGroupsConfig(proccessedFields);
    return groupsConfig.map(getFieldReferenceForViewModel).join('\n');    
}

export const getFieldsSetterForViewModel = (fields: any[]) => {    
    var formFields = getFormFields(fields);
    var proccessedFields = proccessFields(formFields);  
    var groupsConfig:any[] = getGroupsConfig(proccessedFields);
    return groupsConfig.map(getFieldSetterForViewModel).join('');    
}
