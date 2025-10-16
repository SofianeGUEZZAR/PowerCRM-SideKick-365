import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { forwardRef, useMemo } from "react";

import { ProcessButton, type ProcessProps, type ProcessRef } from "../../utils/global/.processClass";
import AdvancedFind from "./containers/NavigationToAdvancedFind";
import NavigationAzurePortal from "./containers/NavigationToAzurePortal";
import NavigationToFormEditor from "./containers/NavigationToFormEditor";
import NavigationToPowerAdmin from "./containers/NavigationToPowerAdmin";
import NavigationToPowerApps from "./containers/NavigationToPowerApps";
import NavigationToPowerAutomate from "./containers/NavigationToPowerAutomate";
import NavigationToSecurity from "./containers/NavigationToSecurity";
import NavigationToSolutionList from "./containers/NavigationToSolutionList";

class NavigationProcess extends ProcessButton {
    static id = "navigation";
    constructor() {
        super("navigation");
        this.process = Navigation;
    }
}

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    maxWidth: "46px",
                    minWidth: "auto"
                },
                startIcon: {
                    marginLeft: 0,
                    marginRight: 0
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: "1em"
                }
            }
        }
    }
});

const buttons = [
    NavigationToSolutionList,
    NavigationToFormEditor,
    AdvancedFind,
    NavigationToPowerApps,
    NavigationToPowerAutomate,
    NavigationToPowerAdmin,
    NavigationAzurePortal,
    NavigationToSecurity
];

const Navigation = forwardRef<ProcessRef, ProcessProps>(function NavigationProcess(props: ProcessProps, ref) {
    const environmentId = useMemo(
        () => (Xrm.Utility.getGlobalContext().organizationSettings as any).bapEnvironmentId,
        []
    );
    const clientUrl = useMemo(() => Xrm.Utility.getGlobalContext().getClientUrl(), []);

    return (
        <ThemeProvider theme={theme}>
            <Stack spacing={2} height="calc(100% - 10px)" padding="10px" alignItems="center">
                {buttons.map((Button) => {
                    return <Button environmentId={environmentId} clientUrl={clientUrl} />;
                })}
            </Stack>
        </ThemeProvider>
    );
});


export default NavigationProcess;
