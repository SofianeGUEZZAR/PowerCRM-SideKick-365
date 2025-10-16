import type { PlasmoCSConfig } from "plasmo";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

import PluginTraceLogsExplorerButton from "~processes/pluginTraceLogsExplorer/main";

export const config: PlasmoCSConfig = {
        matches: ["*://*/*"],
        world: "MAIN"
    };
export const getRootContainer = buildGetRootContainer(PluginTraceLogsExplorerButton);

export default () => null;
