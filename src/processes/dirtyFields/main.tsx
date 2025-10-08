import DirtyLensIcon from "@mui/icons-material/DirtyLens";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useBoolean } from "usehooks-ts";

import CopyMenu from "../../utils/components/CopyMenu";
import DontShowInfo from "../../utils/components/DontShowInfo";
import {
    ProcessButton,
    type ProcessProps,
    type ProcessRef
} from "../../utils/global/.processClass";
import { debugLog, isArraysEquals, setStyle } from "../../utils/global/common";
import { useSpDevTools } from "../../utils/global/spContext";
import { useCurrentRecord } from "../../utils/hooks/use/useCurrentRecord";
import { useFormContextDocument } from "../../utils/hooks/use/useFormContextDocument";
import { RetrieveAllAttributes } from "../../utils/hooks/XrmApi/RetrieveAllAttributes";
import type { FormContext } from "../../utils/types/FormContext";

class DirtyFieldsButton extends ProcessButton {
    constructor() {
        super("dirtyfields", "Dirty Attributes", <DirtyLensIcon />, 350);
        this.process = DirtyFieldsButtonProcess;
        this.description = (
            <>
                <Typography>
                    <i>
                        See your unsaved changes at a glance, and easily
                        navigate to them with a click.
                    </i>
                </Typography>
                <Typography>
                    This tool <b>displays the fields that have been changed</b>{" "}
                    but not yet saved.
                </Typography>
                <Typography>
                    By clicking on the box, you can trigger the focus of the
                    fields on the form. This can even be on a different tab.
                </Typography>
                <Typography>
                    You can also enable an option to display a{" "}
                    <span style={{ outline: "2px dashed #ff2500" }}>
                        red box around
                    </span>{" "}
                    the field controls on the form, making them visually stand
                    out.
                </Typography>
            </>
        );
    }
}

declare module "@mui/material/Divider" {
    interface DividerPropsVariantOverrides {
        bold: true;
    }
}

const DirtyFieldsButtonProcess = forwardRef<ProcessRef, ProcessProps>(
    function DirtyFieldsButtonProcess(props: ProcessProps, ref) {
        const {
            d365MainAndIframeUpdated: domUpdated,
            formContext,
            formDocument
        } = useFormContextDocument();

        const { isDebug } = useSpDevTools();
        const { entityName, recordId } = useCurrentRecord();

        const [attributes, isFetching] = RetrieveAllAttributes(
            entityName ?? "",
            recordId
        );
        const [dirtyAttributes, setDirtyAttributes] = useState<
            Xrm.Attributes.Attribute[]
        >([]);

        const { value: squareFormEnabled, toggle: toggleSquareFormEnabled } =
            useBoolean(false);

        useEffect(() => {
            const currentDirty = formContext?.getAttribute((a) =>
                a.getIsDirty()
            );
            if (currentDirty && dirtyAttributes) {
                const isUnchanged = isArraysEquals(
                    currentDirty.map((a) => a.getName()),
                    dirtyAttributes.map((a) => a.getName())
                );
                if (!isUnchanged) {
                    setDirtyAttributes(currentDirty);
                }
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [formContext, domUpdated]);

        useEffect(() => {
            if (squareFormEnabled) {
                const selector = dirtyAttributes
                    ?.flatMap((attribute) =>
                        attribute.controls
                            .get()
                            .map(
                                (control) =>
                                    `[data-control-name='${control.getName()}']>div`
                            )
                    )
                    .join(",");
                if (selector !== undefined) {
                    setStyle(
                        formDocument ?? document,
                        "styleModifier-dirtyfields",
                        {
                            [selector]: [
                                "outline: 2px dashed #ff2500",
                                "outline-offset: -2px"
                            ]
                        }
                    );
                }
            } else {
                setStyle(
                    formDocument ?? document,
                    "styleModifier-dirtyfields",
                    {}
                );
            }
        }, [dirtyAttributes, formDocument, squareFormEnabled]);

        useEffect(() => {
            props.setBadge(dirtyAttributes.length || null);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [dirtyAttributes]);

        return (
            <Stack height="calc(100% - 10px)" padding="10px">
                <DontShowInfo storageName={`${props.id}-maininfo`}>
                    <Typography variant="body2">
                        You can click on an item to focus on the form's field.
                    </Typography>
                </DontShowInfo>

                <Stack
                    spacing={4}
                    alignItems="center"
                    height="100%"
                    sx={{ overflowY: "scroll", overflowX: "hidden" }}>
                    <List
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                            overflowY: "auto"
                        }}
                        component="nav"
                        subheader={
                            <ListSubheader
                                component="div"
                                sx={{ lineHeight: "unset" }}>
                                <Divider />
                                <FormControl
                                    component="fieldset"
                                    variant="standard">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={squareFormEnabled}
                                                onClick={
                                                    toggleSquareFormEnabled
                                                }
                                            />
                                        }
                                        label="Display in form"
                                    />
                                    {isDebug.value && (
                                        <Button
                                            onClick={() =>
                                                debugLog(
                                                    "DirtyFields retrieved attributes:",
                                                    attributes
                                                )
                                            }>
                                            Display Retrieved Attributes
                                        </Button>
                                    )}
                                </FormControl>
                                <Divider />
                            </ListSubheader>
                        }>
                        {dirtyAttributes.map((attribute, index) => {
                            const attributeName = attribute.getName();
                            const attributeValue =
                                getAttributeValueString(attribute);
                            const oldAttributeSelector =
                                attribute.getAttributeType() === "lookup"
                                    ? `_${attributeName}_value`
                                    : attributeName;
                            return (
                                <DirtyAttributeItem
                                    key={attributeName + "dirty"}
                                    currentFormContext={formContext}
                                    name={attributeName}
                                    oldValue={attributes[oldAttributeSelector]}
                                    value={attributeValue}
                                />
                            );
                        })}
                    </List>
                </Stack>
                {isDebug.value && (
                    <>
                        <Divider />
                        <Typography maxHeight="19px" variant="caption">
                            {entityName + " / " + recordId}
                        </Typography>
                    </>
                )}
            </Stack>
        );
    }
);

