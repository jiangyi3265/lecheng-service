<script>
import { ensureDemoData } from "./utils/demo-store";
import { auth } from "./utils/auth";
import { loadCatalog } from "./utils/lecheng-api";
export default {
		onLaunch() {
		ensureDemoData();
		loadCatalog().catch(() => {});
	},
	onShow() { auth.ensureSession().catch(() => {}); loadCatalog().catch(() => {}); },
};
</script>
<style>
@import "./styles/theme.css";
@import "./styles/details.css";
</style>
