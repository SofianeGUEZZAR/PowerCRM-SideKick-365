import HelpTwoToneIcon from "@mui/icons-material/HelpTwoTone";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { useSnackbar } from "notistack";
import React, { useMemo } from "react";

import TooltipInfo from "../components/TooltipInfo";
import { useEffectOnce } from "../hooks/use/useEffectOnce";
import { PROJECT_PREFIX } from "./var";


export abstract class ToolPanelButton {
    static prefixId: string = PROJECT_PREFIX;

    static id: string;
    prefixedId: string;
    menuButtonName: string;
    panelButtonName: string | JSX.Element;
    menuButtonIcon: JSX.Element;
    panelButtonIcon: JSX.Element;
    width: number | string;
    widthNumber: number;
    openable: boolean;
    isPanelProcess: boolean;

    description: React.ReactNode;

    constructor(
        id: string,
        name: string | (() => string),
        icon: () => React.ComponentType,
        width: number | string,
        isPanelProcess: boolean = true
    ) {
        this.prefixedId = ToolPanelButton.prefixId + id;
        this.menuButtonName = typeof name === "function" ? name() : name;
        this.panelButtonName = this.menuButtonName;
        this.menuButtonIcon = React.createElement(icon());
        this.panelButtonIcon = this.menuButtonIcon;
        this.width = width;
        this.widthNumber =
            typeof this.width === "string" ? (this.width.endsWith("px") ? parseInt(this.width) : -1) : this.width;
        this.openable = true;
        this.isPanelProcess = isPanelProcess;

        this.description = "No description.";
    }

    getConfiguration(): string {
        return this.prefixedId + ".conf";
    }

    getOpeningButton(onClick: (process: ToolPanelButton) => any): React.JSX.Element {
        return (
            <ButtonProcess
                key={`openingButton_${this.prefixedId}`}
                onClick={() => onClick(this)}
                processButton={this}
            />
        );
    }

    getFunctionButton(): React.JSX.Element {
        return this.getOpeningButton(this.execute);
    }

    execute(): void {}

    onExtensionLoad(snackbarProviderContext: ReturnType<typeof useSnackbar>): void {}
}

const ButtonProcess = (props: { processButton: ToolPanelButton; onClick: () => any }) => {
    const { onClick, processButton } = props;

    const snackbarProviderContext = useSnackbar();

    useEffectOnce(() => {
        processButton.onExtensionLoad(snackbarProviderContext);
    });

    const tooltipTitle = useMemo(
        () => (
            // <Paper variant='outlined' sx={{ py: 1, px: 2 }}>
            // <Alert variant="outlined" icon={false} severity='info'>
            <Stack direction="column" spacing={0.5}>
                <Stack direction="row" spacing={2} alignItems="flex-end" pl={1}>
                    <Box>{processButton.panelButtonIcon}</Box>
                    <Typography variant="h6">{processButton.menuButtonName}</Typography>
                </Stack>
                <Divider />
                <Box p={1}>{processButton.description}</Box>
            </Stack>
            // </Alert>
            // </Paper>
        ),
        []
    );

    return (
        <Button
            variant="contained"
            size="medium"
            sx={{
                whiteSpace: "nowrap",
                pl: 0.75,
                "&:hover .helpInfo": { visibility: "visible" }
            }}
            fullWidth
            onClick={onClick}>
            <Stack direction="row" width="100%" spacing="2px" minWidth={0} justifyContent="space-between">
                <TooltipInfo
                    title={tooltipTitle}
                    placement="left"
                    disableInteractive
                    arrow
                    enterDelay={500}
                    slots={{
                        transition: Zoom
                    }}
                    maxWidth={540}>
                    <HelpTwoToneIcon className="helpInfo" visibility="hidden" />
                </TooltipInfo>

                <Stack direction="row" spacing={1} width="100%" minWidth={0} justifyContent="center">
                    <Box>{processButton.menuButtonName}</Box>
                    {processButton.menuButtonIcon}
                </Stack>
            </Stack>
        </Button>
    );
};