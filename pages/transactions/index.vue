<template>
  <div>
    <input v-model="sender" placeholder="sender">
    <input v-model="recipient" placeholder="recipient">
    <input v-model="amount" placeholder="amount">

    <button @click="addTransaction">Save</button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      sender: '',
      recipient: '',
      amount: 0
    }
  },

  methods: {
    addTransaction() {
      console.log("add transaction " + this.sender + "/" + this.recipient + "/" + this.amount);
      this.$store.dispatch('addTransactionToPendingTransactions', {sender: this.sender, recipient: this.recipient, amount: this.amount});
    }
  }
}
</script>
