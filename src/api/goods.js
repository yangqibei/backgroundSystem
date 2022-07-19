import request from '@/utils/request'
//! 增
/**
 * 添加商品
 * @param {*} data
 * @returns
 */
export const AddGoodList = (data) => {
  return request({
    method: 'POST',
    url: 'goods',
    data
  })
}

//! 删
/**
 *删除商品
 * @param {*} id
 * @returns
 */
export const DelGoods = (id) => {
  return request({
    method: 'DELETE',
    url: `goods/${id}`,
    params: {
      id
    }
  })
}
//! 改
export const editGoods = ({ id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    method: 'PUT',
    url: `goods/${id}`,
    data: {
      id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs
    }
  })
}
//! 查
/**
 *获取商品列表
 * @param {query,pagenum,pagesize} params
 * @returns
 */
export const getGoodList = (params) => {
  return request({
    method: 'GET',
    url: 'goods',
    params
  })
}
/**
 *根据商品id获得商品
 * @param {商品id} param0
 * @returns
 */
export const getGoodsById = (obj) => {
  return request({
    method: 'GET',
    url: `goods/${obj.id}`,
    params: {
      id: obj.id
    }
  })
}
