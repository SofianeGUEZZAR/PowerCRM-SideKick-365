import { useCallback, useEffect, useMemo, useState } from "react";

import { debugLog } from "../../global/common";

export function useChromeStorage<T>(key: string, defaultData?: T): [T | null, (data: T) => void] {
    const [data, setData] = useState<T | null>(null);

    const set = (data: T) => {
        let dataUpdate: { [key: string]: any } = {};
        dataUpdate[key] = data;
        chrome.storage.sync.set(dataUpdate);
    };

    useEffect(() => {
        async function getData() {
            const dataStored = await chrome.storage.sync.get(key);
            debugLog(key, dataStored);
            if (dataStored && dataStored[key]) {
                setData(dataStored[key]);
            } else if (defaultData !== undefined) {
                setData(defaultData);
            }
        }
        setData(null);
        getData();
    }, [defaultData, key]);

    return [data, set];
}
