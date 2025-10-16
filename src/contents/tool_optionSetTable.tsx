import type { PlasmoCSConfig } from "plasmo";

import OptionSetTableProcess from "~processes/optionSetTable/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(OptionSetTableProcess);

export default () => null;
