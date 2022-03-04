<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
	    <h2>{{article.title}}</h2>
	    <el-button style="float: right; padding: 3px 0" type="text" @click="gotoHome()">返回主页</el-button>
	  </div>
	  <div class="text item" v-html="article.content"></div>
	</el-card>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'Detail',
		data() {
			return {
				article: ''
			}
		},
		methods: {
			gotoHome() {
				this.$router.push({
					path: '/'
				})
			}
		},
		created() {
			const index = this.$route.params.id
			axios.get(`/article/${index}`).then(resp => {
				if (resp.data.code === 0) {
					const articles = resp.data.data
					if (articles.length > 0) {
						this.article = articles[0]
					}
				}
			}).catch(err => {
				console.log(err)
			})
		}
	}
</script>

<style>
  .text {
	font-size: 14px;
  }
  .item {
	margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
	display: table;
	content: "";
  }
  .clearfix:after {
	clear: both
  }
  .box-card {
	width: 100%;
  }
</style>
