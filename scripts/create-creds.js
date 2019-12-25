let program = require('commander');
let inquirer = require('inquirer');
let fs = require('fs');

const ssoConfigLocation = 'config/sso';
const smsessionLocation = ssoConfigLocation + '/smsession';
// const ssoProperties = require('../config/sso/siteminder.json');
// const SSOConnection = require('@railinc/sso-connection').SSOConnection;
// let ssoConnection = undefined;


program.version('1.0.0');

const environmentQuestion = {
    type : 'list',
    name : 'environment',
    message : "Please select the environment you would like to create a creds file for",
    choices : [
        'dev',
        'tst'
    ]
};

const usernameQuestion = {
    type: 'input',
    name: 'username',
    message: "What is the username you would like to use for this environment?"
};

const passwordQuestion = {
    type: 'password',
    name: 'password',
    mask: '*',
    message: "What is the password for this username?"
};

consoleLog("This is a small program to help you generate creds files for the Railinc environments, which will be used by the webpack dev server to proxy your requests.");    

getCreds();
ensureCreateFile(smsessionLocation);

function getCreds(){
    inquirer.prompt([environmentQuestion, usernameQuestion, passwordQuestion]).then(answers => {    
        // consoleLog("Ok, now I'm going to test these credentials to see if they're valid");       

        validationPhase(answers);
    });
}

function validationPhase(answers){
    // const evnOptions = ssoProperties[answers.environment];
    // const proxyTarget = evnOptions.server;
    // const proxyContext = evnOptions.context;

    // Object.assign(evnOptions.profiles.admin.credentials, {
    //     username : answers.username,
    //     password : answers.password
    // });


    // ssoConnection = new SSOConnection({
    //     profile: evnOptions.profiles.admin,
    //     authenticationUrl: evnOptions.authenticationUrl,
    //     target : evnOptions.target,
    //     smUpdate : (answers.environment === 'dev')
    // });
    
    // ssoConnection.connect().subscribe( success => {        
    //     if(success){            
    const objectToWrite = Object.assign({}, answers);
    
    delete objectToWrite.environment;
    
    const fileToWrite = ssoConfigLocation +  '/creds.' + answers.environment + '.json' ;

    consoleLog("Looks like everything checked out, I'm going to generate your creds file for this environment: " + answers.environment);

    fs.writeFileSync(fileToWrite, JSON.stringify(objectToWrite));

    consoleLog("This file has been generated: " + fileToWrite);
    //     }else{
    //         consoleLog("Oops!!  Looks like you entered invalid credentials.");

    //         getCreds();
    //     }
    // });
}

function ensureCreateFile(file) {
  if(!fs.existsSync(file))
    fs.createWriteStream(file).end();
}

function consoleLog(message){
    console.log("");
    console.log(message);
    console.log("");
}