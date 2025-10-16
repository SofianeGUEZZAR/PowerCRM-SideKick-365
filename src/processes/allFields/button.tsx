import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Typography } from "@mui/material";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class AllFieldsButton extends ToolPanelButton {
    static id = "allfields";
    constructor() {
        super("allfields", "All Attributes", () => FormatListBulletedIcon, 450);
        this.description = (
            <>
                <Typography>
                    <i>See every field, every value, all in one place.</i>
                </Typography>
                <Typography>
                    This tool provides a convenient way to quickly{" "}
                    <b>access and review all the data of your open record</b>.
                </Typography>
                <Typography>It displays all the fields and values of the currently open records.</Typography>
                <Typography>
                    Expand the box to reveal additional values from the <i>WebApi</i>, such as the <i>FormattedValue</i>
                    .
                </Typography>
            </>
        );
    }
}

// const allFields = new AllFieldsButton();
export default AllFieldsButton;
