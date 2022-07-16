import request from '@/utils/request'
//! 登录
/**
 *登录接口
 * @param {用户名，密码} param0
 * @returns
 */
export const login = ({ username, password }) => {
  return request({
    method: 'POST',
    url: 'login',
    data: {
      username,
      password
    }
  })
}
//! 增
/**
 *添加用户
 */
export const addUser = (data) => {
  return request({
    method: 'POST',
    url: 'users',
    data
  })
}
/**
 *添加角色
 * @param {角色名称，角色描述} data
 * @returns
 */
export const addNames = (data) => {
  return request({
    method: 'POST',
    url: 'roles',
    data
  })
}
/**
 *分配角色
 * @param {id,rid} param0
 * @returns
 */
export const changeName = ({ id, rid }) => {
  return request({
    method: 'PUT',
    url: `users/:${id}/role`,
    data: {
      id, rid
    }
  })
}
//! 删
/**
 *删除用户
 * @param {用户} id
 * @returns
 */
export const delUser = (id) => {
  return request({
    method: 'DELETE',
    url: `users/${id}`,
    data: {
      id
    }
  })
}
/**
 *删除角色
 * @param {角色名称，角色描述} data
 * @returns
 */
export const delNames = (id) => {
  return request({
    method: 'DELETE',
    url: `roles/${id}`,
    data: {
      id
    }
  })
}
/**
 *删除用户某个指定的权限
 * @param {*} param0
 * @returns
 */
export const delRightID = ({ roleId, rightId }) => {
  return request({
    method: 'DELETE',
    url: `roles/${roleId}/rights/${rightId}`,
    data: {
      rightId, roleId
    }
  })
}
//! 改
/**
 *更改用户状态
 * @param {id 和状态} param0
 * @returns
 */
export const changeState = ({ uid, type }) => {
  return request({
    method: 'PUT',
    url: `users/${uid}/state/${type}`,
    data: {
      uid,
      type
    }
  })
}
/**
 *修改个人信息
 * @param {用户id邮箱手机号} param0
 * @returns
 */
export const changeUserDetial = ({ id, email, mobile }) => {
  return request({
    method: 'PUT',
    url: `users/${id}`,
    data: {
      id, email, mobile
    }
  })
}
/**
 *编辑角色
 * @param {角色名称，角色描述} data
 * @returns
 */
export const editNames = ({ id, roleName, roleDesc }) => {
  return request({
    method: 'PUT',
    url: `roles/${id}`,
    data: {
      id, roleDesc, roleName
    }
  })
}
/**
 * 更改权限列表
 * @param {*} param0
 * @returns
 */
export const changeNameList = ({ roleId, rids }) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: {
      roleId, rids
    }
  })
}
//! 查
/**
 *用户数据列表
 * @param {查询参数，当前页码，每页显示条数} param0
 * @returns
 */
export const getUser = ({ query, pagenum, pagesize }) => {
  return request({
    method: 'GET',
    url: 'users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
/**
 *获取用户的详细资料
 * @param {用户id} id
 * @returns
 */
export const getUserDetial = (id) => {
  return request({
    method: 'GET',
    url: `users/${id}`,
    params: {
      id
    }
  })
}
/**
 *获得角色
 * @returns
 */
export const getName = () => {
  return request({
    method: 'GET',
    url: 'roles'
  })
}
/**
 *通过角色id获取角色
 * @param {角色id} id
 * @returns
 */
export const findNameById = (id) => {
  return request({
    method: 'GET',
    url: `roles/${id}`,
    data: {
      id
    }
  })
}
/**
 *获得树状分配角色
 * @returns
 */
export const getTree = () => {
  return request({
    method: 'GET',
    url: 'rights/tree'
  })
}
/**
 *获得列表分配角色
 * @returns
 */
export const getLIst = () => {
  return request({
    method: 'GET',
    url: 'rights/list'
  })
}
