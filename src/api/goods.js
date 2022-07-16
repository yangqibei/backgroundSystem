import request from '@/utils/request'
//! 增
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
//! 删
//! 改
//! 查
