<template>
  <div class="main_app">
    <el-button type="primary" @click="start">开始抓取</el-button>
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      msg: 'popup'
    }
  },
  methods: {
    start() {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'trigger', 'name': 'xxx'})
          })
    }
  }
}

</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
