// import { ProcessButton } from "../utils/global/.processClass";
// import { type StorageConfiguration } from "../utils/types/StorageConfiguration";

// import formToolsV2 from "./formToolsv2/tool";
// import updateRecord from "./updateRecord/main";
// import allFields from "./allFields/main";
// import optionSetTable from "./optionSetTable/main";
// import dirtyFields from "./dirtyFields/main";
// import relatedRecords from "./relatedRecords/main";
// import entitiesList from "./entitiesList/main";
// import impersonation from "./impersonation/main";
// import webResourceEditor from "./webResourceEditor/main";
// import pluginTraceLogsExplorer from "./pluginTraceLogsExplorer/tool";
// import metadataBrowser from "./metadataBrowser/main";
// import navigation from "./navigation/main";
// import commandDebugger from "./commandDebugger/main";
// import createConfiguration from "./setConfiguration/main";

// // import ExtensionTarget from '../utils/types/ExtensionTarget';

// // const TARGET = process.env.REACT_APP_TARGET;

// export const Processes: (typeof ProcessButton)[] = [
//     formToolsV2,
//     updateRecord,
//     allFields,
//     optionSetTable,
//     dirtyFields,
//     relatedRecords,
//     entitiesList,
//     impersonation,
//     // ...(TARGET === ExtensionTarget.Chrome ? [webResourceEditor] : []),
//     webResourceEditor,
//     pluginTraceLogsExplorer,
//     metadataBrowser,
//     navigation,
//     commandDebugger,
//     createConfiguration
// ];

// export function getToolButton(id: string): (typeof ProcessButton) | null {
//     return Processes.find((tool) => tool.id === id);
// }

// // export const ProcessesInstance: ProcessButton[] = [
// //     new formToolsV2(),
// //     new updateRecord(),
// //     new allFields(),
// //     new optionSetTable(),
// //     new dirtyFields(),
// //     new relatedRecords(),
// //     new entitiesList(),
// //     new impersonation(),
// //     // ...(TARGET === ExtensionTarget.Chrome ? [webResourceEditor] : []),
// //     new webResourceEditor(),
// //     new pluginTraceLogsExplorer(),
// //     new metadataBrowser(),
// //     new navigation(),
// //     new commandDebugger(),
// //     new createConfiguration()
// // ];

// export const defaultProcessesList: StorageConfiguration[] = Processes.map((tool) => {
//     return {
//         id: tool.id,
//         startOnLoad: false,
//         hidden: false,
//         expand: false,
//         options: null
//     };
// });

// //* Workflow Activities Explorer
// //* pluginTrace: add filtering on step name (maybe add an accordeon navigation bar containing all filtering options)
// //! pluginTrace: Context section croped when screen too small
// //! update: lookups with multiple targets use only one for the grid explorer
// //! update: lookups with multiple targers cannot create/update because it miss the target in the logicalname
// //! related records: errors during retreiving (Account - OneToMany)
// //! metadata: actions menu don't close on clickaway
// //! dirty: oldValue issue on complex email fields
// //? formtool: label not displayed in sub form (lookup control)
// //? options: add version to option
// //? configuration: add delay option
