<script>
import { ensureDemoData } from "./utils/demo-store";
import { auth } from "./utils/auth";
import { loadCatalog, loadExtras } from "./utils/lecheng-api";
import { startUnreadPolling, stopUnreadPolling } from "./utils/chat-unread";
export default {
		onLaunch() {
		ensureDemoData();
		loadCatalog().catch(() => {});
		loadExtras().catch(() => {});
	},
	onShow() {
		auth.ensureSession().catch(() => {});
		loadCatalog().catch(() => {});
		loadExtras().catch(() => {});
		startUnreadPolling();
	},
	onHide() { stopUnreadPolling(); },
};
</script>
<style>
@import "./styles/theme.css";
@import "./styles/details.css";
</style>
