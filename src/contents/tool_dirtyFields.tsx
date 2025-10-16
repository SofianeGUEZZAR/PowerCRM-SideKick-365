import type { PlasmoCSConfig } from "plasmo";

import DirtyFieldsProcess from "~processes/dirtyFields/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(DirtyFieldsProcess);

export default () => null;
