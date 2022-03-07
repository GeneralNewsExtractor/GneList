<template>
  <div class="main_app">
    <el-form>
        <el-form-item label="后端地址">
            <el-input v-model="backend_address"></el-input>
        </el-form-item>
    </el-form>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<script>
export default {
  name: 'optionsView',
  data () {
    return {
      backend_address: 'http://localhost:8800/rule'
    }
  },
  mounted() {
        this.read_saved_data()
    },
    methods: {
        read_saved_data() {
            chrome.storage.sync.get('backend_address', ({backend_address}) => {
                if (backend_address) {
                    this.backend_address = backend_address
                }
            })
        },
        submit() {
            console.log('click...')
            if (this.backend_address) {
                chrome.storage.sync.set({'backend_address': this.backend_address})
                console.log('set backend to ' + this.backend_address)
            }
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
