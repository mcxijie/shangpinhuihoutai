import request from "@/utils/request";

export const reqSpuImageList = (spuId) => request({url: `/admin/product/spuImageList/${spuId}`, method: "GET"});

export const reqSpuSaleAttrList = (spuId) => request({url: `/admin/product/spuSaleAttrList/${spuId}`, method: "GET"});

export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: "GET"
});
