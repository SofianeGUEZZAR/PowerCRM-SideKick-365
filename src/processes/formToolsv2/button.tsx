import HandymanIcon from "@mui/icons-material/Handyman";
import Typography from "@mui/material/Typography";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class FormToolsV2Button extends ToolPanelButton {
    static id = "formtoolsv2";
    constructor() {
        super("formtoolsv2", "Form Tools", () => HandymanIcon, 56);
        this.description = (
            <>
                <Typography>
                    <i>Randomize, visualize, and master your data.</i>
                </Typography>
                <Typography>This tool provide functionnalities used on records form.</Typography>
                <Typography>
                    You will be able to <b>display logical names</b>, <b>manage field controls</b>, refresh data,{" "}
                    <b>fill fields</b> with random data, <b>clone your records</b> and{" "}
                    <b>blur sensitive informations</b>.
                </Typography>
                <Typography>
                    <u>Some buttons are reversible</u>: it can be activated or deactivated without refreshing the page.
                </Typography>
            </>
        );
    }

    reStyleSidePane(
        sidePane: HTMLElement | null,
        sidePaneContent?: HTMLElement | null,
        header?: HTMLElement | null,
        title?: HTMLElement | null,
        closeButton?: HTMLElement | null
    ): void {
        if (title) {
            title.style.alignSelf = "unset";
            title.style.maxHeight = "none";
            title.style.writingMode = "vertical-rl";
        }
        if (header) {
            header.style.flexDirection = "column-reverse";
        }
    }
}

export default FormToolsV2Button;
