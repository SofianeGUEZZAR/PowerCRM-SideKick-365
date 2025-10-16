import type { PlasmoCSConfig } from "plasmo";
import EntityListProcess from "~processes/entitiesList/tool";

import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(EntityListProcess);

export default () => null;
