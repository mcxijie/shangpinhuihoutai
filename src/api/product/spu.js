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
