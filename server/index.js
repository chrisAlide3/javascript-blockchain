const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
console.log('Env in server: ' + process.env.NUXT_HOST);

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // const nodeUrl = 'http://' + host + ':' + port;
  // this.$store.dispatch('setCurrentNodeUrl', nodeUrl);
  // const blockchainFileName = "blockchain" + nodeUrl.replace(/\//g, '') + ".txt";
  // this.$store.dispatch('setBlockchainFileName', blockchainFileName);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
