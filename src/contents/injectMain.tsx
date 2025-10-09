import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";
import type { PlasmoCSConfig } from "plasmo";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import { MainScreen } from "~processes/main";
import { ProcessButton } from "~utils/global/.processClass";
import { waitForElm } from "~utils/global/common";
import {
    DRAWER_CONTAINER_ID,
    MESSAGE_SOURCE_Content,
    MESSAGE_SOURCE_WebPage
} from "~utils/global/var";
import XrmObserver from "~utils/global/XrmObserver";

import { PROJECT_PREFIX } from "~utils/global/var";

export const config: PlasmoCSConfig = {
    matches: ["*://*/*"],
    world: "MAIN"
};

const searchedScripts = [
    "/uclient/scripts/cdnEndpointCheck.js",
    "/uclient/scripts/MicrosoftAjax.js"
];

// window.onload = async () => {
//     const isCRMD365 = Array.from(document.scripts).some(
//         (script) =>
//             searchedScripts.some(src => script.src.indexOf(src) !== -1)
//     );
//     console.log('This page is CRM:', isCRMD365);
//     if (isCRMD365) {
//         // injectScript(chrome.runtime.getURL("static/js/d365-sidekick.js"));
//         SaveData(chrome.runtime.getURL(""), "extensionURL");
//     }
// }

const fileName = "d365-sidekick";

// var injectScript = function (file: string): void {
//     var existingScript = document.querySelector("script[src='" + file + "']");
//     if (existingScript) {
//         console.log("Script " + file + " removed");
//         existingScript.parentElement?.removeChild(existingScript);
//     }
//     var scriptTag = document.createElement("script");
//     scriptTag.setAttribute("type", "text/javascript");
//     scriptTag.setAttribute("src", file);
//     document.body.appendChild(scriptTag);
// };

// function SaveData(data: string, id: string): void {
//     var existingNode = document.querySelector("#" + id);
//     if (existingNode) {
//         console.log("Node " + id + " removed");
//         existingNode.parentElement?.removeChild(existingNode);
//     }
//     var imageElement = document.createElement("saving");
//     imageElement.setAttribute("data", data);
//     imageElement.setAttribute("style", "display:none;");
//     imageElement.setAttribute("id", id);
//     document.body.appendChild(imageElement);
// }

function initExtension() {
    waitForElm(document, "#mainContent", { infiniteWait: true }).then(
        (mainNode) => {
            const drawerContainer = document.createElement("div");
            drawerContainer.setAttribute(
                "id",
                ProcessButton.prefixId + DRAWER_CONTAINER_ID
            );
            mainNode?.append(drawerContainer);

            const root = createRoot(drawerContainer, {
                identifierPrefix: ProcessButton.prefixId
            });
            root.render(<MainScreen />);
        }
    );

    new XrmObserver();
}

setTimeout(async () => {
    const isCRMD365 = Array.from(document.scripts).some((script) =>
        searchedScripts.some((src) => script.src.indexOf(src) !== -1)
    );
    console.log("This page is CRM:", isCRMD365);
    if (isCRMD365) {
        // injectScript(chrome.runtime.getURL(`static/js/${fileName}.js`));
        // SaveData(chrome.runtime.getURL(""), "extensionURL");

        if (window.top && window.top.window === window) {
            var loading = setInterval(() => {
                if (!!window.top.Xrm) {
                    clearInterval(loading);
                    initExtension();
                }
            }, 1000);
        }
    }
}, 2000);


// window.addEventListener("message", (event) => {
//     if (event.source !== window) return;
//     if (event.data.source !== MESSAGE_SOURCE_WebPage) return;

//     const messageId = event.data.id;

//     chrome.runtime.sendMessage(
//         { type: event.data.type, data: event.data.data },
//         function (response: any) {
//             window.postMessage(
//                 { id: messageId, source: MESSAGE_SOURCE_Content, response },
//                 "*"
//             );
//         }
//     );
// });

ClassNameGenerator.configure(
    (componentName) => `${PROJECT_PREFIX}${componentName.replace("Mui", "")}`
);

export default () => null;
