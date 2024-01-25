<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage">
    <button @click="sendMessage">Send</button>
    <div v-for="msg in messages" :key="msg.id">{{ msg.text }}</div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      message: '',
      messages: []
    };
  },
  created() {
    this.socket = io('http://192.168.3.45:3000');

    this.socket.on('message', (msg) => {
      this.messages.push(msg);
    });
  },
  methods: {
    sendMessage() {
      if (this.message.trim()) {
        this.socket.emit('message', { text: this.message });
        this.message = '';
      }
    }
  }
};
</script>
