import type { PlasmoCSConfig } from "plasmo";
import NavigationProcess from "~processes/navigation/tool";

import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(NavigationProcess);

export default () => null;
