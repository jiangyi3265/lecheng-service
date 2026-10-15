import { reactive, computed } from 'vue';

// 默认位置：综合服务中心建筑质心，OpenStreetMap way 1117890318 (WGS84 19.15094955,110.494251225)。
// https://www.openstreetmap.org/way/1117890318
// 下列坐标已转换为微信/高德/腾讯使用的 GCJ-02；不是医院入口或园区边界。
// 后台“园区导航”发布后由 loadExtras 覆盖（后台坐标同为 GCJ-02）；接口不可用时显示这里的内置内容。
export const DEFAULT_PARK_GUIDE = Object.freeze({
  title: '博鳌乐城国际医疗旅游先行区',
  address: '海南省琼海市博鳌镇',
  note: '地图标记为园区综合服务中心。前往医院，请在地图中确认具体院区与入口。',
  markerName: '乐城综合服务中心',
  latitude: 19.149250,
  longitude: 110.498542,
});
export const destination = reactive({ ...DEFAULT_PARK_GUIDE });

// GCJ-02 → WGS84：OpenStreetMap 使用 WGS84，直接用 GCJ-02 坐标标记会偏几百米。迭代反算，误差远小于 1 米。
const AXIS = 6378245.0, EE = 0.00669342162296594323;
function offsetLat(x, y) {
  let value = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
  value += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
  value += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
  return value;
}
function offsetLng(x, y) {
  let value = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
  value += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
  value += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
  return value;
}
export function wgs84ToGcj02(latitude, longitude) {
  const radian = latitude / 180 * Math.PI;
  const magic = 1 - EE * Math.sin(radian) * Math.sin(radian);
  const root = Math.sqrt(magic);
  const dLat = offsetLat(longitude - 105, latitude - 35) * 180 / ((AXIS * (1 - EE)) / (magic * root) * Math.PI);
  const dLng = offsetLng(longitude - 105, latitude - 35) * 180 / (AXIS / root * Math.cos(radian) * Math.PI);
  return { latitude: latitude + dLat, longitude: longitude + dLng };
}
export function gcj02ToWgs84(latitude, longitude) {
  let result = { latitude, longitude };
  for (let step = 0; step < 5; step++) {
    const shifted = wgs84ToGcj02(result.latitude, result.longitude);
    result = { latitude: result.latitude - (shifted.latitude - latitude), longitude: result.longitude - (shifted.longitude - longitude) };
  }
  return result;
}

// 地图应用里显示的地点名称：标记文字，未填写时用园区名称
export const placeName = (place) => place.markerName || place.title;
export function amapUrlFor(place) {
  return 'https://uri.amap.com/marker?position=' + place.longitude + ',' + place.latitude + '&name=' + encodeURIComponent(placeName(place)) + '&src=lecheng-service&coordinate=gaode&callnative=1';
}
export function tencentUrlFor(place) {
  return 'https://apis.map.qq.com/uri/v1/marker?marker=' + encodeURIComponent(`coord:${place.latitude},${place.longitude};title:${placeName(place)};addr:${place.address}`) + '&referer=lecheng-service';
}
// 网页版内嵌 OpenStreetMap：取景范围相对标记点固定（西 0.03325°、东 0.02075°、南 0.01595°、北 0.04305°），
// 默认位置下与原先写死的地址完全一致——标记在综合服务中心，园区主体在其北侧
export function osmEmbedUrlFor(place) {
  const point = gcj02ToWgs84(place.latitude, place.longitude);
  const bbox = [point.longitude - 0.03325, point.latitude - 0.01595, point.longitude + 0.02075, point.latitude + 0.04305].map((value) => value.toFixed(3));
  return 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox.join('%2C') + '&layer=mapnik&marker=' + point.latitude.toFixed(5) + '%2C' + point.longitude.toFixed(5);
}
export const amapUrl = computed(() => amapUrlFor(destination));
export const tencentUrl = computed(() => tencentUrlFor(destination));
export const osmEmbedUrl = computed(() => osmEmbedUrlFor(destination));
