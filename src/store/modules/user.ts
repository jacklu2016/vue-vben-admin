import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';

function setCookie(c_name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toUTCString());
}

function getCookie(name) {
  const arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (document.cookie.match(reg)) return arr[2];
  else return null;
}

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

function printObj(foo: object) {
  for (const key in foo) {
    console.log(key + ':' + (foo as any)[key]); // 报错消失
    // do something
  }
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setCookie('Admin-Token', this.token, 100);
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);

        const token = data.access_token;
        //仅仅设置username, 在下方getuserinfo方法中能获取username
        this.setUserInfo({
          username: data.organization,
          userId: '',
          realName: '',
          avatar: '',
          roles: [],
          name: data.name,
        });
        // save token
        this.setToken(token);

        console.log('login return user info :');
        printObj(this.getUserInfo);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      console.debug('admin-token cookie: {} ' + getCookie('Admin-cookie'));
      setCookie('Admin-Token', this.token, 100);
      const userInfo = await this.getUserInfoAction();
      /*const userInfo = {
        userId: '1',
        username: 'vben',
        realName: 'Vben Admin',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
        desc: 'manager',
        password: '123456',
        token: 'fakeToken1',
        homePath: '/dashboard/analysis',
        roles: [
          {
            roleName: 'Super Admin',
            value: 'super',
          },
        ],
      };*/
      //userInfo.homePath = 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640';
      /*this.setUserInfo({
        username: data.organization,
        userId: '',
        realName: '',
        avatar: '',
        roles: [],
        name: data.name,
      });*/

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      console.debug('user_info_key:' + USER_INFO_KEY);
      const userInfo = await getUserInfo(this.getUserInfo.username);
      console.log('get userinfo:');
      printObj(this.getUserInfo);
      const { roleIds = [] } = userInfo;
      if (isArray(roleIds)) {
        const roleList = new Array<RoleEnum>();
        for (let i = 0; i < roleIds.length; i++) {
          roleList.push(roleIds[i] as RoleEnum);
        }
        //const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roleIds = [];
        this.setRoleList([]);
      }
      this.setUserInfo({
        username: userInfo.username,
        userId: userInfo.id,
        realName: userInfo.name,
        avatar: '',
        roles: userInfo.roleIds,
        name: userInfo.name,
      });
      console.log('get userinfo manual setting:');
      printObj(this.getUserInfo);
      return this.getUserInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
