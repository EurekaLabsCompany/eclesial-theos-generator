export const normalizeOptions = (options: any) => {
    
  if(options.nameOrseed.indexOf('.json') >= 0){    
      options.seed = options.nameOrseed;
    }else{    
      options.name = options.nameOrseed;
    }

    if(options.seed){
        var seed = require(options.seed);
        options.name   = seed.name;
        options.path   = seed.path;
        options.fields = seed.fields;
        
      }
      
      if(!options.name){
        console.error('You need to define at least the name: ex: \n --name=Foo \n or the seed ex: \n --seed=Foo.json');
        return;
      }
      
      return options;
}