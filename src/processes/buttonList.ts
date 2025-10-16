import { ToolPanelButton } from "~utils/global/.toolPanelButton";

import { type StorageConfiguration } from "../utils/types/StorageConfiguration";
import allFields from "./allFields/button";
import commandDebugger from "./commandDebugger/button";
import dirtyFields from "./dirtyFields/button";
import entitiesList from "./entitiesList/button";
import formToolsV2 from "./formToolsv2/button";
import impersonation from "./impersonation/button";
import metadataBrowser from "./metadataBrowser/button";
import navigation from "./navigation/button";
import optionSetTable from "./optionSetTable/button";
import pluginTraceLogsExplorer from "./pluginTraceLogsExplorer/button";
import relatedRecords from "./relatedRecords/button";
import createConfiguration from "./setConfiguration/button";
import updateRecord from "./updateRecord/button";
import webResourceEditor from "./webResourceEditor/button";

// import ExtensionTarget from '../utils/types/ExtensionTarget';

// const TARGET = process.env.REACT_APP_TARGET;

export const ToolPanelButtonList: ToolPanelButton[] = [
    new formToolsV2(),
    new updateRecord(),
    new allFields(),
    new optionSetTable(),
    new dirtyFields(),
    new relatedRecords(),
    new entitiesList(),
    new impersonation(),
    // // ...(TARGET === ExtensionTarget.Chrome ? [webResourceEditor] : []),
    new webResourceEditor(),
    new pluginTraceLogsExplorer(),
    new metadataBrowser(),
    new navigation(),
    new commandDebugger(),
    new createConfiguration()
];

export function getToolButton(prefixedId: string): ToolPanelButton | null {
    return ToolPanelButtonList.find((tool) => tool.prefixedId === prefixedId);
}

// export const ProcessesInstance: ProcessButton[] = [
//     new formToolsV2(),
//     new updateRecord(),
//     new allFields(),
//     new optionSetTable(),
//     new dirtyFields(),
//     new relatedRecords(),
//     new entitiesList(),
//     new impersonation(),
//     // ...(TARGET === ExtensionTarget.Chrome ? [webResourceEditor] : []),
//     new webResourceEditor(),
//     new pluginTraceLogsExplorer(),
//     new metadataBrowser(),
//     new navigation(),
//     new commandDebugger(),
//     new createConfiguration()
// ];

export const defaultToolList: StorageConfiguration[] = ToolPanelButtonList.map((tool) => {
    return {
        id: tool.prefixedId,
        startOnLoad: false,
        hidden: false,
        expand: false,
        options: null
    };
});

//* Workflow Activities Explorer
//* pluginTrace: add filtering on step name (maybe add an accordeon navigation bar containing all filtering options)
//! pluginTrace: Context section croped when screen too small
//! update: lookups with multiple targets use only one for the grid explorer
//! update: lookups with multiple targers cannot create/update because it miss the target in the logicalname
//! related records: errors during retreiving (Account - OneToMany)
//! metadata: actions menu don't close on clickaway
//! dirty: oldValue issue on complex email fields
//? formtool: label not displayed in sub form (lookup control)
//? options: add version to option
//? configuration: add delay option
// force refresh webressource
// force refresh dirtyfields

// uuid module path wrong
// related record more than 10Mo ????