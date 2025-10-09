import { useState, forwardRef, useCallback } from "react";
import clsx from "clsx";
import { useSnackbar, SnackbarContent, type CustomContentProps } from "notistack";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert, { type AlertColor } from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { PROJECT_PREFIX } from "../global/var";
import { AlertTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";



declare module "notistack" {
    interface VariantOverrides {
        detailsFile: true;
    }

    interface OptionsObject {
        detailsVariant?: AlertColor;
        allowDownload?: boolean;
        downloadButtonLabel?: string;
        detailsNode?: React.ReactNode;
        fileContent?: string;
        fileName?: string;
    }
}

const useStyles = makeStyles(() => ({
    root: {
        "@media (min-width:600px)": {
            minWidth: "344px !important"
        }
    },
    icons: {
        marginLeft: "auto"
    },
    expand: {
        transform: "rotate(0deg)",
        transition: "all .2s"
    },
    expandOpen: {
        transform: "rotate(180deg)"
    },
    paper: {
        padding: 16,
        width: "86%"
    },
    checkIcon: {
        fontSize: 20,
        paddingRight: 4
    },
    button: {
        padding: 0,
        textTransform: "none"
    }
}));

interface DetailsSnackbarProps extends CustomContentProps {
    detailsVariant: AlertColor;
    allowDownload?: boolean;
    downloadButtonLabel?: string;
    detailsNode: React.ReactNode;
    fileName?: string;
    fileContent?: string;
}

const DetailsSnackbar = forwardRef<HTMLDivElement, DetailsSnackbarProps>(
    ({ id, ...props }, ref) => {
        const classes = useStyles();
        const { closeSnackbar } = useSnackbar();
        const [expanded, setExpanded] = useState(false);

        const handleExpandClick = useCallback(() => {
            setExpanded((oldExpanded) => !oldExpanded);
        }, []);

        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        const downloadTxtFile = () => {
            if (!props.fileContent || !props.fileName) return;
            const errorRawObject = JSON.parse(props.fileContent);

            const element = document.createElement("a");
            const file = new Blob([JSON.stringify(errorRawObject, null, 2)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = props.fileName;
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            element.remove();
        }

        return (
            <SnackbarContent ref={ref} className={classes.root}>
                <Alert variant='filled' severity={props.detailsVariant} iconMapping={{ error: <CancelIcon /> }} sx={{ [`&.${PROJECT_PREFIX}Alert-message`]: { pt: 1, pb: 1 } }}>
                    <AlertTitle>
                        <Stack width='100%' direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2">{props.message}</Typography>
                            <IconButton
                                aria-label="Show more"
                                size="small"
                                sx={{color:"inherit", opacity:0.8}}
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expanded
                                })}
                                onClick={handleExpandClick}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{color:"inherit", opacity:0.8}}
                                onClick={handleDismiss}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </AlertTitle>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper className={classes.paper}>
                            {
                                !!props.detailsNode && props.detailsNode
                            }
                            {
                                props.allowDownload &&
                                <Button size="small" color="primary" className={classes.button} onClick={downloadTxtFile}>
                                    <CheckCircleIcon className={classes.checkIcon} />
                                    {props.downloadButtonLabel}
                                </Button>
                            }
                        </Paper>
                    </Collapse>
                </Alert>
            </SnackbarContent>
        );
    }
);

DetailsSnackbar.displayName = "DetailsSnackbar";

export default DetailsSnackbar;
