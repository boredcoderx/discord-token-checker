var fs = require('fs');
const axios = require('axios-https-proxy-fix');
const lineReader = require('line-reader');
const gradient = require('gradient-string');
const clc = require('cli-color');
const randomUseragent = require('random-useragent');
const setTitle = require('console-title');
const config = require('./config.json');

var success = 0;
var invalid = 0;
var locked = 0;

function logo(){
  console.log(gradient.vice(`
████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗     ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗ 
╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║    ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║    ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║    ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║    ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

                                          By Psycho
\n`))}


function check_token(token, proxy) {
  if (proxy){
    proxy = proxy.split(':')
    if (proxy.length === 2){
      proxy = {
        host: proxy[0],
        port: proxy[1]
      }
    }
    else{
      proxy = {
        host: proxy[2],
        port: proxy[3],
        auth: {username: proxy[0], password: proxy[1]}
      }
    }
  }
  setTitle(`Token Checker | Hits: ${success} | Invalid: ${invalid} | Locked: ${locked}`);
  axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
        'Authorization': token,
        'User-Agent': randomUseragent.getRandom( ua => ua.browserName === 'Chrome')
      },
      proxy: proxy
    }).then(
      response => {
        if (response.status == 200) {
            var data = response.data;
            console.log(clc.green(`[+] Alive token: ${data.username}#${data.discriminator}`))
            success += 1
            
            let content = '';
            if (config.only_save_token){
              content = token+'\n';
            }
            else{
              content = `[+] Discord Token Checker [+]\n[+] Token: ${token}`
              if (config.capture.id) content += `\n[+] ID: ${data.id}`
              if (config.capture.username) content += `\n[+] Username: ${data.username}#${data.discriminator}`
              if (config.capture.email) content += `\n[+] Email: ${data.email}`
              if (config.capture.phone) content += `\n[+] Phone: ${data.phone}`
              if (config.capture.verified) content += `\n[+] Verified: ${data.verified}`
            content += '\n\n'
          }
          
          fs.appendFile(__dirname + '/valid.txt', content, err => {
            if (err) {
              console.log(clc.red("[!] Error saving good token to file."))
            }
          })
        }
        else {
          console.log(clc.red("[!] Unknown error with token:", token, response.status))
          invalid += 1
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
      }
    }
    )
    .catch(
      error => {
        if (error.code === "ERR_SOCKET_BAD_PORT"){
          console.log(clc.red("[!] Bad Proxy"))
          return
        }
        else if (!error.response){
          console.log(clc.yellow(error.message))
        }
        else if (error.response.status === 401) {
          console.log(clc.red("[-] Bad token:", token))
          invalid += 1
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
        else if (error.response.status == 403) {
          console.log(clc.yellow("[-] Locked token:", token))
          locked += 1
          if (config.save_locked){
            fs.appendFile(__dirname + '/locked.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
        else {
          console.log(clc.red("[!] Unknown error with token:", token))
          invalid += 1
          if (config.save_invalid){
            fs.appendFile(__dirname + '/invalid.txt', token+'\n', err => {
              if (err) console.log(clc.red('[!] Error saving invalid token to file'))
            })
          }
        }
      }
    )
}

async function main(){
  if (config.use_proxy){
    try{
      var proxies = fs.readFileSync(__dirname + '/proxies.txt', 'utf8')
      proxies = proxies.split('\r\n')
    } catch (err) {
      console.log(clc.red("[!] Error reading proxy file:", err.message))
      return
    }    
  }
  lineReader.eachLine(__dirname + '/tokens.txt',(line,last)=>{
    if (config.use_proxy){
      check_token(line, proxies[Math.floor(Math.random()*proxies.length)])
    }
    else{
      check_token(line)
    }
  })
  
}

logo()
main()