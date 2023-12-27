import request from "@/utils/request";

export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'GET',
  params: {category3Id}
});
export const reqSpu = (spuId) => request({url: `/admin/product/getSpuById/${spuId}`, method: 'GET'});
export const reqTradeMarkList = () => request({url: '/admin/product/baseTrademark/getTrademarkList', method: 'GET'});
export const reqSpuImageList = (spuId) => request({url: `/admin/product/spuImageList/${spuId}`, method: 'GET'});
export const reqBaseSaleAttrList = () => request({url: '/admin/product/baseSaleAttrList', method: 'GET'});
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({url: `/admin/product/updateSpuInfo`, method: 'POST', data: spuInfo});
  } else {
    return request({url: `/admin/product/saveSpuInfo`, method: 'POST', data: spuInfo});
  }
};
export const reqDeleteSpu = (spuId) => request({url: `/admin/product/deleteSpu/${spuId}`, method: 'DELETE'});
