const fs = require("fs");
const siteminderConfig = require("./sso/siteminder.json");

/* SSO Connection Properties / Module */
// let ssoDevHack = undefined;

/* Proxy Variables */
// Set the proxy environment based on the command line.  defautl to dev
const proxyEnv = process.env["npm_config_dev"]
  ? "dev"
  : process.env["npm_config_tst"]
  ? "tst"
  : process.env["npm_config_localhost"]
  ? "local"
  : "dev";

const proxyContext = siteminderConfig[proxyEnv].serviceContext;
const proxyTarget = siteminderConfig[proxyEnv].applicationUrl;

// If proxy is hitting any non-local env (dev|tst|prd)
if (proxyEnv === "local") {
  /* SSO Devhack setup */
  const cmdUser = process.env["npm_config_user"];
  const SSODevHack = require("@railinc/sso-localdev").SSODevHack;
  const ssoDevhackUsers = require("./sso/users.json");
  ssoDevHack = new SSODevHack(ssoDevhackUsers, cmdUser);
} else {
  // Kick off the phantomjs process to get the siteminder session
  const spawn = require("child_process").spawn;
  const args = [
    "--ignore-ssl-errors=true",
    "node_modules/@railinc/sso-connection-phantom/index.js",
    "--" + proxyEnv
  ];
  const phantomExecutable = "../phantomjs-2.1.1-windows/bin/phantomjs"; //'node_modules/phantomjs-prebuilt/bin/phantomjs';

  function Uint8ArrToString(myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr);
  }

  var child = spawn(phantomExecutable, args, {});

  // Receive output of the child process
  child.stdout.on("data", function(data) {
    var textData = Uint8ArrToString(data);
    console.log(textData);
  });
}

let proxyDef = {
    target: proxyTarget,
    secure: false,
    changeOrigin: true,
    router: request => {
      if (proxyEnv !== "local") return "https://wwwdev.railinc.com";
    },
    onProxyReq: function(proxyReq, req, res) {
      if (proxyEnv !== "local") {
        var smsession = fs.readFileSync("config/sso/smsession", {
          encoding: "UTF-8"
        });

        proxyReq.setHeader("Cookie", smsession);
      } else {
        ssoDevHack.setRequestHeaders(proxyReq);
      }
    }
  },
  // array of proxy defs - one for each context path
  proxyDefs = [];

// for each context path in siteminder.json, add the (same) proxy definition for it
proxyContext.forEach(function(k) {
  const def = Object.assign({}, { path: [k, "**"].join("/") }, proxyDef);
  console.log(`proxy path ${def.path} => ${def.target}`);
  proxyDefs.push(def);
});

module.exports = proxyDefs;
