import CodeIcon from "@mui/icons-material/Code";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

const separationOfUrlAndFileName = "webresources/";

class WebResourceEditor extends ToolPanelButton {
    static id = "webresourceeditor";
    constructor() {
        super("webresourceeditor", "WebResources Editor", () => CodeIcon, 350);
        this.description = (
            <>
                <Typography>
                    <i>Edit, test, and publish - all within your browser!</i>
                </Typography>
                <Typography>
                    This tool adds an <b>editor directly to your browser</b>, allowing you to modify web resources with
                    ease. No more tedious updates and publishing.
                </Typography>
                <Typography>Here are the key features:</Typography>
                <List sx={{ listStyleType: "disc", ml: 3, pt: 0 }}>
                    <Typography component="li">
                        <b>Edit</b>: <u>Modify any loaded file</u> on the current page using the <i>Monaco Editor</i>,
                        the same robust code editor that powers <i>VS Code</i>.
                    </Typography>
                    <Typography component="li">
                        <b>Publish</b>: Once you're satisfied with your modifications, <u>publish the files</u> to make
                        them permanent.
                    </Typography>
                </List>
            </>
        );
    }
}

export default WebResourceEditor;
