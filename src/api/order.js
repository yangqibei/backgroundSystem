import request from '@/utils/request'
//! 增
//! 删
//! 改
/**
 *修改订单状态
 * @param {*} param0
 * @returns
 */
export const editOrder = ({ id, is_send, order_pay, order_price, order_number, pay_status }) => {
  return request({
    method: 'PUT',
    url: `orders/${id}`,
    data: {
      id, is_send, order_pay, order_price, order_number, pay_status
    }
  })
}
//! 查
/**
 *获得订单数据列表
 * @param {*} params
 * @returns
 */
export const getOrdersList = (params) => {
  return request({
    url: 'orders',
    method: 'GET',
    params
  })
}
export const getlogistics = (id) => {
  return request({
    method: 'GET',
    url: `/kuaidi/${id}`
  })
}
