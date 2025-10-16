import type { PlasmoCSConfig } from "plasmo";

import ImpersonationProcess from "~processes/impersonation/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(ImpersonationProcess);

export default () => null;
