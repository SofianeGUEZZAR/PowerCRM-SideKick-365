import { List, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { forwardRef } from "react";

import PluginTraceLogsPane from "../../utils/components/pluginTraceLogsExplorer/main";
import {
    TraceLogController,
    TraceLogsAPI
} from "../../utils/components/pluginTraceLogsExplorer/subcomponents/contexts";
import { ProcessButton, type ProcessProps, type ProcessRef } from "../../utils/global/.processClass";

class PluginTraceLogsExplorerProcess extends ProcessButton {
    static id = "pluginlogsexplorer";
    constructor() {
        super("pluginlogsexplorer");
        this.process = PluginTraceLogsExplorerButtonProcess;
    }
}

const PluginTraceLogsExplorerButtonProcess = forwardRef<ProcessRef, ProcessProps>(
    function PluginTraceLogsExplorerButtonProcess(props: ProcessProps, ref) {
        return (
            <TraceLogController>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TraceLogsAPI maxFetchingRecord={15}>
                        <PluginTraceLogsPane processId={props.id} setBadge={props.setBadge} />
                    </TraceLogsAPI>
                </LocalizationProvider>
            </TraceLogController>
        );
    }
);

// const pluginTraceLogsExplorer = new PluginTraceLogsExplorerButton();
export default PluginTraceLogsExplorerProcess;
