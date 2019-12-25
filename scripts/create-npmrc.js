let inquirer = require('inquirer');
let fs = require('fs');

let fileOutput = '';
const outputFile = '.npmrc';
const { exec } = require('child_process');
const registry = 'http://rail-chq-subver:8081/nexus/repository/npm/';

consoleLog("This program will generate your .npmrc file, which will be required to fetch all of the dependencies for Railinc Angular4 projects");

const usernameQuestion = {
    type: 'input',
    name: 'username',
    message: "What is your LAN username?"
};

const passwordQuestion = {
    type: 'password',
    name: 'password',
    mask: '*',
    message: "What is your LAN password?"
};

inquirer.prompt([usernameQuestion, passwordQuestion]).then(answers => {    
    consoleLog("Ok, now I'm going to generate the .npmrc file...");

    exec('echo -n "' + answers.username + ':' + answers.password + '" | openssl base64', function (err, output) {
        fileOutput += 'registry=' + registry + '\n';
        fileOutput += '_auth=' + output;
        fileOutput += 'email=' + answers.username + '@railinc.com';

        console.log(fileOutput);

        fs.writeFileSync(outputFile, fileOutput);
    });
});


function consoleLog(message){
    console.log("");
    console.log(message);
    console.log("");
}