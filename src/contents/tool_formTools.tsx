import type { PlasmoCSConfig } from "plasmo";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

import FormToolsV2Button from "~processes/formToolsv2/main";

export const config: PlasmoCSConfig = {
        matches: ["*://*/*"],
        world: "MAIN"
    };
export const getRootContainer = buildGetRootContainer(FormToolsV2Button);

export default () => null;
