import MapIcon from "@mui/icons-material/Map";
import { List, Typography } from "@mui/material";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class NavigationButton extends ToolPanelButton {
    static id = "navigation";
    constructor() {
        super("navigation", "Navigation", () => MapIcon, 175);
        this.description = (
            <>
                <Typography>
                    <i>Access everything you need in one place.</i>
                </Typography>
                <Typography>This tool provides quick access to various essential resources:</Typography>
                <List sx={{ listStyleType: "disc", ml: 3, pt: 0 }}>
                    <Typography component="li">
                        <u>Solutions</u>: Opens the <b>solution list</b> or the <b>selected solution</b> in an other
                        tab. Choose between the classic interface or PowerApps.
                    </Typography>
                    <Typography component="li">
                        <u>Form Editor</u>: Opens the <b>form editor</b> of the currently opened form in an other tab.
                        Choose between the classic interface or PowerApps.
                    </Typography>
                    <Typography component="li">
                        <u>Advanced Find</u>: Opens the good old <b>Advanced Find</b> in a new tab, automatically
                        focusing on the currently viewed entity.
                    </Typography>
                    <Typography component="li">
                        <u>Power Apps Home</u>
                    </Typography>
                    <Typography component="li">
                        <u>Power Automate Home</u>
                    </Typography>
                    <Typography component="li">
                        <u>Admin Power Platform</u>
                    </Typography>
                    <Typography component="li">
                        <u>Environments</u>: Opens the environment list of the tenant on admin center.
                    </Typography>
                    <Typography component="li">
                        <u>Azure Portal</u>: Opens the tenant's Azure portal.
                    </Typography>
                    <Typography component="li">
                        <u>Security</u>: Opens the classic interface security page of the advanced settings.
                    </Typography>
                </List>
            </>
        );
    }
}


export default NavigationButton;
