# Nost Framework

# Installation

<pre>
cd to/new/project/folder
git clone http://repo.unnitech.net:81/Framework/nodejs-core-ts.git .
rm -rf .git
git init
git remote add origin new-project-url
git add . 
git commit -m "Get framework"
git push origin master
rename .env_example into .env and add configurations
add database credentials into ormconfig.json
npm install
npm run tsc
typeorm migration:run
npm run dev

Happy Codding!!!
</pre>
# File naming
Every file should be in lower case separated by comma and last part should describe class type for ex:
user.controller.ts
use.entity.ts
authentication.middleware.ts

# Modules
Module represents a logial or functional part of the system.
All should be as loosely coupled as possible with each other expect common module, think of them as something that represents a functionality 
or application component.
`Notice migration is not a module should NOT be modified`

1. common module is the main module which interconnects every other module and where generic functions and class exist
2. authentication module representing authentication functionality
3. user module representing users component of the app
4. attachment module representing users component of the app

# Module naming
Modules should be named in singular and seperated by underscore `_` if multiple words for ex: google_calendar

# Module generation
To create a new module just run
`npm run module:create -- -n=your_module_name`

# Module structure
Folders inside the module must be in plrual and they must contain mutliple files of the same class type.

1. my.module.router.ts gets auto-generated if module is created by the command, must always be in module's root folder, should always be created even when no routes to declare.
2. controllers is where all module controllers should be located
3. entities where you place all your entities files must end with *.entity.ts* otherwise TypeORM will not find them
4. middlewares where all middlewares should be
5. repositories place all custom repositories in here, files must end with *.repository.ts* otherwise TypeORM will not find them
6. utilities where your module generic functionalitites should be 

# Module routes registering
If your module declares some new routes you should add it app.ts for ex:
`MyModuleRouter.configRoutes(app);`


# TypeORM entities
After you created a new entity along with all necessary delcarations or modify an existing one apply to the database you should run:
<pre>
    npm run tsc
    typerom migration:generate -n DescribeYourChange
    Check all generated queries of up function for non intended deletes
    npm run tsc
    typeorm migration:run
</pre>

# TypeORM repositories
All custom repositories must extend CommonRepository class located at common/reositores/common.repository.ts

# Test
All test should be under `test` folder at root directory, folders inside test should follow the same path as the file you are testing for ex:
src/user/controllers/user.controller.ts => test/user/controller/user.controller.integration.test.ts

See how tests are build at: 
https://jestjs.io/docs/en/getting-started

All test files should coppy the same name adding *.test.ts* for ex: 
user.middleware.ts => user.middleware.test.ts

for integration test append *.integration.test.ts*
user.controller.ts => user.controller.integration.test.ts

Run all test: 
`npm run test`

run single test file
`npm run test -- user.controller.integration.test.ts`

*When testing a new module register it at test/app.ts*/