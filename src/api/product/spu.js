import request from "@/utils/request";

export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'GET',
  params: {category3Id}
})
