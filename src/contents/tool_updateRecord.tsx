import type { PlasmoCSConfig } from "plasmo";

import UpdateRecordProcess from "~processes/updateRecord/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(UpdateRecordProcess);

export default () => null;
