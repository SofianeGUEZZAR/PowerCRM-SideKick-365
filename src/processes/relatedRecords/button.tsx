import ShareIcon from "@mui/icons-material/Share";
import Typography from "@mui/material/Typography";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class RelatedRecordsButton extends ToolPanelButton {
    static id = "relatedRecords";
    constructor() {
        super("relatedRecords", "Related Records", () => ShareIcon, 450);
        this.description = (
            <>
                <Typography>
                    <i>Explore entity relationships and related records.</i>
                </Typography>
                <Typography>
                    This tool displays <b>all relationships associated</b> with the selected entity. It also lists{" "}
                    <b>related records</b> for the selected record.
                </Typography>
                <Typography>
                    <u>To view a record in detail, click on it to open a dialog</u>. Alternatively, you can access a
                    contextual menu <i>(right-click)</i> for other opening options.
                </Typography>
            </>
        );
    }
}

export default RelatedRecordsButton;
