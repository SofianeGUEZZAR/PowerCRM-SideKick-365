import type { SvgIconComponent } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import GradeIcon from "@mui/icons-material/Grade";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import RestoreIcon from "@mui/icons-material/Restore";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import type { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";

import CircularProgressOverflow from "../../utils/components/CircularProgressOverflow";
import CodeEditor from "../../utils/components/CodeEditorComponent/CodeEditor";
import { buildFileTree, getAllFiles, getFiles } from "../../utils/components/CodeEditorComponent/utils/fileManagement";
import type {
    CodeEditorCommon,
    CodeEditorDirectory,
    CodeEditorFile,
    CodeEditorForwardRef
} from "../../utils/components/CodeEditorComponent/utils/types";
import DontShowInfo from "../../utils/components/DontShowInfo";
import SplitDropDownButtonGroup from "../../utils/components/SplitDropDownButtonGroup";
import { ProcessButton, type ProcessProps, type ProcessRef } from "../../utils/global/.processClass";
import { debugLog, waitForElmList } from "../../utils/global/common";
import MessageManager from "../../utils/global/MessageManager";
import { STORAGE_WebEditorFavFiles } from "../../utils/global/var";
import { useDictionnary } from "../../utils/hooks/use/useDictionnary";
import { useXrmUpdated } from "../../utils/hooks/use/useXrmUpdated";
import { MessageType } from "../../utils/types/Message";
import type { ScriptNodeContent } from "../../utils/types/ScriptNodeContent";
import type { ScriptOverrideContent } from "../../utils/types/ScriptOverride";

const separationOfUrlAndFileName = "webresources/";

class WebResourceEditorProcess extends ProcessButton {
    static id = "webresourceeditor";
    constructor() {
        super("webresourceeditor");
        this.process = WebResourceEditor;
    }
}

const WebResourceEditor = forwardRef<ProcessRef, ProcessProps>(function WebRessourceEditorProcess(
    props: ProcessProps,
    ref
) {
    const { xrmUpdated } = useXrmUpdated();

    const [isFetching, setIsFetching] = useState(false);
    const [scriptNodeContent, setScriptNodeContent] = useState<ScriptNodeContent[] | null>(null);
    const {
        dict: scriptsOverrided,
        keys: scriptsOverridedSrc,
        setDict: setScriptsOverride,
        setValue: setScriptOverrideItem,
        removeValue: removeScriptOverrideItem
    } = useDictionnary<ScriptOverrideContent>({});
    const [root, setRoot] = useState<CodeEditorDirectory | undefined>();
    const [editorOpen, setEditorOpen] = useState(false);
    const { value: confirmPublishOpen, setTrue: openConfirmPublish, setFalse: closeConfirmPublish } = useBoolean(false);
    const [refreshAfterPublishing, setRefreshAfterPublishing] = useState(false);

    const [favFiles, setFavFiles] = useState<string[]>([]);

    const toggleFavFile = useCallback((fileId: string) => {
        setFavFiles((old) => {
            const index = old.indexOf(fileId);
            if (index !== -1) {
                const copy = [...old];
                const _ = copy.splice(index, 1);
                return copy;
            }
            return [...old, fileId];
        });
    }, []);

    useEffect(() => {
        MessageManager.sendMessage(MessageType.GETCONFIGURATION, { key: STORAGE_WebEditorFavFiles }).then(function (
            response: string[] | null
        ) {
            setFavFiles(response ?? []);
        });
    }, []);
    useEffect(() => {
        MessageManager.sendMessage(MessageType.SETCONFIGURATION, {
            key: STORAGE_WebEditorFavFiles,
            configurations: favFiles
        });
    }, [favFiles]);

    // useEffect(() => {
    //     MessageManager.sendMessage(MessageType.GETCURRENTSCRIPTOVERRIDING).then(
    //         function (response: ScriptOverride | null) {
    //             if (response) {
    //                 setScriptsOverride(response);
    //             }
    //         }
    //     );
    // }, [setScriptsOverride]);

    useEffect(() => {
        setScriptNodeContent(null);
        setIsFetching(true);

        waitForElmList<HTMLIFrameElement>('[id^="ClientApiFrame"]:not([id*="crm_header_global"]):not([id*="id"])').then(
            (docs) => {
                docs &&
                    Promise.all(
                        Array.from(docs).flatMap((doc) => {
                            if (!doc.contentWindow) return null;
                            return Array.from(doc.contentWindow.document.querySelectorAll("script"))
                                .filter((s: HTMLScriptElement, index, array) =>
                                    s.src.startsWith(Xrm.Utility.getGlobalContext().getClientUrl())
                                )
                                .map(async (s: HTMLScriptElement) => {
                                    const fileName = s.src.substring(
                                        s.src.search(separationOfUrlAndFileName) + separationOfUrlAndFileName.length
                                    );
                                    return {
                                        srcRegex: s.src.replace(/\/%7b.*%7d\/webresources/, "/.*/webresources"),
                                        fileName: fileName,
                                        content: await fetch(s.src).then((r) => r.text()),
                                        crmId: await Xrm.WebApi.retrieveMultipleRecords(
                                            "webresource",
                                            `?$select=webresourceid&$filter=(name eq '${fileName}')`
                                        ).then(
                                            function success(results) {
                                                return results.entities[0]["webresourceid"] as string;
                                            },
                                            function (error) {
                                                console.error(
                                                    `Error when attempt of retrieve webresource id with : ${error.message}`
                                                );
                                            }
                                        )
                                    } as ScriptNodeContent;
                                });
                        })
                    ).then((scriptNodeContents) => {
                        if (!scriptNodeContents) return;
                        const scriptNodeContentsDistinctNotNull: ScriptNodeContent[] = scriptNodeContents.filter(
                            (i, index, array) => i && array.findIndex((a) => a?.srcRegex === i.srcRegex) === index
                        ) as any;
                        debugLog("Scripts found:", scriptNodeContentsDistinctNotNull);
                        setScriptNodeContent(scriptNodeContentsDistinctNotNull);
                        setIsFetching(false);
                    });
            }
        );
    }, [xrmUpdated]);

    useEffect(() => {
        if (!scriptNodeContent) return;
        const root = buildFileTree(scriptNodeContent);
        setRoot(root);
    }, [scriptNodeContent]);

    const overridedFiles = useMemo(
        () => (root && getFiles(root, (file) => scriptsOverridedSrc.indexOf(file.src) !== -1)) || [],
        [root, scriptsOverridedSrc]
    );
    const unloadOverridedFiles = useMemo(
        () => scriptsOverridedSrc.filter((scriptSrc) => !overridedFiles.some((file) => file.src === scriptSrc)),
        [scriptsOverridedSrc, overridedFiles]
    );

    const handleOnSave = useCallback(
        (fileSaved: CodeEditorFile, rootCopy: CodeEditorDirectory) => {
            setRoot(rootCopy);

            if (!scriptsOverridedSrc.includes(fileSaved.src)) {
                if (
                    scriptNodeContent?.find((s) => s.srcRegex === fileSaved.src)?.content === fileSaved.modifiedContent
                ) {
                    removeScriptOverrideItem(fileSaved.src);
                    return;
                }
                const originalContent =
                    scriptNodeContent?.find((script) => script.srcRegex === fileSaved.src)?.content ?? "";
                setScriptOverrideItem(fileSaved.src, {
                    modified: fileSaved.modifiedContent,
                    original: originalContent,
                    webresourceid: fileSaved.crmId
                });
            } else {
                if (scriptsOverrided[fileSaved.src].original === fileSaved.modifiedContent) {
                    removeScriptOverrideItem(fileSaved.src);
                    return;
                }
                if (scriptsOverrided[fileSaved.src].modified !== fileSaved.modifiedContent) {
                    setScriptOverrideItem(fileSaved.src, {
                        ...scriptsOverrided[fileSaved.src],
                        modified: fileSaved.modifiedContent
                    });
                    return;
                }
            }
        },
        [scriptsOverridedSrc, scriptNodeContent, setScriptOverrideItem, removeScriptOverrideItem, scriptsOverrided]
    );
    const handleOnChange = useCallback(
        (fileUnsaved: CodeEditorFile, rootCopy: CodeEditorDirectory) => {
            setRoot(rootCopy);
        },
        [setRoot]
    );
    const handleOnRootUpdate = useCallback(
        (newElement: CodeEditorCommon, rootCopy: CodeEditorDirectory) => {
            setRoot(rootCopy);
        },
        [setRoot]
    );

    const _publishChanges = useCallback(() => {
        closeConfirmPublish();
        setEditorOpen(false);

        Xrm.Utility.showProgressIndicator(`Start webresources update.`);

        scriptsOverridedSrc.forEach((scriptSrc) => {
            Xrm.Utility.showProgressIndicator(
                `Updating Webresource: ${scriptNodeContent?.find((s) => s.srcRegex === scriptSrc)?.fileName}.`
            );

            const record = {
                // content: btoa(unescape(encodeURIComponent(scriptsOverrided[scriptSrc].modified)))
                content: btoa(String.fromCharCode(...new TextEncoder().encode(scriptsOverrided[scriptSrc].modified)))
            };

            Xrm.WebApi.updateRecord("webresource", scriptsOverrided[scriptSrc].webresourceid, record).then(
                function success(result) {
                    var updatedId = result.id;
                    debugLog(`Webresource ${updatedId} content updated`);
                },
                function (error) {
                    console.error(`Error when attempt to update the webResource ${scriptSrc}: ${error.message}`);
                }
            );
        });
        Xrm.Utility.closeProgressIndicator();

        const execute_PublishXml_Request = {
            ParameterXml: `<importexportxml><webresources>${scriptsOverridedSrc.map((scriptSrc) => `<webresource>${scriptsOverrided[scriptSrc].webresourceid}</webresource>`).join("")}</webresources></importexportxml>`,
            getMetadata: function () {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        ParameterXml: { typeName: "Edm.String", structuralProperty: 1 }
                    },
                    operationType: 0,
                    operationName: "PublishXml"
                };
            }
        };

        Xrm.Utility.showProgressIndicator(`Publishing updated webresources`);
        Xrm.WebApi.online
            .execute(execute_PublishXml_Request)
            .then(function success(response) {
                if (response.ok) {
                    debugLog("Publish Done");
                    if (refreshAfterPublishing) {
                        MessageManager.sendMessage(MessageType.REFRESHBYPASSCACHE);
                    }
                }
                Xrm.Utility.closeProgressIndicator();
            })
            .catch(function (error) {
                console.error(`Error when attempt to publish webressources ${error.message}`);
                Xrm.Utility.closeProgressIndicator();
            });
    }, [closeConfirmPublish, scriptsOverridedSrc, scriptNodeContent, scriptsOverrided, refreshAfterPublishing]);

    const publishChanges = useCallback(() => {
        if (scriptsOverridedSrc.length === 0) return;
        openConfirmPublish();
    }, [openConfirmPublish, scriptsOverridedSrc]);

    const activateRefreshAfterPublishing = useCallback(() => {
        setRefreshAfterPublishing(true);
        // publishChanges();
    }, []);

    const deactivateRefreshAfterPublishing = useCallback(() => {
        setRefreshAfterPublishing(false);
        // publishChanges();
    }, []);

    // const launchLiveTest = useCallback(() => {
    //     MessageManager.sendMessage(MessageType.ENABLESCRIPTOVERRIDING, scriptsOverrided);
    //     MessageManager.sendMessage(MessageType.REFRESHBYPASSCACHE);
    // }, [scriptsOverrided]);

    const codeEditorRef = useRef<CodeEditorForwardRef>(null);

    const selectFile = useCallback(
        (selectedFile: CodeEditorFile) => {
            codeEditorRef.current?.selectFile(selectedFile);
            setEditorOpen(true);
        },
        [codeEditorRef]
    );

    const removeScriptOverride = useCallback(
        (selectedFile: CodeEditorFile) => {
            setRoot((oldRoot) => {
                if (!oldRoot) {
                    return;
                }
                const [file] = getFiles(oldRoot, (file) => file.src === selectedFile.src);
                if (file) {
                    file.modifiedContent = scriptsOverrided[selectedFile.src].original;
                    file.previousContent = scriptsOverrided[selectedFile.src].original;
                }
                return oldRoot;
            });
            removeScriptOverrideItem(selectedFile.src);
        },
        [scriptsOverrided, removeScriptOverrideItem]
    );

    const allFiles = useMemo(
        () =>
            root &&
            getAllFiles(root).sort((file1, file2) => {
                const isFile1Fav = favFiles.includes(file1.crmId) ? 1 : 0;
                const isFile2Fav = favFiles.includes(file2.crmId) ? 1 : 0;
                return isFile2Fav - isFile1Fav ;
            }),
        [favFiles, root]
    );

    return (
        <>
            <Stack spacing={1} height="calc(100% - 10px)" padding="10px" alignItems="center">
                <Alert key="webresourceWarnEnv" severity="warning">
                    <Typography variant="body2" fontSize="unset" lineHeight="unset">
                        Make sure to verify the environment you are modifying before publishing your changes.
                    </Typography>
                </Alert>

                <DontShowInfo storageName={`${props.id}-maininfo`}>
                    <Typography variant="body2" fontSize="unset" lineHeight="unset">
                        <i>Live debugging is no longer available.</i>
                    </Typography>
                    <Typography variant="body2" fontSize="unset" lineHeight="unset">
                        You can favorite files to display them at the top of the list.
                    </Typography>
                </DontShowInfo>

                <Stack width="100%" direction="column">
                    {/* <ButtonGroup variant="contained" fullWidth>

                            <Button
                                sx={{
                                    flex: '1'
                                }}
                                onClick={launchLiveTest}
                            >
                                Send scripts & Launch LiveTest
                            </Button>

                        </ButtonGroup> */}
                    {/* <ButtonGroup variant='outlined' fullWidth> */}

                    {/* <Button
                                onClick={() => {
                                    setEditorOpen(prev => !prev);
                                }}
                            >
                                Open Editor
                            </Button> */}

                    {/* <Button
                                variant='contained'
                                onClick={publishChanges}
                            >
                                Publish
                            </Button> */}

                    <SplitDropDownButtonGroup
                        options={[
                            {
                                title: "Publish & Reload",
                                action: publishChanges,
                                onSelect: activateRefreshAfterPublishing
                            },
                            {
                                title: "Publish",
                                action: publishChanges,
                                onSelect: deactivateRefreshAfterPublishing
                            }
                        ]}
                        defaultActionIndex={0}
                        variant="outlined"
                        splitButtonProps={{
                            variant: "contained",
                            sx: {
                                whiteSpace: "nowrap"
                            }
                        }}>
                        <Button
                            onClick={() => {
                                setEditorOpen((prev) => !prev);
                            }}>
                            Open Editor
                        </Button>
                    </SplitDropDownButtonGroup>

                    {/* </ButtonGroup> */}
                </Stack>
                {unloadOverridedFiles?.length > 0 && (
                    <List
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                            overflowX: "hidden",
                            overflowY: "auto",
                            flex: "0.5"
                        }}
                        component="nav"
                        disablePadding
                        subheader={
                            <ListSubheader component="div">
                                <strong>Overrided scripts not load:</strong>
                            </ListSubheader>
                        }>
                        {unloadOverridedFiles.map((item) => {
                            const name = item
                                .split("/webresources/")[1]
                                ?.split(/[\\/¥₩]+/i)
                                .slice(-1)[0];
                            return (
                                <ListItem key={"unloadOverridedFiles_" + item} disablePadding>
                                    <ListItemText
                                        primary={name ?? <i>Unfound name</i>}
                                        primaryTypographyProps={{
                                            fontSize: "0.85rem",
                                            lineHeight: "1",
                                            padding: "4px 16px"
                                        }}
                                        title={name ?? "Unfound name"}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}

                <CircularProgressOverflow loading={isFetching} disableShrink size={120} sx={{ minHeight: 0 }}>
                    <Stack direction="column" height="100%" width="100%">
                        <ScriptList
                            text="Overrided scripts:"
                            items={overridedFiles}
                            primaryLabel={(item) => item.name}
                            primaryAction={selectFile}
                            secondaryAction={removeScriptOverride}
                            secondaryIcon={RestoreIcon}
                            secondaryTitle="Restore file"
                            favFiles={favFiles}
                            toggleFavFile={toggleFavFile}
                        />
                        <ScriptList
                            text="Scripts found on this page:"
                            items={allFiles || []}
                            primaryLabel={(item) =>
                                scriptsOverrided[item.src] ? <strong>{item.name}</strong> : item.name
                            }
                            primaryAction={selectFile}
                            favFiles={favFiles}
                            toggleFavFile={toggleFavFile}
                        />
                    </Stack>
                </CircularProgressOverflow>
            </Stack>

            <Dialog fullScreen open={editorOpen} maxWidth={false} TransitionComponent={Transition} keepMounted>
                <DialogContent sx={{ padding: "0" }}>
                    {root && (
                        <CodeEditor
                            ref={codeEditorRef}
                            root={root}
                            theme="vs-dark"
                            defaultLanguage="javascript"
                            onChange={handleOnChange}
                            onSave={handleOnSave}
                            onRootUpdate={handleOnRootUpdate}
                            onClose={() => setEditorOpen(false)}
                            publishChanges={publishChanges}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={confirmPublishOpen} onClose={closeConfirmPublish}>
                <DialogTitle>Publishing Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure to publish these files?
                        <List>
                            {scriptsOverridedSrc.map((scriptSrc) => {
                                return (
                                    <ListItem>
                                        <ListItemText>
                                            {scriptSrc
                                                .split("/webresources/")[1]
                                                ?.split(/[\\/¥₩]+/i)
                                                .slice(-1)[0] ?? <i>Unfound name</i>}
                                        </ListItemText>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmPublish}>Cancel</Button>
                    <Button variant="contained" onClick={_publishChanges}>
                        Publish
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

type ScriptListProps = {
    text: string;
    items: CodeEditorFile[];
    primaryLabel: (item: CodeEditorFile) => React.ReactNode;
    primaryAction: (item: CodeEditorFile) => void;
    secondaryAction?: (item: CodeEditorFile) => void;
    secondaryIcon?: SvgIconComponent;
    secondaryTitle?: string;
    favFiles: string[];
    toggleFavFile: (value: string) => void;
};
function ScriptList(props: ScriptListProps) {
    return (
        <List
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflowX: "hidden",
                overflowY: "auto",
                flex: "1 1 50%",
                height: "100%"
            }}
            disablePadding
            subheader={
                <ListSubheader component="div">
                    <Typography variant="h6" color="black">
                        {props.text}
                    </Typography>
                </ListSubheader>
            }>
            {props.items?.map((item) => (
                <ListItem
                    key={`scriptList_${props.text}_${item.id}`}
                    secondaryAction={
                        props.secondaryAction &&
                        props.secondaryIcon && (
                            <IconButton
                                edge="end"
                                title={props.secondaryTitle}
                                onClick={() => props.secondaryAction!(item)}>
                                <props.secondaryIcon />
                            </IconButton>
                        )
                    }
                    disablePadding>
                    <ListItemButton dense onClick={() => props.primaryAction(item)} sx={{ pl: 0.5 }}>
                        <IconButton
                            title="Add this file to favorite"
                            onClick={(e) => {
                                props.toggleFavFile(item.crmId);
                                e.stopPropagation();
                            }}
                            size="small">
                            {props.favFiles.includes(item.crmId) ? (
                                <GradeIcon sx={{ color: "#FDCC0D" }} />
                            ) : (
                                <GradeOutlinedIcon />
                            )}
                        </IconButton>
                        <ListItemText
                            sx={{ pl: 0.5 }}
                            primary={props.primaryLabel(item)}
                            primaryTypographyProps={{
                                fontSize: "0.85rem",
                                lineHeight: "1"
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default WebResourceEditorProcess;
