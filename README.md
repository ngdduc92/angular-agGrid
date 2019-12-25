# SCO90 App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli)

Built with Angular 7, Angular Material, Bootstrap 4 and Typescript 3.
Clone this repo and follow the steps below to get started with Angular 7 Web Application Development.

# Getting Started

## Assumptions / Prerequisites:
* Install NodeJs (8.9 or higher, npm 5.5.1 or higher) from the App Catalog
* Install  Visual Studio Code as your IDE

## Setup Steps:

### Download Project Dependencies:
* Create a .npmrc file [See Details Here](https://docs.npmjs.com/files/npmrc.html)
* Clone this repo:
```
> git clone <enter-bitbucket-url-here>
```
* Run the initial install of the required node modules, defined in the package.json file.  This may take about 5 minutes

```
> npm i
```
### Creating credentials files:

* Create credentials files for proxying requests to dev or tst.

```
> npm run creds
```

### Starting the Application:

* Now that all the dependencies have been downloaded and live in the "node_modules" directory, and we have our credentials file(s), the application can be started.

```
> npm start
```
* This will start the web application, which can be accessed at http://localhost:4200

* You can pass the following environment flags to this command:
    * --dev    (this is the default if not provided)
    * --tst
    * --localhost
        * You can also pass a user flag when proxying to your localhost:
            * --user=APPADMIN

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
[Angular CLI Command Reference](https://angular.io/cli)

## Build

Run `npm run build` to build the project to check for any errors before doing a build on dev or tst. By default it'll build with --prod flag for production. The build artifacts will be stored in the `dist/` directory.

## Publish

Replace 'your-app-package-name'  with the package name that will be used for Jenkins deployment job FILENAME.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
