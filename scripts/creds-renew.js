// This script simply renews the SSO connection cookie value without having to restart NPM watch

const proxyEnv =  (process.env['npm_config_dev'])   ? 'dev' :
                  (process.env['npm_config_tst'])   ? 'tst' : 
                  (process.env['npm_config_localhost']) ? 'local' : 'dev';
const spawn = require('child_process').spawn;
const args = [
    "--ignore-ssl-errors=true",
    "node_modules/@railinc/sso-connection-phantom/index.js",
    //"config/crms-devhack/index.js",
    "--" + proxyEnv
];
const phantomExecutable = '../../development/phantomjs-2.1.1-windows/bin/phantomjs';//'node_modules/phantomjs-prebuilt/bin/phantomjs';

function Uint8ArrToString(myUint8Arr){
  return String.fromCharCode.apply(null, myUint8Arr);
};

var child = spawn(phantomExecutable, args, {});

// Receive output of the child process
child.stdout.on('data', function(data) {
  var textData = Uint8ArrToString(data);
  console.log(textData);
});
