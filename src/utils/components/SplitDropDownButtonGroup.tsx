import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    createTheme,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    type ButtonGroupProps,
    type ButtonProps
} from "@mui/material";
import React, { useEffect, useRef, useState, type PropsWithChildren } from "react";

createTheme({
    components: {
        MuiButton: {
            styleOverrides: {}
        }
    }
});

interface SplitButtonAction {
    id?: string;
    title: React.ReactNode;
    action: () => void;
    disabled?: boolean;
    onSelect?: () => void;
}

interface SplitDropDownButtonGroupProps {
    options: SplitButtonAction[];
    defaultActionIndex?: number;
    actionIndex?: number;
    splitButtonProps?: ButtonProps;
}
function SplitDropDownButtonGroup(
    props: SplitDropDownButtonGroupProps & Omit<ButtonGroupProps, "onClick" | "ref" | "sx"> & PropsWithChildren
) {
    const { options, defaultActionIndex, actionIndex, children, splitButtonProps, ...buttonGroupProps } = props;

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(defaultActionIndex ?? 0);

    useEffect(() => {
        if (!actionIndex) {
            setSelectedIndex(0);
        } else if (actionIndex >= options.length) {
            setSelectedIndex(options.length - 1);
        } else {
            setSelectedIndex(actionIndex);
        }
    }, [actionIndex, options.length]);

    useEffect(() => {
        options[selectedIndex]?.onSelect?.();
    }, [options, selectedIndex]);

    const handleMenuItemClick = (index: number) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <ButtonGroup
                fullWidth
                {...buttonGroupProps}
                sx={(theme) => ({
                    "& > *:first-of-type": {
                        borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`
                    },
                    "& > *": {
                        borderRadius: "0 !important"
                    },
                    "& > *:last-of-type": {
                        borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`
                    },
                })}>
                {children}
                <Button
                    onClick={options[selectedIndex].action}
                    {...splitButtonProps}
                    variant={splitButtonProps?.variant ?? buttonGroupProps.variant}>
                    {options[selectedIndex].title}
                </Button>
                <Button
                    ref={anchorRef}
                    onClick={handleToggle}
                    {...splitButtonProps}
                    style={{ width: 40 }}
                    variant={splitButtonProps?.variant ?? buttonGroupProps.variant}>
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper sx={{ zIndex: 10 }} open={open} anchorEl={anchorRef.current} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                        }}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option.title + "_buttonselection"}
                                            selected={index === selectedIndex}
                                            onClick={() => handleMenuItemClick(index)}
                                            disabled={option.disabled}>
                                            {option.title}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

export default SplitDropDownButtonGroup;
