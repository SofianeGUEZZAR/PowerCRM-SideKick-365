import { forwardRef, useState } from "react";

import EntityMetadataListGrid from "../../utils/components/MetadataBrowser/EntityMetadataListGrid";
import MetadataContextProvider from "../../utils/components/MetadataBrowser/MetadataContextProvider";
import { GridButtonsContext } from "../../utils/components/MetadataBrowser/ObjectListGrid";
import { ProcessButton, type ProcessProps, type ProcessRef } from "../../utils/global/.processClass";

class MetadataBrowserProcess extends ProcessButton {
    static id = "metadatabrowser";
    constructor() {
        super("metadatabrowser");
        this.process = MetadataBrowser;
    }
}

const MetadataBrowser = forwardRef<ProcessRef, ProcessProps>(function MetadataBrowserProcess(props: ProcessProps, ref) {
    const [openedGridId, setOpenedGridId] = useState("");

    return (
        <MetadataContextProvider>
            <GridButtonsContext.Provider value={{ openedGridId, openGrid: setOpenedGridId }}>
                <EntityMetadataListGrid />
            </GridButtonsContext.Provider>
        </MetadataContextProvider>
    );
});


export default MetadataBrowserProcess;
