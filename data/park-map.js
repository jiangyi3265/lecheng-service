// 综合服务中心建筑质心：OpenStreetMap way 1117890318 (WGS84 19.15094955,110.494251225)。
// https://www.openstreetmap.org/way/1117890318
// 下列坐标已转换为微信/高德/腾讯使用的 GCJ-02；不是医院入口或园区边界。
export const destination = {
  latitude: 19.149250,
  longitude: 110.498542,
  name: '博鳌乐城国际医疗旅游先行区综合服务中心',
  address: '海南省琼海市博鳌镇乐城医疗先行区',
};
export const amapUrl = 'https://uri.amap.com/search?keyword=' + encodeURIComponent('博鳌乐城国际医疗旅游先行区') + '&city=' + encodeURIComponent('琼海') + '&view=map&src=lecheng-service&callnative=1';
export const tencentUrl = 'https://apis.map.qq.com/uri/v1/marker?marker=' + encodeURIComponent(`coord:${destination.latitude},${destination.longitude};title:${destination.name};addr:${destination.address}`) + '&referer=lecheng-service';
