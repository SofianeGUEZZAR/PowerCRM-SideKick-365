import { useContext, useEffect, useMemo, useState } from 'react';

import { Portal } from '@mui/material';
import { ControlType } from '../../../utils/types/ControlType';

import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { LogicalNameTypography } from '../../../utils/components/LogicalNameTypography';
import { setStyle } from '../../../utils/global/common';
import { IToolButtonControlled, ToolButton } from '../ToolButton';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { FormToolContext } from '../context';


function ShowFieldLabel(props: IToolButtonControlled) {

    const { enabled: labelDisplayed, setEnabled: setLabelDisplayed, } = props;

    const { formContext, formDocument, domUpdated, xrmRoute } = useContext(FormToolContext);

    const [formFields, setFormFields] = useState<Xrm.Controls.Control[] | null>(null);
    const [grids, setGrids] = useState<Xrm.Controls.GridControl[] | null>(null);

    useEffect(() => {
        if (formDocument) {
            setStyle(formDocument, "fieldLabelSheet", {
                "div[fieldlogicalname]": ["width:100%", "min-width:0"]
            });
        }
    }, [formDocument]);

    useEffect(() => {
        if (formContext) {
            const controls: Xrm.Controls.Control[] = formContext.getControl((c) => {
                const type = c.getControlType();
                if (type.startsWith(ControlType.CUSTOMSUBGRID)) return false;
                switch (type) {
                    case ControlType.IFRAME:
                    case ControlType.SUBGRID:
                    case ControlType.WEBRESSOURCE:
                    case ControlType.NOTES:
                    case ControlType.TIMER:
                    case ControlType.KBSEARCH:
                    case ControlType.TIMELINE:
                    case ControlType.QUICKFORM:
                        return false;
                    default:
                        return true;
                }
            });
            setFormFields(controls);
        }
        else {
            setFormFields(null);
        }
    }, [domUpdated, formContext]);


    useEffect(() => {
        if (formContext) {
            const gridControls = formContext.getControl(
                (c) =>
                    c.getControlType() === ControlType.SUBGRID ||
                    c.getControlType().startsWith(ControlType.CUSTOMSUBGRID)
            ) as Xrm.Controls.GridControl[];
            setGrids(gridControls);
        }
        else {
            setGrids(null);
        }
    }, [domUpdated, formContext]);


    // const { values: fieldLabelNodes, setDict: setFieldLabelNodeDict } = useDictionnary<HTMLDivElement>({});
    const [fieldLabelNodes, setFieldLabelNodes] = useState<HTMLDivElement[]>([]);
    useEffect(() => {
        if (!formDocument || !formFields) {
            return;
        }

        const newNodes: HTMLDivElement[] = [];
        formFields?.forEach((control) => {
            const controlName = control.getName();

            const alreadyProcessed = formDocument.querySelector<HTMLDivElement>(`[data-id="${controlName}"] [fieldlogicalname], [id="${controlName}"] [fieldlogicalname]`);
            if (alreadyProcessed) {
                newNodes.push(alreadyProcessed);
            }
            else {
                const controlNodeLabel = formDocument.querySelector<HTMLElement>(`[data-id="${controlName}"] :not([fieldlogicalname]) > label, [id="${controlName}"] :not([fieldlogicalname]) > label`);
                if (controlNodeLabel) {
                    const controlNodeParent = controlNodeLabel?.parentElement ?? null;
                    const controlNode = formDocument.createElement('div');
                    controlNode.setAttribute('fieldlogicalname', controlName);
                    controlNodeLabel && controlNode.append(controlNodeLabel);
                    controlNodeParent?.prepend(controlNode);
                    newNodes.push(controlNode);
                }
            }
        });
        setFieldLabelNodes(newNodes);
    }, [domUpdated, formFields, formDocument, setFieldLabelNodes]);

    // const { values: gridLabelNodes, setDict: setGridLabelNodeDict } = useDictionnary<HTMLDivElement>({});
    const [gridLabelNodes, setGridLabelNodes] = useState<HTMLDivElement[]>([]);
    useEffect(() => {
        if (!formDocument || !grids) {
            return;
        }

        const newNodes: HTMLDivElement[] = [];
        grids.forEach((control) => {
            const gridName: string = control.getName();

            const alreadyProcessed = formDocument.querySelector<HTMLDivElement>(`#dataSetRoot_${gridName} > div:first-child div[gridlogicalname]`);
            if (alreadyProcessed) {
                newNodes.push(alreadyProcessed);
            }
            else {
                const gridNodeParent: Element | null = formDocument.querySelector(`#dataSetRoot_${gridName} > div:first-child:not(:has(div[gridlogicalname]))`);
                if (gridNodeParent) {
                    const gridNode = formDocument.createElement('div');
                    gridNode.setAttribute('gridlogicalname', gridName);
                    gridNodeParent?.append(gridNode);
                    newNodes.push(gridNode);
                }
            }
        });
        setGridLabelNodes(newNodes);
    }, [domUpdated, grids, formDocument, setGridLabelNodes]);

    useEffect(() => {
        setFieldLabelNodes([]);
        setGridLabelNodes([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFieldLabelNodes, setGridLabelNodes, xrmRoute.current]);


    const fieldLabelPortal = useMemo(() => {
        if (!labelDisplayed) {
            return;
        }
        return fieldLabelNodes?.map(fieldLabelNode => {
            const fieldName = fieldLabelNode.getAttribute('fieldlogicalname');
            if (!fieldName) {
                return null;
            }
            return (
                <Portal key={`fieldlabel_${fieldName}`} container={fieldLabelNode}>
                    <LogicalNameTypography label={fieldName} />
                </Portal>
            );
        });
    }, [labelDisplayed, fieldLabelNodes]);

    const gridLabelPortal = useMemo(() => {
        if (!labelDisplayed) {
            return;
        }
        return Object.values(gridLabelNodes)?.map(gridLabelNode => {
            const gridName = gridLabelNode.getAttribute('gridlogicalname');
            if (!gridName) {
                return null;
            }
            return (
                <Portal key={`gridlabel_${gridName}`} container={gridLabelNode}>
                    <LogicalNameTypography label={gridName} />
                </Portal>
            );
        });
    }, [labelDisplayed, gridLabelNodes]);


    const cache = createCache({
        key: 'css',
        container: formDocument?.head ?? document.head,
        prepend: true
    });

    return (<>
        <ToolButton
            controlled={true}
            icon={labelDisplayed ? <TurnedInIcon /> : <TurnedInNotIcon />}
            tooltip='Show Fields & Grids Control LogicalNames'
            setEnabled={setLabelDisplayed}
        />
        <CacheProvider value={cache as any}>
            {fieldLabelPortal}
            {gridLabelPortal}
        </CacheProvider>
    </>
    );
}

export default ShowFieldLabel;