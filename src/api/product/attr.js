import request from "@/utils/request";

export const getCategory1List = () => request({url: "/admin/product/getCategory1", method: "get"});
export const getCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: "get"
});
export const getCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: "get"
});
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: "get"
});
export const reqAttrAdd = (data) => request({url: "/admin/product/saveAttrInfo", method: "post", data});
