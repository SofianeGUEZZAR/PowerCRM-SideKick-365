
import { Container,  Stack,  Alert,  Typography,  Button } from "@mui/material";
import { useCallback } from "react";
import { defaultProcessesList } from "~processes/.list";
import { debugLog } from "~utils/global/common";
import { STORAGE_ListName, STORAGE_DontShowInfo } from "~utils/global/var";
import { useChromeStorage } from "~utils/hooks/use/useChromeStorage";
import { MessageType } from "~utils/types/Message";
import type { StorageConfiguration } from "~utils/types/StorageConfiguration";


const OptionsScreen: React.FunctionComponent = () => {

    const [processesList, setProcessList] = useChromeStorage<StorageConfiguration[]>(STORAGE_ListName, defaultProcessesList);


    const resetImpersonate = useCallback(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            const activeTabURL = activeTab.url;
            if (!activeTab.id || !activeTabURL) return;

            const urlObject = new URL(activeTabURL);

            chrome.runtime.sendMessage({ type: MessageType.IMPERSONATE, data: { userSelected: null, selectedon: new Date(), url: urlObject.origin } },
                function () {
                    chrome.tabs.reload(activeTab.id!, { bypassCache: true })
                }
            );

        });
    }, []);


    const resetProcessList = useCallback(() => {
        setProcessList(defaultProcessesList);
    }, [setProcessList]);


    const resetDontShowInfo = useCallback(() => {
        chrome.runtime.sendMessage({ type: MessageType.SETCONFIGURATION, data: { key: STORAGE_DontShowInfo, configurations: null } },
            function (response) {
                if (response.success) { }
            }
        );
    }, []);




    return (
        <Container sx={{ width: '600px', p: 2 }}>

            <Stack direction='column' spacing={1}>

                <Alert severity='warning'>
                    <Typography component='p' fontWeight='bold' fontSize='0.95rem'>
                        This section is not where you can use this extension:
                    </Typography>
                    <Typography component='p' fontSize='0.95rem'>
                        Dynamics SideKick adds a panel at the right of Dynamics 365 pages.
                    </Typography>
                </Alert>

                <Alert severity='info'>
                    <Typography component='p' fontSize='0.95rem'>
                        This screen contains buttons that can be used to reset some features of this extension.
                    </Typography>
                </Alert>

                <Button
                    variant='contained'
                    onClick={resetProcessList}>
                    Reset Tool List
                </Button>

                <Button
                    variant='contained'
                    onClick={resetImpersonate}>
                    Reset Impersonation on Active tab
                </Button>

                <Button
                    variant='contained'
                    onClick={resetDontShowInfo}>
                    Reset "Don't Show" Infos
                </Button>

            </Stack>
        </Container>
    )
}


// waitForElm(document, '#root', { infiniteWait: true }).then((rootDiv) => {
//     if (rootDiv) {
//         ReactDOM.render(
//             <OptionsScreen />,
//             rootDiv
//         );
//     }
// });

// debugLog("Option loaded");
export default OptionsScreen;