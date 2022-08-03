<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  //import { getDeptList } from '/@/api/demo/system';
  import { addUser, updateUser } from '/@/api/demo/system';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [
        registerForm,
        { setFieldsValue, updateSchema, resetFields, validate, clearValidate, getFieldsValue },
      ] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });

          //当弹出更新窗口时，禁用username 校验
          clearValidate('username');
        }

        //const treeData = await getDeptList();
        updateSchema([
          {
            field: 'pwd',
            show: !unref(isUpdate),
          },
          // {
          //   field: 'dept',
          //   componentProps: { treeData },
          // },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      const { createSuccessModal, createErrorModal } = useMessage();

      async function handleSubmit() {
        try {
          if (unref(isUpdate)) {
            //当弹出更新窗口时，禁用username 校验
            clearValidate('username');
          }

          setModalProps({ confirmLoading: true });
          // TODO custom api
          const fieldsValue = getFieldsValue();
          fieldsValue.roleIds = [fieldsValue.roleIds];
          let formFields = ['roleIds', 'deptId', 'name', 'mobile', 'mobile', 'email', 'username'];
          if (!unref(isUpdate)) {
            const values = await validate(formFields);
            console.log(values);
            //新增

            console.log('fieldsValue:' + fieldsValue);
            fieldsValue.password = '123456';
            //values.mobile = '13388886666';
            //values.roleIds = [];
            addUser(fieldsValue).then((result) => {
              console.log(result);
              if (result === true) {
                createSuccessModal({
                  title: '保存成功',
                  content: '用户：' + values.username + '保存成功！',
                });
                emit('success', {
                  isUpdate: unref(isUpdate),
                  values: { ...fieldsValue, id: rowId.value },
                });
                closeModal();
              } else {
                createErrorModal({
                  title: '保存失败',
                  content: result.mesg,
                });
              }
            });
          } else {
            //修改
            formFields.pop();
            //console.log('update modal validate formFiled:' + formFields);
            const values = await validate(formFields);
            //values.roleIds = [];
            values.id = rowId.value;
            updateUser(fieldsValue).then((result) => {
              console.log(result);
              if (result === true) {
                createSuccessModal({
                  title: '更新成功',
                  content: '用户信息更新成功！',
                });
                emit('success', {
                  isUpdate: unref(isUpdate),
                  values: { ...fieldsValue, id: rowId.value },
                });
                closeModal();
              } else {
                createErrorModal({
                  title: '更新失败',
                  content: result.mesg,
                });
              }
            });
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
