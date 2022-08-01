/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
  access_token: string;
  organization: string;
  name: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // roles: RoleInfo[];
  // // 用户id
  // userId: string | number;
  // // 用户名
  // username: string;
  // // 真实名字
  // realName: string;
  // // 头像
  // avatar: string;
  // // 介绍
  // desc?: string;

  // name: string;

  code: string;
  mesg: string;
  time: string;
  data: GetUserInfoModelReal;
  //   "data": {
  //     "id": "101",
  //     "createdBy": "system",
  //     "createdTime": "2022-07-28T08:23:14.000+0800",
  //     "updatedBy": "admin",
  //     "updatedTime": "2022-07-29T08:28:04.000+0800",
  //     "name": "超级管理员",
  //     "mobile": "13972255634",
  //     "username": "admin",
  //     "password": "$2a$10$Bp.yKXK.x6o6FDbxKTY6.OWYOnwPy63cvSm/6jLUbijgezafngTRS",
  //     "description": null,
  //     "enabled": true,
  //     "accountNonExpired": true,
  //     "credentialsNonExpired": true,
  //     "accountNonLocked": true,
  //     "roleIds": [
  //         "101"
  //     ],
  //     "deleted": "N"
  // }
}

export interface GetUserInfoModelReal {
  id: number;
  createdBy: string;
  name: string;
  mobile: string;
  username: string;
  description: string;
  roleIds: [];
  deleted: string;
}
