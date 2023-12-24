import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'PUT',
      data: tradeMark
    })
  } else {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'POST',
      data: tradeMark
    })
  }
}

export const reqDeleteTradeMark = (id) => request({url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE'})
