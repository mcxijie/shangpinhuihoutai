import request from "@/utils/request";

export const reqSkuList = (page, limit) => request({url: `/admin/product/list/${page}/${limit}`, method: 'GET'});
export const reqSale = (skuId) => request({url: `/admin/product/onSale/${skuId}`, method: 'GET'});
export const reqCancel = (skuId) => request({url: `/admin/product/cancelSale/${skuId}`, method: 'GET'});
export const reqSkuById = (skuId) => request({url: `/admin/product/getSkuById/${skuId}`, method: 'GET'});
