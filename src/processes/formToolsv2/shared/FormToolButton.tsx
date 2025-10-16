import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import {
    forwardRef,
    useCallback,
    useContext,
    type Dispatch,
    type SetStateAction
} from "react";
import { FormToolContext } from "./context";


type ToolButtonStandardIdentifier = { controlled: false };
type ToolButtonControlledIdentifier = { controlled: true };

export type IToolButtonStandard = {} & ToolButtonStandardIdentifier;

type IToolButtonStandardWithClick = {
    onClick: () => void;
} & ToolButtonStandardIdentifier;

export type IToolButtonControlled = {
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
} & ToolButtonControlledIdentifier;

export type IToolButton = {
    icon: React.ReactNode;
    tooltip: React.ReactNode;

    controlled: boolean;
} & (IToolButtonStandardWithClick | Omit<IToolButtonControlled, "enabled">);

export const FormToolButton = forwardRef<any, IToolButton>((props, ref) => {
    const { controlled } = props;

    if (controlled) {
        return <ToolButtonControlled ref={ref} {...props} />;
    }
    if (controlled === false) {
        return <ToolButtonStandard ref={ref} {...props} />;
    }
});

const ToolButtonStandard = forwardRef<any, IToolButton & { controlled: false }>(
    (props, ref) => {
        const { icon, tooltip, onClick } = props;
        const { refresh } = useContext(FormToolContext);

        const refreshContextThenClick = useCallback(() => {
            refresh();
            onClick();
        }, [onClick, refresh]);

        return (
            <Tooltip title={tooltip} placement="left" disableInteractive arrow>
                <Button
                    ref={ref}
                    variant="contained"
                    onClick={refreshContextThenClick}
                    startIcon={icon}
                />
            </Tooltip>
        );
    }
);

const ToolButtonControlled = forwardRef<
    any,
    IToolButton & { controlled: true }
>((props, ref) => {
    const { controlled, setEnabled, ...otherProps } = props;

    const toggle = useCallback(() => {
        setEnabled((prev) => !prev);
    }, [setEnabled]);

    return (
        <ToolButtonStandard
            ref={ref}
            controlled={false}
            onClick={toggle}
            {...otherProps}
        />
    );
});

export type FormControlState<T> = {
    name: string;
    defaultState: T;
};
