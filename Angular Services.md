# What is angular service?

* Reusable piece of functionality shared across components.
* Responsible for a single, discrete piece of functionality
* Able to be delivered when and where it is needed

# When to use angular service?

>"Do limit logic in a component to only that required for the view. All other logic should be delegated to
services" -Angular style guide

* The necessary functionality is not required by the view.
* You need to share logic or business rules across components.
* You need to share data across components.

---------------------------

Here is the command that create the build in angular.
"start": "concurrently --kill-others \"ng build --watch --no-delete-output-path\" \"node server.js\""

concurrently - This is npm package that run multiple commands concurrently. Like npm run ng build & node server.js. 
--kill-others - This option kill other processes if one exits or dies  
--deleteOutputPath=true|false - This option, Delete the output path before building.


# Parts of Services

Angular service is a typescript class that is identified by injectable decorator. This decorator is only required service have other service intected into it. Before your service injected into component an instance must be provided in angular dependency injection system. Its provided with provider. Angular system maintain single instance of that service.

# Delivering Services to Components

Providers are really like recipies that provide how service is created. Component has requested for the service injected by the constroctor injection technique.
Ex - constructor(private dataService: Dataservice){}

## Steps for create the service
1. Create the service
2. Inject the service in module or component provider array

* You can inject the service instance by include in provider array. 
* Or Use (providedIn:'root') property in injectable decorator service. It means provided service is treeshakeable, so when compiler make build and if this service is unused in application then it remove from the bundle so its reduce the size. 

### You can create the service throught the cli
Cli Command
```
ng g s folderName --spec false
ng g s services/data --spec false
Output: It result create the data service in app\src\services\data.service.ts 
```

# Sharing Data with services

Service in the angular is singlton. If service has property on it, then any component that injected service access those property and also other component access to same property. Any changes made to property also reflect on other components.

# Understanding and configuring dependency injection

Most software broken down in interelated pieces to make application. So we divide the view and loginc in separte. Lets look at the example Dashboard component has dependency for load the data from Dataservice. The below example shows that we create the new object instance of DataService, so our component tightly coupled with that instance. 
```
export class DashboardComponent {
    dataService: DataService
    constructor() {
        this.dataService = new this.dataService();
    }
}
```
Instead of creating new instance, provide the instance of that service.
 ```
 export class DashboardComponent {
    constructor(private dataService: DataService) {

    }
}
 ```
 So now component is not tightly coulpled. 


## Why is dependency injection important?

* Loosely coupled code. (We provide the service as construction injection instead for create the instace)
* More flexible code.(Easily replace the code if requirement change)
* Easier to test.(You can isolate unit test by provide fake implemention of service)

## Provider
Provider is important part of dependecy injection system. A provider tells an injector how to create the service. Provider array in module serve as token and same token we use when inject service in component as constructor injector.
```
@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
In the above we added DataService in providers array. The class name serve as token that same we inject in construction injection.
>Injectors are inherited, which means that if a given injector can't resolve a dependency, it asks the parent injector to resolve it. A component can get services from its own injector, from the injectors of its component ancestors, from the injector of its parent NgModule, or from the root injector.

## Multiple way to provide service

### Example 1 
```
providers: [DataService, { provide: LoggerService, useClass: LoggerService }
```
 Here provide property used as toaken for this service and useclass property used as recipe. So angular associate class that specify in useClass with token that specified in provide property.

 Dataservice syntex is equivalent with the object literal if token and class name is same. 

### Example 2 
 Let suppoose LoggerService replace by new PlainLoggerService. 
```
providers: [
              PlainLoggerService,
              {provide:LoggerService,useExisting:PlainLoggerService},
              DataService],
```
Now LoggerService instance refer to PlainLoagger service.

### Example 3 - In below useValue provide the decleration for log and error message with object literal notation.
```
{provide:LoggerService, useValue:{
                log:(message) =>console.log(`Message: ${message}`),
                error:(message) =>console.log(`Error: ${message}`)
              }}
```
### Example 4 - Use factory function to create
```
{provide:DataService, useFactory:dataServiceFactory,deps:[LoggerService]}
```
## The Roles of injectors

* Deliver provided services when they're requested via contructor injection
* Maintain a single instance of each service provided
* Determine what to inject based on emitted metadata
* Delegate injection to parent injectors if necessary (Or token is mathed)

The importance of Metadata
Provides inoformation about parameters to injectors.

## Hierarchical Injectors

Anugular application has multiple injector and they are organized hierarchical mirror the component structure in the app.
```
--Root injector             Provider:[LoggerService]
----Lazy Loded Module       Provider:[LoggerService]
----component
----component
    ----child component
----component
```
1. If you provide the service in ngModule or use providedIn:'root' property then service will be added as "Root Injector" and available throught the application. Exception to this case service provide in laze loaded module which will create "Child injector" for that service
2. Lets example if Service injected in child or nested component then DI injection first looking for the instace at same level and if could not find then looking at parent component level. If could not find there then it will look at root injector level.