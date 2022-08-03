import { getAllRoleList, isAccountExist } from '/@/api/demo/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import moment from 'moment';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 180,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customRender: ({ text }) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '电话',
    dataIndex: 'mobile',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'description',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'name',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            //console.log('user form value:' + value);

            isAccountExist(value)
              //.then((result) => resolve())
              .then((result) => {
                if (result.id != null || result.id != undefined) {
                  reject('用户名已经存在');
                }
                return resolve();
              })
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: false,
  },
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '角色',
    field: 'roleIds',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'name',
      valueField: 'code',
    },
    required: true,
    itemProps: { validateTrigger: 'blur' },
  },
  {
    field: 'dept',
    label: '所属部门',
    //component: 'TreeSelect',
    component: 'Input',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'name',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    required: true,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'description',
    component: 'InputTextArea',
  },
];
