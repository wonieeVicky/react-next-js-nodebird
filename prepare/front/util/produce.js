import produce, { enableES5 } from 'immer';

const preSettingProduce = (...args) => {
  enableES5();
  return produce(...args);
};

export default preSettingProduce;
