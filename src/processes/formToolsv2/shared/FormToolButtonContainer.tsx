import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
    useCallback,
    useEffect,
    useState,
    type PropsWithChildren
} from "react";
import ComponentContainer, { type ComponentContainerProps } from "~utils/components/ComponentContainer";
import { useStateArray } from "~utils/hooks/use/useStateArray";
import type { IToolButtonStandard, IToolButtonControlled } from "./FormToolButton";


function ToolButtonContainerContent(
    props: ComponentContainerProps & PropsWithChildren
) {
    const { children, ...containerProps } = props;

    return (
        <ComponentContainer width="100%" {...containerProps}>
            <Stack spacing={1} padding="5px">
                {children}
            </Stack>
        </ComponentContainer>
    );
}

interface IToolButtonContainer {
    title?: string;
    toolList: ((props: IToolButtonStandard) => JSX.Element)[];
}
export function FormToolButtonContainer(props: IToolButtonContainer) {
    const { title, toolList } = props;

    return (
        <ToolButtonContainerContent
            Legends={{
                left: title
                    ? {
                          component: (
                              <div style={{ writingMode: "vertical-rl" }}>
                                  {title}
                              </div>
                          )
                      }
                    : undefined
            }}>
            {toolList.map((Tool, index) => {
                return (
                    <Tool
                        key={`toolButtonContainer${index}`}
                        controlled={false}
                    />
                );
            })}
        </ToolButtonContainerContent>
    );
}

interface IToggableToolButtonContainer {
    icons?: { enabled: React.ReactNode; disabled: React.ReactNode };
    toolList: ((props: IToolButtonControlled) => JSX.Element)[];
}
export function ToggableToolButtonContainer(
    props: Omit<IToolButtonContainer, "toolList"> & IToggableToolButtonContainer
) {
    const { icons, title, toolList } = props;

    const [allModeEnabled, setAllModeEnabled] = useState<boolean>(false);
    const [modesArrayEnabled, setModesArrayEnabled, setAllModesArrayEnabled] =
        useStateArray<boolean>(toolList.length, false);

    useEffect(() => {
        setAllModeEnabled((oldAllModeEnabled) => {
            if (
                !oldAllModeEnabled &&
                modesArrayEnabled.every((modes) => modes)
            ) {
                return true;
            }
            if (
                oldAllModeEnabled &&
                !modesArrayEnabled.every((modes) => modes)
            ) {
                return false;
            }
            return oldAllModeEnabled;
        });
    }, [modesArrayEnabled]);

    const toggleAll = useCallback(() => {
        setAllModesArrayEnabled(!allModeEnabled);
    }, [allModeEnabled, setAllModesArrayEnabled]);

    return (
        <ToolButtonContainerContent
            Legends={{
                top: icons
                    ? {
                          component: (
                              <Tooltip
                                  title="Toggle all"
                                  placement="left"
                                  disableInteractive
                                  arrow>
                                  <IconButton
                                      color="primary"
                                      onClick={toggleAll}
                                      size="small">
                                      {allModeEnabled
                                          ? icons.enabled
                                          : icons.disabled}
                                  </IconButton>
                              </Tooltip>
                          ),
                          margin: "15px",
                          padding: "15px"
                      }
                    : undefined,
                left: title
                    ? {
                          component: (
                              <Typography
                                  variant="caption"
                                  lineHeight={0}
                                  sx={{
                                      writingMode: "vertical-rl",
                                      userSelect: "none"
                                  }}>
                                  {title}
                              </Typography>
                          )
                          // component: <div style={{ writingMode: 'vertical-rl', userSelect:'none' }}>{title}</div>
                      }
                    : undefined
            }}>
            {toolList.map((Tool, index) => {
                return (
                    <Tool
                        key={`toolButtonContainer${index}`}
                        controlled={true}
                        enabled={modesArrayEnabled[index]}
                        setEnabled={setModesArrayEnabled[index]}
                    />
                );
            })}
        </ToolButtonContainerContent>
    );
}