function getAttributeValueString(
    attribute: Xrm.Attributes.Attribute<any>
): string | null {
    switch (attribute.getAttributeType()) {
        case "boolean":
        case "decimal":
        case "double":
        case "integer":
        case "memo":
        case "money":
        case "optionset":
        case "string":
            return attribute.getValue() ?? null;

        case "lookup":
            if (!attribute.getValue() || attribute.getValue()?.length === 0) {
                return null;
            } else if (attribute.getValue()?.length === 1) {
                return attribute
                    .getValue()[0]
                    .id.replace("{", "")
                    .replace("}", "");
            }
            return `[${attribute
                .getValue()
                .map((value: any) =>
                    value?.id.replace("{", "").replace("}", "")
                )
                .join(", ")}]`;

        case "datetime":
            return attribute.getValue()?.toISOString() ?? null;
    }
    return null;
}

interface DirtyAttributeItemProps {
    name: string;
    value: any;
    oldValue: any;
    currentFormContext: FormContext;
}
const DirtyAttributeItem = React.memo((props: DirtyAttributeItemProps) => {
    const { name, oldValue, value, currentFormContext } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = useCallback(() => {
        currentFormContext
            ?.getAttribute<Xrm.Attributes.Attribute>(name)
            ?.controls.get(0)
            ?.setFocus?.();
    }, [currentFormContext, name]);

    const handleOpenContextualMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setAnchorEl(e.currentTarget);
            e.preventDefault();
        },
        [setAnchorEl]
    );

    const handleCloseContextualMenu = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const copyContent = useMemo(() => {
        return [
            { title: "logicalname", content: name },
            { title: "new value", content: value ?? "null" },
            { title: "old value", content: oldValue ?? "null" }
        ];
    }, [name, oldValue, value]);

    return (
        <ListItem key={"dirtyField" + name} sx={{ p: 0 }}>
            <ListItemButton
                onClick={handleClick}
                onContextMenu={handleOpenContextualMenu}>
                <ListItemText
                    primary={name}
                    secondary={
                        <>
                            <ValueDisplay title="New Value" value={value} />
                            <ValueDisplay
                                title="Previous Value"
                                value={oldValue}
                            />
                        </>
                    }
                />
            </ListItemButton>
            <CopyMenu
                anchorElement={anchorEl}
                onClose={handleCloseContextualMenu}
                items={copyContent}
            />
            <Divider />
        </ListItem>
    );
});

interface ValueDisplayProps {
    title: string;
    value: any;
}
function ValueDisplay(props: ValueDisplayProps) {
    return (
        <Typography component="p" variant="caption" color="text.secondary">
            {props.title}:
            <Typography
                sx={{ display: "inline", ml: 1 }}
                component="p"
                variant="body2"
                color="text.primary">
                {props.value !== null && props.value !== undefined ? (
                    props.value
                ) : (
                    <i>null</i>
                )}
            </Typography>
        </Typography>
    );
}

const dirtyFields = new DirtyFieldsButton();
export default dirtyFields;
