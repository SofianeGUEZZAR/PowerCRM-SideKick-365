import type { PlasmoCSConfig } from "plasmo";
import MetadataBrowserProcess from "~processes/metadataBrowser/tool";

import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(MetadataBrowserProcess);

export default () => null;
