<template>
<div>  

	<el-menu :default-active="$route.path"  style="width: 230px;"
						text-color="#fff"
						active-text-color="#fff"
					  unique-opened router v-show="!collapsed"  >
					<template v-for="(item,index) in menuData" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.icon"></i>{{item.title}}</template>
							<el-menu-item v-for="child in item.child" :key="child.id" :index="child.url" v-if="!child.hidden" >{{child.title}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.child.length>0" :index="item.child[0].url"><i :class="item.icon"></i>{{item.child[0].title}}</el-menu-item>
					</template>
	</el-menu>
  
				<!--导航菜单-折叠后-->
				<ul class="el-menu collapsed"  v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in menuData" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.icon"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.child" v-if="!child.hidden" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.url?'is-active':'menu_title'" @click="$router.push(child.url)">{{child.title}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.child[0].url?'is-active':''" @click="$router.push(item.child[0].url)"><i :class="item.icon"></i></div>
							</li>
						</template>
					</li>
				</ul>
	</div>
</template>
<style>
   .menu_title{
		 color: #fff;	
	} 

 

 .el-menu-item{
	color: white;
	opacity: 0.6;
	font-weight: 600;
 }

.el-submenu__title {
	color: white!important;
	opacity: 0.6;
	font-weight: 600;
}

.el-submenu__title:hover ,.el-menu-item:hover{
   	opacity: 1;
		background-color:#1890ff;
 }


.is-active{
		 color: #fff!important;    
		  	background-color:#1890ff;
	}

	.el-menu > li.is-active{
  	background-color:transparent;
	opacity: 1;

	}
  
</style>

<script>
export default {
  props: ['menuData', 'menu','collapsed'],
  data() {
    return {
    }
  },
  methods: {
    routerChange(item) 	{

      // 与当前页面路由相等则刷新页面
      if (item.url != this.$route.path) {
        router.push(item.url)
      } else {
        _g.shallowRefresh(this.$route.name)
      }
    },

	showMenu(i,status)
	{
	  	this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
	    
	}
},
}
</script>
 