import TableViewIcon from "@mui/icons-material/TableView";
import Typography from "@mui/material/Typography";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class EntityListButton extends ToolPanelButton {
    static id = "entitiesList";
    constructor() {
        super("entitiesList", "Entities List", () => TableViewIcon, 300);
        this.description = (
            <>
                <Typography>
                    <i>Navigate without worries.</i>
                </Typography>
                <Typography>This tool shows all entities in your environment.</Typography>
                <Typography>Clicking an item opens the entity list with its existing views.</Typography>
            </>
        );
    }
}

export default EntityListButton;
