import type { PlasmoCSConfig } from "plasmo";

import SetConfigurationProcess from "~processes/setConfiguration/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(SetConfigurationProcess);

export default () => null;
