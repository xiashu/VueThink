<template>
	<el-row class="container">
  		<el-col :span="24" class="header">
			<el-col :span="4" :class="collapsed?'logo-collapse-width':'logo-width'">
        <template v-if="logo_type == '1'">
           <img :src="img" class="logo"> 
        </template> 
         <template v-else>
          <span v-if="!collapsed" class="p-l-20 logo_title">{{title}}</span>
        </template>
			</el-col>
			<el-col :span="4">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="10" class="userinfo">
				<el-dropdown @command="handleMenu">
					<span class="el-dropdown-link userinfo-inner"> 
            {{username}}&nbsp;&nbsp;<i class="fa fa-user" aria-hidden="true"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
 
 
		<el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<leftMenu  :menuData="menuData" :menu="menu" :collapsed="collapsed" ref="leftMenu"></leftMenu>
			</aside>
 
      <section class="content-container">
				 <div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in" appear>
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section> 
		</el-col>
		<changePwd ref="changePwd"></changePwd>

	</el-row>
</template>
<style>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}
  
	.logout {
		background: url(../assets/images/logout_36.png);
		background-size: contain;
		width: 20px;
		height: 20px;
		float: left;
	}
	
	.logo {
		width: 150px;
		float: left;
		margin: 10px 10px 10px 18px;
	}
	
	.tip-logout {
		float: right;
		margin-right: 20px;
		padding-top: 5px;
		cursor: pointer;
	}
	
	.admin {
		color: #c0ccda;
		text-align: center;
	}
 
  
  .tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
        color: #000;
			}
 	.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
	}
	.menu-expanded{
			flex:0 0 230px; 
			width: 230px ;       
	}

  aside {
		flex:0 0 230px;
		width: 230px;
    background: #001529;
  }

	.el-menu{
			height: 100%;
      background: #001529!important;
     
	}
 
  .collapsed {

      width:60px;
  }
	 .item{
			position: relative;
	}

.content-container {
		 
		flex:1;		 
	  overflow-y: scroll;
    padding: 10px;
}

.breadcrumb-container .title {
 
		width: 200px;
		float: left;
		color: #475669;
}

.breadcrumb-inner {
		 float: right;				 
	}
 
 	.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
} 

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
  }

	.header {
		height: 60px;
		line-height: 60px;
	 	background: white;
		color: #c0ccda;
  }
	
  .userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
  }
		.header			.userinfo-inner {
					cursor: pointer;
					color: #000;
    }

 .main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden; 
      background: #f1f2f7;
}

.logo-width{
  width:230px;
  background: #002140;
}
.logo-collapse-width{
  width:60px
}

.el-menu{
    height: 100%;
   
  }
.submenu{
      position:absolute;
      top:0px;
      left:60px;
      z-index:99999;
      height:auto;
      display:none;
      background-color: #000c17;
    }
.logo_title{
    font-size: 20px;
    color: white;
    font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
    font-weight: 600;
}

.content-wrapper{
  padding:5px;
}

</style>
<script>
  import leftMenu from './Common/leftMenu.vue'
  import changePwd from './Account/changePwd.vue'
  import http from '../assets/js/http'

  export default {
    data() {
      return {
        username: '',
        topMenu: [],
        childMenu: [],
        menuData: [],
        hasChildMenu: false,
        menu: null,
        module: null,
        img: '',
        title: '',
        logo_type: null,
        collapsed:false,
      }
    },
    methods: {
      logout() {
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          _g.openGlobalLoading()
          let data = {
            authkey: Lockr.get('authKey'),
            sessionId: Lockr.get('sessionId')
          }
          this.apiPost('admin/base/logout', data).then((res) => {
            _g.closeGlobalLoading()
            this.handelResponse(res, (data) => {
              Lockr.rm('menus')
              Lockr.rm('authKey')
              Lockr.rm('rememberKey')
              Lockr.rm('authList')
              Lockr.rm('userInfo')
              Lockr.rm('sessionId')
              Cookies.remove('rememberPwd')
              _g.toastMsg('success', '退出成功')
              setTimeout(() => {
                router.replace('/')
              }, 1500)
            })
          })
        }).catch(() => {

        })
      },
      switchTopMenu(item) {
        if (!item.child) {
          router.push(item.url)
        } else {
          router.push(item.child[0].child[0].url)
        }
      },
      handleMenu(val) {
        switch (val) {
          case 'logout':
            this.logout()
            break
          case 'changePwd':
            this.changePwd()
            break
        }
      },
      changePwd() {
        this.$refs.changePwd.open()
      },
      getTitleAndLogo() {
     
        this.apiPost('admin/base/getConfigs').then((res) => {
      
          this.handelResponse(res, (data) => {
            document.title = data.SYSTEM_NAME
            this.logo_type = data.LOGO_TYPE           
            this.title = data.SYSTEM_NAME
            this.img = window.HOST + data.SYSTEM_LOGO
          })
        })
      },
      getUsername() {
        this.username = Lockr.get('userInfo').username
      },
      collapse:function(){
				this.collapsed=!this.collapsed;
			},
    },
    created() {
      this.getTitleAndLogo()
      let authKey = Lockr.get('authKey')
      let sessionId = Lockr.get('sessionId')
      if (!authKey || !sessionId) {
        _g.toastMsg('warning', '您尚未登录')
        setTimeout(() => {
          router.replace('/')
        }, 1500)
        return
      }
      this.getUsername()
      
      let menus = Lockr.get('menus')
      this.menu = this.$route.meta.menu
      this.module = this.$route.meta.module
      this.topMenu = menus
    
      _(menus).forEach((res) => {
        if (res.module == this.module) {
          this.menuData = res.child
          res.selected = true
        } else {
          res.selected = false
        }
      })
    },
    computed: {
      routerShow() {
        return store.state.routerShow
      },
      showLeftMenu() {
        this.hasChildMenu = store.state.showLeftMenu
        return store.state.showLeftMenu
      }
    },
    components: {
      leftMenu,
      changePwd
    },
    watch: {
      '$route' (to, from) {
        _(this.topMenu).forEach((res) => {
          if (res.module == to.meta.module) {
            res.selected = true
            if (!to.meta.hideLeft) {
              this.menu = to.meta.menu
              this.menuData = res.child
            }
          } else {
            res.selected = false
          }
        })
      }
    },
    mixins: [http]
  }
</script>
