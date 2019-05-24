import { dasherize, classify ,capitalize, underscore} from "@angular-devkit/core/src/utils/strings";


export const totext = (word:string) => dasherize(word).split('-').map(w => capitalize(w)).join(' ');

export const tovariable = (word:string) => classify(word).replace(/^\w/, c => c.toLowerCase());

export const toconst = (word:string) => underscore(word).toUpperCase();

export const tosimplelowcase = (word:string) => classify(word).toLowerCase();

