import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class MetadataBrowserButton extends ToolPanelButton {
    static id = "metadatabrowser";
    constructor() {
        super("metadatabrowser", "Metadata Browser", () => TuneIcon, "100%");
        this.description = (
            <>
                <Typography>
                    <i>Explore hidden data.</i>
                </Typography>
                <Typography>This tool lets you see all metadata in this environment.</Typography>
                <Typography>
                    <i>Not all columns are displayed by default, but they are available.</i>
                </Typography>
            </>
        );
    }
}

export default MetadataBrowserButton;
