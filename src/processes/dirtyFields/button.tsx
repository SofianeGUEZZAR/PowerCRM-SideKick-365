import DirtyLensIcon from "@mui/icons-material/DirtyLens";
import Typography from "@mui/material/Typography";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";


class DirtyFieldsButton extends ToolPanelButton {
    static id = "dirtyfields";
    constructor() {
        super("dirtyfields", "Dirty Attributes", () => DirtyLensIcon, 350);
        this.description = (
            <>
                <Typography>
                    <i>See your unsaved changes at a glance, and easily navigate to them with a click.</i>
                </Typography>
                <Typography>
                    This tool <b>displays the fields that have been changed</b> but not yet saved.
                </Typography>
                <Typography>
                    By clicking on the box, you can trigger the focus of the fields on the form. This can even be on a
                    different tab.
                </Typography>
                <Typography>
                    You can also enable an option to display a{" "}
                    <span style={{ outline: "2px dashed #ff2500" }}>red box around</span> the field controls on the
                    form, making them visually stand out.
                </Typography>
            </>
        );
    }
}


export default DirtyFieldsButton;
