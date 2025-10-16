import type { PlasmoCSConfig } from "plasmo";
import AllFieldsProcess from "~processes/allFields/tool";

import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(AllFieldsProcess);

export default () => null;
