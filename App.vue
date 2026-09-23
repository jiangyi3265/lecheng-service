<script>
import { ensureDemoData } from "./utils/demo-store";
import { auth } from "./utils/auth";
export default {
	onLaunch() {
		ensureDemoData();
	},
	onShow() { auth.ensureSession().catch(() => {}); },
};
</script>
<style>
@import "./styles/theme.css";
@import "./styles/details.css";
</style>
