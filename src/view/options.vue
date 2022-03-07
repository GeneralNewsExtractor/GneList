<template>
  <div class="main_app">
    <el-form :inline="true">
        <el-form-item label="后端地址">
            <el-input v-model="backend_address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-table
      :data="rules"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="url"
        label="URL"
        width="320">
      </el-table-column>
      <el-table-column
        prop="xpath"
        label="XPath">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'optionsView',
  data () {
    return {
      backend_address: 'http://localhost:8800/rule',
      rules: [],
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
                    console.log('current backend_address:', backend_address)
                    this.query_rules()

                }
            })
        },
        submit() {
            console.log('click...')
            if (this.backend_address) {
                chrome.storage.sync.set({'backend_address': this.backend_address})
                console.log('set backend to ' + this.backend_address)
            }
        },
        query_rules() {
            console.log('query rules...')
            axios.get(this.backend_address).then(response => {
                this.rules = response.data.rules
            })
        },
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
