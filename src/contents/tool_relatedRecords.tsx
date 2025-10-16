import type { PlasmoCSConfig } from "plasmo";

import RelatedRecordsProcess from "~processes/relatedRecords/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(RelatedRecordsProcess);

export default () => null;
