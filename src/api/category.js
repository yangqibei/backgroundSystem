import request from '@/utils/request'
//! 增
/**
 * 添加分类
 * @param {*} data
 * @returns
 */
export const addcategory = (data) => {
  return request({
    method: 'POST',
    url: 'categories',
    data
  })
}
/**
 *添加动态参数或者静态属性
 * @param {分类id,参数名称,only,many,} param0
 * @returns
 */
export const addcategories = ({ id, attr_name, attr_sel, attr_vals }) => {
  return request({
    method: 'POST',
    url: `categories/${id}/attributes`,
    data: { id, attr_name, attr_sel, attr_vals }
  })
}
/**
 *上传图片
 * @returns
 */
export const uploadImg = () => {
  return request({
    method: 'POST',
    url: 'upload'
  })
}
//! 删
/**
 *根据商品id删除分类
 * @param {分类id} param0
 * @returns
 */
export const delcategoriesById = (id) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}`,
    data: {
      id
    }
  })
}
/**
 *删除参数
 * @param {分类id 参数id} param0
 * @returns
 */
export const delcategories = ({ id, attrid }) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}/attributes/${attrid}`,
    data: {
      id, attrid
    }
  })
}
//! 改
/**
 *删除参数
 * @param {分类id 参数id} param0
 * @returns
 */
export const editcategories = ({ id, attrId, attr_name, attr_sel, attr_vals }) => {
  return request({
    method: 'PUT',
    url: `categories/${id}/attributes/${attrId}`,
    data: {
      id, attrId, attr_name, attr_sel, attr_vals
    }
  })
}
//! 查
/**
 * 获得商品分类数据列表
 * @returns
 */
export const getcategoriesList = (obj) => {
  return request({
    method: 'GET',
    url: 'categories',
    params: obj
  })
}
/**
 *根据商品id获得分类
 * @param {分类id} param0
 * @returns
 */
export const getcategoriesById = (obj) => {
  return request({
    method: 'GET',
    url: `categories/${obj.id}`,
    params: {
      id: obj.id
    }
  })
}
/**
 * 分类参数管理
 * @param {*only,many分类 ID,} obj
 * @returns
 */
export const getCateAttributes = (obj) => {
  return request({
    method: 'GET',
    url: `categories/${obj.id}/attributes`,
    params: {
      id: obj.id, sel: obj.sel
    }
  })
}
