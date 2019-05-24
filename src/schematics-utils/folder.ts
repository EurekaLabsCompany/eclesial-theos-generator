import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { Tree} from '@angular-devkit/schematics';
import { getWorkspace } from "../schematics-angular-utils/config";

export const proccessFoderPath = (componentFolder:string, options:any ,host: Tree) =>{
    const workspace = getWorkspace(host);
    
    options.project = Object.keys(workspace.projects)[0];
    
    const project = workspace.projects[options.project];

    if (options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      options.path = `/${project.root}/src/${projectDirName}`;
    }

    let resourceNameDasherized = dasherize(options.name);    
    
    if(options.path.indexOf(resourceNameDasherized) === -1){
      options.folderPath = `${options.path}/${resourceNameDasherized}/${componentFolder}`
    }else{
      options.folderPath = `${options.path}/${componentFolder}`
    }

    return options;

}
