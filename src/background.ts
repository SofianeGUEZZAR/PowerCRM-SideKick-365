
import {  manageImpersonation } from "./processes/impersonation/background";
import { getExtensionConfiguration, setExtensionConfiguration } from "./processes/setConfiguration/background";
// import { debuggerAttached, disableScriptOverride, enableScriptOverride as enableScriptOverriding, getScriptOverride as getScriptOverriding } from "./processes/webResourceEditor/background";
import { getSessionRules } from "./utils/global/DeclarativeNetRequestManager";
import { MessageType } from "./utils/types/Message";

chrome.runtime.onMessageExternal.addListener(messagesStation);
chrome.runtime.onMessage.addListener(messagesStation);

function messagesStation(message: { type: string, data: any }, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    console.log("background onMessageExternal", message);

    switch (message.type) {
        case MessageType.REFRESHBYPASSCACHE:
            sender.tab && sender.tab.id && chrome.tabs.reload(sender.tab.id, { bypassCache: true });
            return false;

        case MessageType.IMPERSONATE:
            manageImpersonation(message.data, sender).then(sendResponse);
            return true;
        case MessageType.GETIMPERSONATION:
            getSessionRules().then(sendResponse);
            return true;

        case MessageType.SETCONFIGURATION:
            setExtensionConfiguration(message.data);
            return false;
        case MessageType.GETCONFIGURATION:
            getExtensionConfiguration(message.data).then(sendResponse);
            return true;

        // case MessageType.ENABLESCRIPTOVERRIDING:
        //     enableScriptOverriding(message.data, sender);
        //     return false;
        // case MessageType.DISABLESCRIPTOVERRIDING:
        //     disableScriptOverride(sender);
        //     return false;
        // case MessageType.GETCURRENTSCRIPTOVERRIDING:
        //     getScriptOverriding(sender).then(sendResponse);
        //     return true;
        // case MessageType.ISDEBUGGERATTACHED:
        //     debuggerAttached(sender).then(sendResponse);
        //     return true;

        case MessageType.OPENOPTIONS:
            chrome.action.openPopup();
            return false;

        default:
            break;
    }

    return false;
}