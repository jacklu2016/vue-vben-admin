import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModelReal } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
//import axios from 'axios'
//import qs from 'qs'

enum Api {
  //Login = '/login',
  Login = '/authorization-server/oauth/token?scope=read&grant_type=password',
  Logout = '/logout',
  //GetUserInfo = '/getUserInfo',
  GetUserInfo = '/organization/user',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
/*export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}*/

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  /*axios.post(
    Api.Login,
    qs.stringify({username: 'zhoutaoo',
                  password:'password',
                  }), // 传输时，需要字符化，并且要以import qs from 'qs';
    {headers: {'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='    
  }}
  )
  .then(function (response: any) {
    console.log(response);
    return response;
  })
  .catch(function (error: any) {
    console.log(error);
  });*/

  //return null;
  defHttp.setHeader({
    //'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ=',
  });

  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login + '&username=' + params.username + '&password=' + params.password,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(username: string) {
  return defHttp.get<GetUserInfoModelReal>(
    { url: Api.GetUserInfo + '?uniqueId=' + username },
    { errorMessageMode: 'none' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
