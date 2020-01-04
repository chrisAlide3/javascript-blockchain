// const Blockchain = require('../server/blockchain');
export const state = () => ({
  chain: [],
  pendingTransactions: [],
  currentNodeUrl: "http://" + process.env.NUXT_HOST + ":" + process.env.NUXT_PORT,
  networkNodes: [],
  blockchainFileName: "blockchain" + process.env.NUXT_HOST + process.env.NUXT_PORT + ".txt",

  error: '',
  isLoading: [],
  searchString: ''
})

export const mutations = {
  // loadChain (state, chain) {
  //   state.chain = chain
  // },

  addBlockToChain (state, block) {
    state.chain.push(block);
    console.log("Chain on addBlockToChain: " + JSON.stringify(state.chain));
  },

  addTransactionToPendingTransactions (state, transaction) {
    state.pendingTransactions.push({sender: transaction.sender, recipient: transaction.recipient, amount: transaction.amount});
    console.log("transactions in addtransaction: " + JSON.stringify(state.pendingTransactions));
  },

  clearPendingTransactions (state) {
    state.pendingTransactions = [];
  },

  writeBlockchainFile (state) {

  },

  addNodeUrlToNetworkNodes (state, nodeUrl) {
    state.networkNodes.push(nodeUrl);
  },

  setBlockchainFileName (state, fileName) {
    state.blockchainFileName = fileName
  },

  setCurrentNodeUrl (state, nodeUrl) {
    state.currentNodeUrl = nodeUrl;
  },
  
  setError (state, msg) {
    state.error = msg
  },

  isLoading (state, element) {
    if (element) {
      state.isLoading.push(element)
    } else {
      state.isLoading = []
    }
  },

  setSearchString (state, searchString) {
    state.searchString = searchString
  }

}

export const actions = {
  nuxtServerInit (vuexContext, context) {
    //Creating Genesis bloc if no blockchain file or load blockchain from file
    if (process.server) {
      const fs = require('fs');
      try {
        fs.statSync(vuexContext.getters.blockchainFileName);
        console.log("File available");
        vuexContext.dispatch('loadBlockchainFromFile'); 

      } catch (error) {
        console.log("File does not exist");
        const block = {
          nonce: 100,
          hash: '0',
          previousHash: '0'
        };
        vuexContext.dispatch('createNewBlock', block);
      }
    }
  },

  loadBlockchainFromFile( {commit, getters} ) {
    if (process.server) {
      let parsedLine = null;
      const lines = require('fs').readFileSync(getters.blockchainFileName, 'utf-8').split('\n');

      parsedLine = JSON.parse(lines[0]);
      parsedLine.forEach(block => {
        commit('addBlockToChain', block);
      });

      parsedLine = JSON.parse(lines[1]);
      parsedLine.forEach(transaction => {
        commit('addTransactionToPendingTransactions', transaction);
      });

      parsedLine = JSON.parse(lines[2]);
      parsedLine.forEach(nodeUrl => {
        commit('addNodeUrlToNetworkNodes', nodeUrl);    
      });
    }
  },

  createNewBlock ( vuexContext, block ) {
    const newBlock = {
      index: vuexContext.state.chain.length + 1,
      timestamp: Date.now(),
      transactions: vuexContext.state.pendingTransactions,
      nonce: block.nonce,
      hash: block.hash,
      previousHash: block.previousHash    
    };

  
    // Clearing the transaction array after the block is created
    vuexContext.commit('clearPendingTransactions');
    // write newBlock to the chain
    vuexContext.commit('addBlockToChain', newBlock);

    // Overwrite blockchain file
    const blockchainFileContent = {
      chain: vuexContext.getters.chain,
      pendingTransactions: vuexContext.getters.pendingTransactions,
      networkNodes: vuexContext.getters.networkNodes
    }
    vuexContext.dispatch('writeBlockchainFile', blockchainFileContent);

  },

  addTransactionToPendingTransactions ({commit}, transaction) {
    console.log("addtransaction", transaction);
    commit('addTransactionToPendingTransactions', transaction);
  },

  clearPendingTransactions ({commit}) {
    commit('clearPendingTransactions');
  },

  setBlockchainFileName ( {commit}, fileName) {
    commit('setBlockchainFileName', fileName);
  },

  setCurrentNodeUrl ( {commit}, nodeUrl) {
    commit("setCurrentNodeUrl", nodeUrl);
  },

  writeBlockchainFile (context, blockchainFileContent) {
    if (process.server) {
      console.log("write blockchain file")
      const fs = require('fs');
      const data = JSON.stringify(blockchainFileContent.chain) + '\n' + JSON.stringify(blockchainFileContent.pendingTransactions) + '\n' + JSON.stringify(blockchainFileContent.networkNodes);
      try {
        fs.writeFileSync(context.getters.blockchainFileName, data);
        console.log("File written");
      } catch (error) {
        console.log("Error writing file");
      }
      
      // fs.writeFile(context.getters.blockchainFileName, data, (err) => {
      //   if (err) console.log(err);
      // });
    }
  }

  
}

export const getters = {
  chain (state) {
    return state.chain;
  },

  pendingTransactions (state) {
    return state.pendingTransactions;
  },

  networkNodes (state) {
    return state.networkNodes;
  },

  blockchainFileName (state) {
    return state.blockchainFileName;
  }
}
