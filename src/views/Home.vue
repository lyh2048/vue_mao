<template>
	<el-container>
		  <el-main>
			    <el-table
			      :data="articles.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
			      style="width: 100%">
			      <el-table-column
			        label="Index"
			        prop="index">
			      </el-table-column>
			      <el-table-column
			        label="Title"
			        prop="title">
			      </el-table-column>
			      <el-table-column
			        align="right">
			        <template slot="header" slot-scope="scope">
			          <el-input
			            v-model="search"
			            size="mini"
			            placeholder="输入关键字搜索"/>
			        </template>
			        <template slot-scope="scope">
			          <el-button
			            size="mini"
			            @click="gotoRead(scope.$index, scope.row)">阅读</el-button>
			        </template>
			      </el-table-column>
			    </el-table>
		  </el-main>
		  <el-footer>
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="currentPage"
			  :page-sizes="[10, 20, 30, 40]"
			  :page-size="pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		  </el-footer>
	</el-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
	  return {
		  articles: [],
		  total: 0,
		  currentPage: 1,
		  pageSize: 10,
		  search: ''
	  }
  },
  methods: {
	getArticles(page, limt) {
	  axios.get(`/article/articles?page=${page}&limit=${limt}`).then(resp => {
		  if (resp.data.code === 0) {
			  this.articles = resp.data.data.articles
			  this.total = resp.data.data.total
			  this.currentPage = resp.data.data.page
			  this.pageSize = resp.data.data.size
		  }
	  }).catch(err => {
		  console.log(err)
	  })
	},
	handleSizeChange(val) {
	  this.getArticles(this.currentPage, val)
	},
	handleCurrentChange(val) {
	  this.getArticles(val, this.pageSize)
	},
	gotoRead(index, row) {
		const id = row.index
		this.$router.push({
			path: `/detail/${id}`
		})
	}
  },
  created() {
  	this.getArticles(1, 10)
  }
}
</script>
<style>
	.el-container {
		height: 100%;
	}
	.el-main {
		margin-top: 10px;
		text-align: center;
	}
	.el-footer {
		text-align: center;
	}
</style>
