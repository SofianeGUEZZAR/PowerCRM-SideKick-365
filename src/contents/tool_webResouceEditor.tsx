import type { PlasmoCSConfig } from "plasmo";

import WebResourceEditorProcess from "~processes/webResourceEditor/tool";
import { buildGetRootContainer } from "~utils/global/toolContentAbstract";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};
export const getRootContainer = buildGetRootContainer(WebResourceEditorProcess);

export default () => null;
