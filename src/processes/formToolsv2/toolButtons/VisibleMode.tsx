import { useContext, useEffect, useMemo } from "react";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { type FormControlState, type IToolButtonControlled, ToolButton } from "../ToolButton";
import { FormToolContext } from "../context";

type VisibleModeStateType = FormControlState<boolean>;
function VisibleMode(props: IToolButtonControlled) {

    const { enabled: visibleModeEnable, setEnabled: setVisibleMode } = props;

    const { formContext } = useContext(FormToolContext);


    const visibilityControlsFields = useMemo(async () => {
        if (!formContext) {
            return null;
        }
        const controls: Xrm.Controls.Control[] = formContext.getControl();

        const allcontrols: VisibleModeStateType[] = controls?.map<VisibleModeStateType>(c => {
            return {
                name: c.getName(),
                defaultState: c.getVisible() ?? true,
            }
        });
        return allcontrols;

    }, [formContext]);

    const visibilityControlsTabs = useMemo(async () => {
        if (!formContext) {
            return null;
        }
        const tabs: Xrm.Controls.Tab[] = formContext.ui.tabs?.get();

        const allcontrols: VisibleModeStateType[] = tabs?.map<VisibleModeStateType>(t => {
            return {
                name: t.getName(),
                defaultState: t.getVisible() ?? true,
            }
        });
        return allcontrols;

    }, [formContext]);

    const visibilityControlsSection = useMemo(async () => {
        if (!formContext) {
            return;
        }
        const tabs: Xrm.Controls.Tab[] = formContext.ui.tabs?.get();
        const sections: Xrm.Controls.Section[] = tabs?.flatMap(t => t.sections?.get());

        const allcontrols: VisibleModeStateType[] = sections?.map<VisibleModeStateType>(s => {
            return {
                name: s.getName(),
                defaultState: s.getVisible() ?? true,
            }
        });
        return allcontrols;

    }, [formContext]);


    useEffect(() => {
        if (!formContext) {
            return;
        }

        const toggle = async () => {
            visibilityControlsFields.then((controls) => {
                controls?.forEach(control => {
                    const controlTemp: any = formContext!.getControl(control.name) as any;
                    controlTemp.setVisible?.(visibleModeEnable || control.defaultState);
                });
            })
            visibilityControlsTabs.then((tabs) => {
                tabs?.forEach(tab => {
                    const tabControlTemp = formContext!.ui.tabs?.get(tab.name);
                    tabControlTemp.setVisible(visibleModeEnable || tab.defaultState);
                    visibilityControlsSection.then((sections) => {
                        sections?.forEach(section => {
                            const sectionControlTemp = tabControlTemp.sections?.get(section.name);
                            if (sectionControlTemp) {
                                sectionControlTemp.setVisible(visibleModeEnable || section.defaultState)
                            }
                        })
                    })
                });
            })
        }

        toggle();
    }, [visibleModeEnable, visibilityControlsFields, visibilityControlsTabs, visibilityControlsSection, formContext]);


    return (
        <ToolButton
            controlled={true}
            icon={visibleModeEnable ? <VisibilityIcon /> : <VisibilityOffOutlinedIcon />}
            tooltip='Visible Mode'
            setEnabled={setVisibleMode}
        />
    );
}

export default VisibleMode;