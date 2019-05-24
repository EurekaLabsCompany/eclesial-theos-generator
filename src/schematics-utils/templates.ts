import {  filter, Rule } from '@angular-devkit/schematics';

export const filterTemplates = (): Rule => {     
    return filter(path => !path.match(/\.bak$/));
  }