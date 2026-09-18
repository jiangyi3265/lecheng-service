<script>
export default { onLaunch() {}, onShow() {}, onHide() {} };
</script>
<style>
page {
  background: #f6f6f6;
  font-family:
    -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC",
    "Microsoft YaHei", sans-serif;
  color: #333;
  font-size: 28rpx;
}
view,
text,
input,
button,
scroll-view {
  box-sizing: border-box;
}
button:after {
  border: 0;
}
button {
  font-family: inherit;
}
button:active,
[role="button"]:active {
  opacity: 0.8;
}
.empty-state {
  padding: 70rpx 24rpx;
  text-align: center;
  color: #9ca9b7;
  font-size: 26rpx;
  line-height: 1.8;
}
.empty-state text {
  display: block;
  color: #3a8cf8;
  margin-top: 18rpx;
}
.primary-button {
  background: #3e91ff;
  color: white;
  border-radius: 45rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  text-align: center;
}
.muted {
  color: #969fa8;
}
.block {
  display: block;
}
::-webkit-scrollbar {
  display: none;
}
/* #ifdef H5 */
body {
  margin: 0;
  background: #e9eff5;
}
uni-page-body {
  min-height: 100vh;
}
uni-input {
  font-family: inherit;
}
a,
button,
input {
  -webkit-tap-highlight-color: transparent;
}
@media (min-width: 760px) {
  #app {
    width: 414px;
    min-height: 100vh;
    margin: 0 auto;
    box-shadow: 0 0 45px #a7b6c755;
  }
  uni-page-wrapper {
    width: 414px !important;
    margin: 0 auto;
  }
  uni-page-body {
    width: 414px;
  }
  .bottom-nav,
  .assistant-composer,
  .detail-actions {
    max-width: 414px;
    margin-left: auto;
    margin-right: auto;
  }
}
/* #endif */
</style>
