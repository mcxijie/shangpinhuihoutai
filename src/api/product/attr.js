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
