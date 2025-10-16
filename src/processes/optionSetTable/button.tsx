import StyleIcon from "@mui/icons-material/Style";
import Typography from "@mui/material/Typography";
import React, {
    } from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class OptionSetTableButton extends ToolPanelButton {
    static id = "optionsettable";
    constructor() {
        super("optionsettable", "Option Set Tables", () => StyleIcon, 400);
        this.description = (
            <>
                <Typography>
                    <i>See every option set, every label, every value.</i>
                </Typography>
                <Typography>
                    This tool offers a quick way to <b>view all option sets</b>{" "}
                    associated with the currently open entity.
                </Typography>
                <Typography>
                    Each table displays all option labels and values for every
                    available option set on the entity. You'll also find the
                    list of fields that utilize it.
                </Typography>
                <Typography>
                    You can <b>copy labels or values</b> by{" "}
                    <u>simply clicking on them</u>. Alternatively, you can{" "}
                    <b>copy the entire table</b> to your clipboard.
                </Typography>
            </>
        );
    }
}


export default OptionSetTableButton;
