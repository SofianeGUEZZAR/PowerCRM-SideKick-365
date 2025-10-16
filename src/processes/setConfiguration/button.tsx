import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class SetConfigurationButton extends ToolPanelButton {
    static id = "createconfiguration";
    constructor() {
        super("createconfiguration", "Configuration Manager", () => SettingsIcon, 320);
        this.description = (
            <>
                <Typography>
                    <i>Configure your SidePanel Tools experience.</i>
                </Typography>
                <Typography>
                    This tool lets you select which tools <b>automatically open</b> when a page loads. You can also
                    specify a tool to be <b>expanded by default</b>.
                </Typography>
                <Typography>
                    A <i>"foreground"</i> option is available to <u>disable automatic width adjustments</u> of the main
                    Dynamics screen.
                </Typography>
            </>
        );
    }
}


export default SetConfigurationButton;
