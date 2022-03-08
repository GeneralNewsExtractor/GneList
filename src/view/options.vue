<template>
  <div class="main_app">
    <el-dialog title="更新规则" :visible.sync="show_update_dialog">
      <el-form>
        <el-form-item label="Name">
          <el-input type="text" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input type="text" v-model="url"></el-input>
        </el-form-item>
        <el-form-item label="XPath">
          <el-input type="text" v-model="xpath"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="update">更新</el-button>
      <el-button type="primary" @click="show_update_dialog=false">取消</el-button>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delete_dialog"
      width="30%"
      >
      <span>确定删除这条规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="do_delete">确 定</el-button>
        <el-button @click="delete_dialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-form :inline="true">
        <el-form-item label="后端地址">
            <el-input v-model="backend_address" style="width: 240px;"></el-input>
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
        prop="name"
        label="Name"
        width="200">
      </el-table-column>
      <el-table-column
        prop="url"
        label="URL">
      </el-table-column>
      <el-table-column
        prop="xpath"
        label="XPath">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.$index, scope.row)" type="text">编辑</el-button>
          <el-button @click="delete_rule(scope.$index, scope.row)" type="text">删除</el-button>
        </template>
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
      show_update_dialog: false,
      name: '',
      url: '',
      xpath: '',
      rule_id: '',
      delete_dialog: false,
      delete_index: -1
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
        edit(index, row) {
            console.log('edit...', index, row)
            this.name = row.name
            this.url = row.url
            this.xpath = row.xpath 
            this.rule_id = row._id 
            this.show_update_dialog = true
            // this.$refs.edit_dialog.show(index, row)
        },
        update() {
            console.log('update...')
            axios.put(this.backend_address, {
                name: this.name,
                url: this.url,
                xpath: this.xpath,
                rule_id: this.rule_id
            }).then(response => {
              console.log(response.data)
                this.query_rules()
                this.show_update_dialog = false
            })
        
        },
        delete_rule(index, row) {
          this.rule_id = row._id
          this.delete_dialog = true 
          this.delete_index = index
        },
        do_delete() {
          axios.delete(this.backend_address + '/' + this.rule_id).then(response => {
            console.log(response.data)
            this.rules.splice(this.delete_index, 1)
            this.delete_dialog = false
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
