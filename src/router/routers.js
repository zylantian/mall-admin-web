import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home', affix: true, noCache: true}
    },
     {
       path: 'updatePwd',
       name: 'updatePwd',
       component: () => import('@/views/sys/user/resetpwd'),
       meta: {title: '修改密码'},
       hidden:true
     }
    ]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '商品', icon: 'product'},
    hidden: true,
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: {title: '商品列表', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加商品', icon: 'product-add'}
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '修改商品', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'productRecycle',
        name: 'productRecycle',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品回收站', icon: 'product-recycle'},
        hidden: true
      },
      {
        path: 'productComment',
        name: 'productComment',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品评价', icon: 'product-comment'},
        hidden: true
      },
      {
        path: 'productCate',
        name: 'productCate',
        component: () => import('@/views/pms/productCate/index'),
        meta: {title: '商品分类', icon: 'product-cate'}
      },
      {
        path: 'addProductCate',
        name: 'addProductCate',
        component: () => import('@/views/pms/productCate/add'),
        meta: {title: '添加商品分类'},
        hidden: true
      },
      {
        path: 'updateProductCate',
        name: 'updateProductCate',
        component: () => import('@/views/pms/productCate/update'),
        meta: {title: '修改商品分类'},
        hidden: true
      },
      {
        path: 'productAttr',
        name: 'productAttr',
        component: () => import('@/views/pms/productAttr/index'),
        meta: {title: '商品类型', icon: 'product-attr'}
      },
      {
        path: 'productAttrList',
        name: 'productAttrList',
        component: () => import('@/views/pms/productAttr/productAttrList'),
        meta: {title: '商品属性列表'},
        hidden: true
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: {title: '修改商品属性'},
        hidden: true
      },
      {
        path: 'brand',
        name: 'brand',
        component: () => import('@/views/pms/brand/index'),
        meta: {title: '品牌管理', icon: 'product-brand'}
      },
      {
        path: 'addBrand',
        name: 'addBrand',
        component: () => import('@/views/pms/brand/add'),
        meta: {title: '添加品牌'},
        hidden: true
      },
      {
        path: 'updateBrand',
        name: 'updateBrand',
        component: () => import('@/views/pms/brand/update'),
        meta: {title: '编辑品牌'},
        hidden: true
      },
      {
        path: 'regionList',
        name: 'regionList',
        component: () => import('@/views/pms/region/index'),
        meta: {title: '商品区域价格列表'},
        hidden: true
      },
      {
        path: 'regionPrice',
        name: 'regionPrice',
        component: () => import('@/views/pms/region/add'),
        meta: {title: '商品区域价格设定'},
        hidden: true
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    hidden: true,
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: {title: '订单列表', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'unrealOrder',
        name: 'unrealOrder',
        component: () => import('@/views/oms/order/unrealIndex'),
        meta: {title: '虚拟商品订单', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'orderStatistics',
        name: 'orderStatistics',
        component: () => import('@/views/oms/statistics/index'),
        hidden: true,
        meta: {title: '订单统计', icon: 'order-statistics'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: {title: '订单详情'},
        hidden:true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: {title: '发货列表'},
        hidden:true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        hidden: true,
        meta: {title: '订单设置', icon: 'order-setting'}
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/oms/apply/index'),
        hidden: true,
        meta: {title: '换货申请处理', icon: 'order-return'}
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/oms/apply/reason'),
        hidden: true,
        meta: {title: '换货原因设置', icon: 'order-return-reason'}
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/oms/apply/applyDetail'),
        meta: {title: '换货原因详情'},
        hidden:true
      },
      {
        path: 'billList',
        name: 'billList',
        component: () => import('@/views/oms/bill/index'),
        meta: {title: '发票审核', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'billDetail',
        name: 'billDetail',
        component: () => import('@/views/oms/bill/detail'),
        meta: {title: '发票详情'},
        hidden:true
      },
      {
        path: 'addBillDelivery',
        name: 'addBillDelivery',
        component: () => import('@/views/oms/bill/detail'),
        meta: {title: '邮寄专票'},
        hidden:true
      },
      {
        path: 'billOrderList',
        name: 'billOrderList',
        component: () => import('@/views/oms/bill/orderList'),
        meta: {title: '发票订单列表'},
        hidden:true
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/stockOrderList',
    name: 'oms',
    meta: {title: '进销存管理', icon: 'order'},
    hidden: true,
    children: [
      {
        path: 'stockOrderList',
        name: 'stockOrderList',
        component: () => import('@/views/stock/order/index'),
        meta: {title: '进销存管理', icon: 'product-list'},
        hidden: true,
      },
      {
        path: 'addStockOrder',
        name: 'addStockOrder',
        component: () => import('@/views/stock/order/add'),
        meta: {title: '新增调拨单', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'insertStockOrder',
        name: 'insertStockOrder',
        component: () => import('@/views/stock/order/insert'),
        meta: {title: '新增入库单', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'stockOrderDetail',
        name: 'stockOrderDetail',
        component: () => import('@/views/stock/order/detail'),
        meta: {title: '调拨单详情', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'addDelivery',
        name: 'addDelivery',
        component: () => import('@/views/stock/order/delivery'),
        meta: {title: '新增发货单', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'deliveryDetail',
        name: 'deliveryDetail',
        component: () => import('@/views/stock/order/deliveryDetail'),
        meta: {title: '发货单详情', icon: 'product-list'},
        hidden: true
      }
    ]
  },
  {
    path: '/sales',
    component: Layout,
    name: 'oms',
    meta: {title: '商户管理', icon: 'sales'},
    hidden: true,
    children: [
      {
        path: 'regionlist',
        name: 'regionList',
        component: () => import('@/views/sys/sales/regionList'),
        meta: {title: '商户区域列表', icon: 'product-list'},
        hidden: true
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  }
  /*{
    path:'/sys',
    component: Layout,
    redirect: '/sys/region',
    name: 'sys',
    meta: {title: '系统设置', icon: 'system'},
    children: [
      {
        path: 'region',
        name: 'region',
        component: () => import('@/views/sys/region/index'),
        meta: {title: '区域设置', icon: 'sms-flash'}
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/sys/department/index'),
        meta: {title: '部门设置', icon: 'dept'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/sys/role/index'),
        meta: {title: '角色设置', icon: 'role'}
      }
    ]
  }*/
  /*{
    path:'/sms',
    component: Layout,
    redirect: '/sms/coupon',
    name: 'sms',
    meta: {title: '营销', icon: 'sms'},
    children: [
      {
        path: 'flash',
        name: 'flash',
        component: () => import('@/views/sms/flash/index'),
        meta: {title: '秒杀活动列表', icon: 'sms-flash'}
      },
      {
        path: 'flashSession',
        name: 'flashSession',
        component: () => import('@/views/sms/flash/sessionList'),
        meta: {title: '秒杀时间段列表'},
        hidden:true
      },
      {
        path: 'selectSession',
        name: 'selectSession',
        component: () => import('@/views/sms/flash/selectSessionList'),
        meta: {title: '秒杀时间段选择'},
        hidden:true
      },
      {
        path: 'flashProductRelation',
        name: 'flashProductRelation',
        component: () => import('@/views/sms/flash/productRelationList'),
        meta: {title: '秒杀商品列表'},
        hidden:true
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/sms/coupon/index'),
        meta: {title: '优惠券列表', icon: 'sms-coupon'}
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/sms/coupon/add'),
        meta: {title: '添加优惠券'},
        hidden:true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/sms/coupon/update'),
        meta: {title: '修改优惠券'},
        hidden:true
      },
      {
        path: 'couponHistory',
        name: 'couponHistory',
        component: () => import('@/views/sms/coupon/history'),
        meta: {title: '优惠券领取详情'},
        hidden:true
      },
      {
        path: 'brand',
        name: 'homeBrand',
        component: () => import('@/views/sms/brand/index'),
        meta: {title: '品牌推荐', icon: 'product-brand'}
      },
      {
        path: 'new',
        name: 'homeNew',
        component: () => import('@/views/sms/new/index'),
        meta: {title: '新品推荐', icon: 'sms-new'}
      },
      {
        path: 'hot',
        name: 'homeHot',
        component: () => import('@/views/sms/hot/index'),
        meta: {title: '人气推荐', icon: 'sms-hot'}
      },
      {
        path: 'subject',
        name: 'homeSubject',
        component: () => import('@/views/sms/subject/index'),
        meta: {title: '专题推荐', icon: 'sms-subject'}
      },
      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/sms/advertise/index'),
        meta: {title: '广告列表', icon: 'sms-ad'}
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/sms/advertise/add'),
        meta: {title: '添加广告'},
        hidden:true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/sms/advertise/update'),
        meta: {title: '编辑广告'},
        hidden:true
      }
    ]
  }*/,
  //{path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  mode: 'hash', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

