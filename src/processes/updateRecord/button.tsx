import SyncIcon from "@mui/icons-material/Sync";
import Typography from "@mui/material/Typography";
import React from "react";

import { ToolPanelButton } from "~utils/global/.toolPanelButton";

class UpdateRecordButton extends ToolPanelButton {
    static id = "updaterecord";
    constructor() {
        super("updaterecord", "Create / Update Record", () => SyncIcon, 500);
        this.description = (
            <>
                <Typography>
                    <i>Save time and effort with creates and updates.</i>
                </Typography>
                <Typography>
                    With this tool, you can <b>update any field of any record</b> on your environment. You can even
                    update <b>multiple records at once</b> for bulk updates.
                </Typography>
                <Typography>
                    <i>
                        The default record loaded is the currently opened record. You can select different entity and
                        records using the input fields at the top.
                    </i>
                </Typography>
                <Typography>
                    To update a field, select it from the dropdown menu. Then, enter a new value in the corresponding
                    input field. You can always restore the original value if needed.
                </Typography>
                <Typography>To remove a field from the update list, click the trash bin icon.</Typography>
                <Typography>
                    <b>Each field type has a matching input type</b>, such as a text box for text fields or a date
                    picker for date fields. <b>Input fields have an icon that you can click</b> to open a tool that
                    helps with data entry.
                </Typography>
            </>
        );
    }
}

// const updateRecord = new UpdateRecordButton();
export default UpdateRecordButton;
