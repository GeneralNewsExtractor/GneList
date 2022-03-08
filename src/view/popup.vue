<template>
  <div class="main_app">
    <h2>Gne List</h2>
    <el-form :inline="true">
      <el-form-item label="Name">
        <el-input type="text" v-model="name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="dedup">去重</el-checkbox>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="start">开始抓取</el-button>
  </div>
</template>

<script>
export default {
  name: 'popupView',
  data () {
    return {
      name: '',
      dedup: false
    }
  },
  methods: {
    start() {
      var name = this.name
      var dedup = this.dedup
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        var activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id, {command: 'trigger', 'name': name, 'dedup': dedup})
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
  width: 500px;
}
</style>
