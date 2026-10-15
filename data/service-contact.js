import { reactive } from 'vue';

// “我的”页底部联系方式。运营方在后台“客服设置 → 「我的」页联系方式”填写后由 loadExtras 覆盖；
// 未填写的项沿用这里的默认值。电话未配置时显示“待更新”，不发起拨号。
export const DEFAULT_SERVICE_CONTACT = Object.freeze({
  hours: '8:00—22:00',
  phone: '',
  address: '海南省博鳌镇乐城医疗先行区',
});
export const serviceContact = reactive({ ...DEFAULT_SERVICE_CONTACT });
