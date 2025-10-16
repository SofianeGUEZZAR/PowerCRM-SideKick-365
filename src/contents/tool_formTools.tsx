import type { PlasmoCSConfig } from "plasmo";

import FormToolsV2Process from "~processes/formToolsv2/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(FormToolsV2Process);

export default () => null;
