import request from '@/utils/request'
export { get } from '@/api/common.js'
export function getPage(pageNum, pageSize) {
    return request({
        url: '/dump-record/page/',
        method: 'get',
        data: {
            pageNum: pageNum,
            pageSize: pageSize		//user_id为接口请求关键字,7为参数值
        }
    })
}
export function getJinNniuToday(start,end,pageNum,pageSize) {
    return request({
        url: '/dump-record/period/' + start + '/'+end,
        method: 'get',
        // data: {
        //     pageNum: pageNum,
        //     pageSize: pageSize		//user_id为接口请求关键字,7为参数值
        // }
    })
}
export function getQuery(site_name, transporter, start, end, pageNum, pageSize) {
    return request({
        url: '/dump-record/page/' + site_name + '/' + transporter + '/' + start + '/' + end + '/' + pageNum + '/' + pageSize,
        method: 'get',
        // params: {
        //     pageNum: pageNum,
        //     pageSize: pageSize		//user_id为接口请求关键字,7为参数值
        // }
    })
}
export function getCarGps(car_number,start,end){
    return request({
        url: '/gps-record/track/'+car_number+'/'+start+'/'+end,
        method: 'get'
    })
}
export function getCars(){
    return request({
        url: '/car',
        method: 'get'
    })
}

export function getAllGps(){
    return request({
        url: '/gps-record/latest_location/all'+'/',
        method: 'get'
    })
}