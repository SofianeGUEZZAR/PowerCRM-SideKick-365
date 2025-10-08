import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Grid2 from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { type TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import React, { useContext, useMemo } from "react";

import TypographyButtonHoverCopy from "../../TypographyButtonHoverCopy";
import { OperationType } from "../type";
import { TraceLogControllerContext, TraceLogsAPIContext } from "./contexts";
import PluginTraceLogsList from "./PluginTraceLogsList";
import Section, { sectionMinHeight } from "./Section";
import TraceLogField from "./TraceLogField";

const theme = createTheme({
    components: {
        MuiGrid: {
            styleOverrides: {
                root: {}
            }
        }
    }
});

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface DialogProps {}
const TraceLogDialog = React.memo((props: DialogProps) => {
    const { pluginTraceLogs } = useContext(TraceLogsAPIContext);

    const {
        closeDialog,
        detailsDialogOpened,
        selectedPluginTraceLog,
        selectedSdkMessageProcessingStep: relatedSdkMessageProcessingStep,
        selectedSdkMessageProcessingStepImages:
            relatedSdkMessageProcessingStepImages
    } = useContext(TraceLogControllerContext);

    const imagesEnabled = useMemo(
        () => relatedSdkMessageProcessingStepImages.length > 0,
        [relatedSdkMessageProcessingStepImages]
    );

    const traceLogsCorrelated = useMemo(
        () =>
            pluginTraceLogs.filter(
                (p) => p.correlationid === selectedPluginTraceLog?.correlationid
            ),
        [pluginTraceLogs, selectedPluginTraceLog?.correlationid]
    );

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                keepMounted
                fullScreen
                sx={{ width: "calc(100% - 47px - 450px)" }}
                open={detailsDialogOpened}
                onClose={closeDialog}
                TransitionComponent={Transition}>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={closeDialog}
                            aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div">
                            {selectedPluginTraceLog &&
                                `${selectedPluginTraceLog.messagename} — ${relatedSdkMessageProcessingStep?.name ?? "Loading..."} — ${new Date(selectedPluginTraceLog.performanceexecutionstarttime).toLocaleString()}`}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box
                    sx={{
                        flexGrow: 1,
                        background: "lightgray",
                        overflow: "hidden",
                        padding: theme.spacing(1)
                    }}>
                    <Stack spacing={1} direction="column" height="100%">
                        <Stack spacing={1} direction="row" height="75%">
                            <Section
                                title="Correlation"
                                sx={{ width: "25%" }}
                                expandable={false}>
                                <PluginTraceLogsList
                                    pluginTraceLogs={traceLogsCorrelated}
                                />
                            </Section>
                            <Stack
                                spacing={1}
                                direction="column"
                                height={"100%"}
                                width={imagesEnabled ? "55%" : "75%"}>
                                {relatedSdkMessageProcessingStep?.filteringattributes && (
                                    <Section
                                        title="Filtering Attributes"
                                        defaultExpanded={false}
                                        sx={{
                                            maxHeight: `calc(${sectionMinHeight} + ${56}px)`
                                        }}>
                                        <TypographyButtonHoverCopy
                                            height="unset"
                                            variant="body1"
                                            copyValue={
                                                relatedSdkMessageProcessingStep?.filteringattributes
                                            }>
                                            {relatedSdkMessageProcessingStep?.filteringattributes?.replaceAll(
                                                ",",
                                                ", "
                                            ) ?? "Loading..."}
                                        </TypographyButtonHoverCopy>
                                    </Section>
                                )}
                                <Section title="Message">
                                    <TypographyButtonHoverCopy
                                        variant="body1"
                                        copyValue={
                                            selectedPluginTraceLog?.messageblock
                                        }>
                                        {selectedPluginTraceLog?.messageblock}
                                    </TypographyButtonHoverCopy>
                                </Section>
                                {selectedPluginTraceLog?.exceptiondetails && (
                                    <Section title="Exception Details">
                                        <TypographyButtonHoverCopy
                                            variant="body1"
                                            copyValue={
                                                selectedPluginTraceLog?.exceptiondetails
                                            }>
                                            {
                                                selectedPluginTraceLog?.exceptiondetails
                                            }
                                        </TypographyButtonHoverCopy>
                                    </Section>
                                )}
                            </Stack>
                            {imagesEnabled && (
                                <Stack
                                    spacing={1}
                                    direction="column"
                                    height={"100%"}
                                    width="20%">
                                    {relatedSdkMessageProcessingStepImages.map(
                                        (
                                            relatedSdkMessageProcessingStepImage
                                        ) => {
                                            return (
                                                <Section
                                                    title={
                                                        relatedSdkMessageProcessingStepImage.entityalias
                                                    }>
                                                    <TraceLogField
                                                        label="Image Type"
                                                        value={
                                                            relatedSdkMessageProcessingStepImage[
                                                                "imagetype@OData.Community.Display.V1.FormattedValue"
                                                            ]
                                                        }
                                                    />
                                                    <TypographyButtonHoverCopy
                                                        variant="body1"
                                                        copyValue={
                                                            relatedSdkMessageProcessingStepImage.attributes ??
                                                            ""
                                                        }>
                                                        {relatedSdkMessageProcessingStepImage.attributes?.replaceAll(
                                                            ",",
                                                            "\n"
                                                        )}
                                                    </TypographyButtonHoverCopy>
                                                </Section>
                                            );
                                        }
                                    )}
                                </Stack>
                            )}
                        </Stack>
                        <Box height="25%">
                            <Section title="Context" expandable={false}>
                                <Grid2
                                    container
                                    rowSpacing={1.5}
                                    columnSpacing={6}
                                    sx={{ width: "100%" }}
                                    pl={2}>
                                    <TraceLogField
                                        label="Operation Type"
                                        value={
                                            selectedPluginTraceLog?.[
                                                "operationtype@OData.Community.Display.V1.FormattedValue"
                                            ]
                                        }
                                    />
                                    <TraceLogField
                                        label="Message"
                                        value={
                                            selectedPluginTraceLog?.messagename
                                        }
                                    />
                                    <TraceLogField
                                        label="Primary Entity"
                                        value={
                                            selectedPluginTraceLog?.primaryentity
                                        }
                                    />
                                    <TraceLogField
                                        label="Depth"
                                        value={selectedPluginTraceLog?.depth}
                                    />
                                    {selectedPluginTraceLog?.operationtype ===
                                        OperationType.PlugIn && (
                                        <TraceLogField
                                            label="Stage"
                                            value={
                                                relatedSdkMessageProcessingStep?.[
                                                    "stage@OData.Community.Display.V1.FormattedValue"
                                                ] ?? "Loading..."
                                            }
                                        />
                                    )}
                                    <TraceLogField
                                        label="Mode"
                                        value={
                                            selectedPluginTraceLog?.[
                                                "mode@OData.Community.Display.V1.FormattedValue"
                                            ]
                                        }
                                    />
                                    {/* <TraceLogField label="Created On" value={selectedPluginTraceLog?.["createdon@OData.Community.Display.V1.FormattedValue"]} /> */}
                                    {/* <TraceLogField label="Construction Start Date" value={selectedPluginTraceLog?.["performanceconstructorstarttime@OData.Community.Display.V1.FormattedValue"]} />
                                    <TraceLogField label="Construction Duration" value={selectedPluginTraceLog?.["performanceconstructorduration@OData.Community.Display.V1.FormattedValue"]} /> */}
                                    <TraceLogField
                                        label="Execution Start Date"
                                        value={
                                            selectedPluginTraceLog?.performanceexecutionstarttime
                                        }
                                    />
                                    <TraceLogField
                                        label="Execution Duration"
                                        value={
                                            selectedPluginTraceLog?.[
                                                "performanceexecutionduration@OData.Community.Display.V1.FormattedValue"
                                            ]
                                        }
                                    />
                                    {/* <TraceLogField label="Execution Duration" value={selectedPluginTraceLog?.["performanceexecutionduration@OData.Community.Display.V1.FormattedValue"]} /> */}
                                </Grid2>
                            </Section>
                        </Box>
                    </Stack>
                </Box>
            </Dialog>
        </ThemeProvider>
    );
});

export default TraceLogDialog;
