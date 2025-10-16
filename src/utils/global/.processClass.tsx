import HelpTwoToneIcon from "@mui/icons-material/HelpTwoTone";
import { Alert, Box, Button, Divider, Paper, Stack, Tooltip, Typography } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { useSnackbar } from "notistack";
import React, { forwardRef, useMemo } from "react";

import TooltipInfo from "../components/TooltipInfo";
import { useEffectOnce } from "../hooks/use/useEffectOnce";
import { getBridgeEventName } from "./common";
import { PROJECT_PREFIX } from "./var";

export abstract class ProcessButton {
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

    process?: React.ForwardRefExoticComponent<ProcessProps & React.RefAttributes<ProcessRef>>;
    processContainer?: React.FunctionComponent<{
        children: React.ReactNode | React.ReactNode[];
    }>;

    description: React.ReactNode;

    ref: React.RefObject<ProcessRef>;

    constructor(
        id: string,
        name: string | (() => string),
        icon: () => React.ComponentType,
        width: number | string,
        isPanelProcess: boolean = true
    ) {
        this.prefixedId = ProcessButton.prefixId + id;
        this.menuButtonName = typeof name === "function" ? name() : name;
        this.panelButtonName = this.menuButtonName;
        // if (typeof icon === "function") {
        //     const maybeElement = (icon as any)();
        //     this.menuButtonIcon = React.isValidElement(maybeElement)
        //     ? maybeElement
        //     : React.createElement(icon as React.ComponentType);
        // } else {
        //     this.menuButtonIcon = <icon />;
        // }
        this.menuButtonIcon = React.createElement(icon());
        this.panelButtonIcon = this.menuButtonIcon;
        this.width = width;
        this.widthNumber =
            typeof this.width === "string" ? (this.width.endsWith("px") ? parseInt(this.width) : -1) : this.width;
        this.openable = true;
        this.isPanelProcess = isPanelProcess;

        this.ref = React.createRef<ProcessRef>();

        this.description = "No description.";
    }

    getConfiguration(): string {
        return this.prefixedId + ".conf";
    }

    getProcess(): React.JSX.Element {
        const setBadge = (number: React.ReactNode | null) => {
            const eventName = getBridgeEventName(this.prefixedId);
            window.dispatchEvent(new CustomEvent(eventName, { detail: { badgeContent: number } }));
        };

        if (this.processContainer)
            return (
                <this.processContainer>
                    {this.process ? <this.process id={this.prefixedId} ref={this.ref} setBadge={setBadge} /> : <ErrorProcess />}
                </this.processContainer>
            );
        else return this.process ? <this.process id={this.prefixedId} ref={this.ref} setBadge={setBadge} /> : <ErrorProcess />;
    }

    // getProcess(
    //     setBadge: (content: React.ReactNode | null) => void
    // ): React.JSX.Element {
    //     if (this.processContainer)
    //         return (
    //             <this.processContainer>
    //                 {this.process ? (
    //                     <this.process
    //                         id={this.prefixedId}
    //                         ref={this.ref}
    //                         setBadge={setBadge}
    //                     />
    //                 ) : (
    //                     <ErrorProcess />
    //                 )}
    //             </this.processContainer>
    //         );
    //     else
    //         return this.process ? (
    //             <this.process id={this.prefixedId} ref={this.ref} setBadge={setBadge} />
    //         ) : (
    //             <ErrorProcess />
    //         );
    // }

    getOpeningButton(onClick: (process: ProcessButton) => any): React.JSX.Element {
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

    onProcessClose(): void {
        this.ref.current?.onClose?.();
    }

    onExtensionLoad(snackbarProviderContext: ReturnType<typeof useSnackbar>): void {}
}

const ButtonProcess = (props: { processButton: ProcessButton; onClick: () => any }) => {
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

function ErrorProcess() {
    return <div>Process not implemented.</div>;
}

export interface ProcessProps {
    id: string;
    setBadge: (number: React.ReactNode | null) => void;
}
export type ProcessRef = {
    onClose?: () => void;
};
