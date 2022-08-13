# Discord Token Checker

Fast Discord Token Checker with proxy support coded in node.js

## Features
* Proxy Support
* Detailed Capture
* Customizable

## Setup
1. Install the latest version of node.js here: https://nodejs.org/en/download/
2. Download the files or clone the repo.
3. Open a terminal in the same folder and run the following commands to install the required modules.

```npm install line-reader
npm install fs
npm install xmlhttprequest
npm install gradient-string
npm install cli-color
```
4. Paste unchecked tokens in `tokens.txt`
5. If using proxy, paste proxies in `proxies.txt`
5. Run `node index.js` in terminal

## Configuration
Customizable options in `config.json`
* **Proxy format:** `ip:port` or `user:pass:ip:port`
* **Capture:** `id`/`username`/`email`/`phone`/`verified`

## To Do
* Add Multithreading
