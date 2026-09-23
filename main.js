// H5 提前加载基础按钮样式，确保 App 的设计样式在其后覆盖。
// #ifdef H5
import "@dcloudio/uni-components/style/button.css";
// #endif
import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
	...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
// #endif
