import { UserInfo } from 'os';
import {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  //AccountList = '/system/getAccountList',
  AccountList = '/organization/user/conditions',
  //IsAccountExist = '/system/accountExist',
  IsAccountExist = '/organization/user',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  //GetAllRoleList = '/system/getAllRoleList',
  GetAllRoleList = '/organization/role/all',
  addUser = '/organization/user',
  deleteUser = '/organization/user/',
  updateUser = '/organization/user/',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.post<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const isAccountExist = (account: string) =>
  defHttp.get(
    { url: Api.IsAccountExist + '?uniqueId=' + account, params: { account } },
    { errorMessageMode: 'none' },
  );

export const addUser = (params: any) => defHttp.post({ url: Api.addUser, params });

export const deleteUser = (params: any) => defHttp.delete({ url: Api.deleteUser, params });

export const updateUser = (params: any) => defHttp.put({ url: Api.updateUser + params.id, params });
