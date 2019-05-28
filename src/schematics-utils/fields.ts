import { capitalize } from '@angular-devkit/core/src/utils/strings';


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
                                                                configInputTheos="grid-It" 
                                                                labelDescription="${field.label}"
                                                                [lastFocusControl]="lastControlFocus"
                                                                (lastFocusControlChange)="lastFocusControlChange($event)"
                                                                [trySave]="trySave"`
    )


const getSelectProperties = (field: any) => (
    `                           
                                                                [options]="${field.name}List" 
                                                                value="${field.name}"
                                                                description="${field.name}"`
)

const getSearchFields = (fields: any[]) => fields.filter(f => f.entries && f.entries.indexOf("search") >= 0);

const getFormFields = (fields: any[]) => fields.filter(f => !f.entries || f.entries.indexOf("form") >= 0);

const noopProperties = () => ""

const fieldMapper:FieldGeneralConfig[] = [
    {
        alias: ["number", "integer"], 
        tag: "app-eclesial-input-number",
        hasLimit: false,
        conditionType: 'ConditionEnum.Numerico',
        dataType:'number',
        width: 80,
        getFieldProperties: noopProperties
    },
    {
        alias: ["string", "text"], 
        tag: "app-eclesial-input",
        hasLimit: true,
        conditionType: 'ConditionEnum.String',
        dataType:'string',
        width: 200,
        getFieldProperties: noopProperties
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
        alias: ["bool", "boolean"], 
        tag: "app-eclesial-checkbox",
        hasLimit: false,
        conditionType: 'ConditionEnum.Bool',
        dataType:'bool',
        width: 80,
        getFieldProperties: noopProperties
    },
    {
        alias: ["textArea"], 
        tag: "app-eclesial-input-text-area",
        hasLimit: true,
        conditionType: 'ConditionEnum.String',
        dataType:'string',
        width: 400,
        getFieldProperties: noopProperties
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
    const fieldHtml = 
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
    return fieldHtml;
}

//Controls
const getControlConfig = (field:any) => {
    var controlConfig: any = {isGroup: false, options:{}};
    if(!field.formGroup || field.formGroup == 'formGroup'){
        controlConfig.name = field.name;        
        controlConfig.options = getFieldGeneralConfig(field);
    }else{
        controlConfig.name = field.formGroup;
        controlConfig.isGroup = true;
        controlConfig.required = field.required;
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
        filteredFields = fields.filter(f=> f.name === fieldConfig.name);
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

const generateSimpleFieldVariable =  (fieldConfig:any) =>(`     control${capitalize(fieldConfig.name)}: ${fieldConfig.isGroup ? 'FormGroup' : 'FormControl'};`)

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

const getFieldSetterForViewModel = (fieldConfig: any) => {
    if(fieldConfig.isGroup){
        return `
        this.${fieldConfig.name}Id = formGroup.get('${fieldConfig.name}').get('id').value;`
            
    }else{
        return `
        this.${fieldConfig.name} = formGroup.get('${fieldConfig.name}').value;`
    }
}



//public***************************************************
export const getDefaultHtmlComponent = () => generateField({type: "string", name:'addThisName', label: "Add This Label" });

export const getHtmlComponents = (fields: Array<any>) =>  fields.map(generateField).join('')

export const getFieldControls = (fields: Array<any>) => { 
    var formFields = getFormFields(fields);
    var groupsConfig:any[] = getGroupsConfig(formFields);    
    return groupsConfig.map(generateFieldControl(formFields)).join(',\n');
    
}

export const getFieldControlsVariables = (fields: Array<any>) => { 
    var formFields = getFormFields(fields);
    var groupsConfig:any[] = getGroupsConfig(formFields);    
    var generatedCode = groupsConfig.map(generateSimpleFieldVariable).join('\n');  
    
    return generatedCode;
}

export const getFieldControlsReferences = (fields: Array<any>) => {
    var formFields = getFormFields(fields); 
    var groupsConfig:any[] = getGroupsConfig(formFields);    
    return groupsConfig.map(generateSimpleFieldReferenceControl).join('');    
}

export const getConditionalFieldConfig = (fields: any[]) => {    
    var searchFields = getSearchFields(fields);
    var results:string[] = [];
    searchFields.forEach((field, index) => {
        results.push(getConditionField(field, index++));
    });
    return results.join('');    
}


export const getFieldsReferenceForViewModel = (fields: any[]) => {    
    var formFields = getFormFields(fields);
    var groupsConfig:any[] = getGroupsConfig(formFields);
    return groupsConfig.map(getFieldReferenceForViewModel).join('\n');    
}

export const getFieldsSetterForViewModel = (fields: any[]) => {    
    var formFields = getFormFields(fields);
    var groupsConfig:any[] = getGroupsConfig(formFields);
    return groupsConfig.map(getFieldSetterForViewModel).join('');    
}


