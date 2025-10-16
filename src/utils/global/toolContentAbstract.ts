import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from "plasmo";
import { createRoot } from "react-dom/client";

import type { ProcessButton } from "./.processClass";

type ProcessButtonConstructor<T extends ProcessButton> = {
    new (): T;
    prefixId: string;
    id: string;
};

export function buildGetRootContainer<T extends ProcessButton>(toolClass: ProcessButtonConstructor<T>) {
    const toolId = `#${toolClass.prefixId}${toolClass.id}`;
    const instance = new toolClass();
    const instanceProcess = instance.getProcess();

    const roots = new Map<string, ReturnType<typeof createRoot>>();

    function mountIfNeeded(container: Element) {
        if (roots.has(toolId)) return;

        const root = createRoot(container);
        root.render(instanceProcess);
        roots.set(toolId, root);
    }

    function unmountIfNeeded() {
        const root = roots.get(toolId);
        if (root) {
            root.unmount();
            roots.delete(toolId);
        }
    }

    const getRootContainer = () =>
        new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const rootContainer = document.querySelector(toolId);
                if (rootContainer) {
                    // clearInterval(checkInterval);
                    // resolve(rootContainer);
                    mountIfNeeded(rootContainer);
                } else {
                    unmountIfNeeded();
                }
            }, 137);
        });

    return getRootContainer;

    // export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
    //     const rootContainer = await createRootContainer();
    //     mountIfNeeded(rootContainer);
    //     // const root = createRoot(rootContainer);
    //     // root.render(instanceProcess);
    // };
}
