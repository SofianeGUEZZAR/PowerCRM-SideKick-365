import HelpTwoToneIcon from "@mui/icons-material/HelpTwoTone";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { useSnackbar } from "notistack";
import React, { useMemo } from "react";

import TooltipInfo from "../components/TooltipInfo";
import { useEffectOnce } from "../hooks/use/useEffectOnce";
import { getBridgeEventName } from "./common";
import { PROJECT_PREFIX } from "./var";

export abstract class ProcessButton {
    static prefixId: string = PROJECT_PREFIX;

    static id: string;
    prefixedId: string;

    process?: React.ForwardRefExoticComponent<ProcessProps & React.RefAttributes<ProcessRef>>;
    processContainer?: React.FunctionComponent<{
        children: React.ReactNode | React.ReactNode[];
    }>;

    ref: React.RefObject<ProcessRef>;

    constructor(id: string) {
        this.prefixedId = ProcessButton.prefixId + id;

        this.ref = React.createRef<ProcessRef>();
    }

    getProcess(): React.JSX.Element {
        const setBadge = (number: React.ReactNode | null) => {
            const eventName = getBridgeEventName(this.prefixedId);
            window.dispatchEvent(new CustomEvent(eventName, { detail: { badgeContent: number } }));
        };

        if (this.processContainer)
            return (
                <this.processContainer>
                    {this.process ? (
                        <this.process id={this.prefixedId} ref={this.ref} setBadge={setBadge} />
                    ) : (
                        <ErrorProcess />
                    )}
                </this.processContainer>
            );
        else
            return this.process ? (
                <this.process id={this.prefixedId} ref={this.ref} setBadge={setBadge} />
            ) : (
                <ErrorProcess />
            );
    }

    onProcessClose(): void {
        this.ref.current?.onClose?.();
    }
}

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
