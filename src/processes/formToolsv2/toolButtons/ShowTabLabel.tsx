import { useContext, useEffect, useMemo, useState } from 'react';

import { Portal } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import { LogicalNameTypography } from '../../../utils/components/LogicalNameTypography';
import { type IToolButtonControlled, FormToolButton } from '../shared/FormToolButton';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { FormToolContext } from '../shared/context';

function ShowTabLabel(props: IToolButtonControlled) {

    const { enabled: labelDisplayed, setEnabled: setLabelDisplayed, } = props;

    const { formContext, formDocument, domUpdated, xrmRoute } = useContext(FormToolContext);

    const [tabControls, setTabControls] = useState<Xrm.Controls.Tab[] | null>(null);
    const [sectionControls, setSectionControls] = useState<Xrm.Controls.Section[] | null>(null);

    useEffect(() => {
        if (formContext) {
            const tabs: Xrm.Controls.Tab[] = formContext.ui.tabs?.get();
            setTabControls(tabs);
        }
        else {
            setTabControls(null);
        }
    }, [domUpdated, formContext]);

    useEffect(() => {
        if (formContext) {
            const tabs: Xrm.Controls.Tab[] = formContext.ui.tabs?.get();
            const sections: Xrm.Controls.Section[] = tabs?.flatMap(t => t.sections?.get()) || [];
            setSectionControls(sections);
        }
        else {
            setSectionControls(null);
        }
    }, [domUpdated, formContext]);



    const [tabLabelNodes, setTabLabelNodes] = useState<HTMLDivElement[]>([]);
    useEffect(() => {
        if (!formDocument || !tabControls) {
            return;
        }

        const newNodes: HTMLDivElement[] = [];
        tabControls.forEach((tabControl) => {
            const tabName: string = tabControl.getName();
            const tabNodeParent = formDocument.querySelector<HTMLElement>(`li[data-id$="tablist-${tabName}"]:not(:has([tablogicalname]))`);

            if (tabNodeParent) {
                const tabNode = formDocument.createElement('div');
                tabNode.setAttribute('tablogicalname', tabName);
                tabNodeParent?.insertBefore(tabNode, tabNodeParent.children[0]);
                newNodes.push(tabNode);
            }
            else {
                const tabNodeAlreadyProcessed = formDocument.querySelector<HTMLDivElement>(`li[data-id$="tablist-${tabName}"] > div[tablogicalname]`);
                if (tabNodeAlreadyProcessed)
                    newNodes.push(tabNodeAlreadyProcessed);

            }
        });
        setTabLabelNodes(newNodes);
    }, [domUpdated, tabControls, formDocument, setTabLabelNodes]);

    const [sectionLabelNodes, setSectionLabelNodes] = useState<HTMLDivElement[]>([]);
    useEffect(() => {
        if (!formDocument || !sectionControls) {
            return;
        }

        const newNodes: HTMLDivElement[] = [];
        sectionControls.forEach((sectionControl) => {
            const sectionName: string = sectionControl.getName();
            const sectionNodeParent: Element | null = formDocument.querySelector(`section[data-id$="${sectionName}"]:not(:has([sectionlogicalname]))`);

            if (sectionNodeParent) {
                const sectionNode = formDocument.createElement('div');
                sectionNode.setAttribute('sectionlogicalname', sectionName);
                sectionNodeParent?.prepend(sectionNode);
                newNodes.push(sectionNode);
            }
            else {
                const sectionNodeAlreadyProcessed = formDocument.querySelector<HTMLDivElement>(`section[data-id$="${sectionName}"] > div[sectionlogicalname]`);
                if (sectionNodeAlreadyProcessed)
                    newNodes.push(sectionNodeAlreadyProcessed);
            }
        });
        setSectionLabelNodes(newNodes);
    }, [domUpdated, sectionControls, formDocument, setSectionLabelNodes]);

    useEffect(() => {
        setTabLabelNodes([]);
        setSectionLabelNodes([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTabLabelNodes, setSectionLabelNodes, xrmRoute.current]);



    const tabLabelPortal = useMemo(() => {
        if (!labelDisplayed) {
            return;
        }
        return tabLabelNodes?.map(controlNode => {
            const tabName = controlNode.getAttribute('tablogicalname');
            if (!tabName) {
                return null;
            }
            return (
                <Portal key={`tabName_${tabName}`} container={controlNode}>
                    <LogicalNameTypography label={tabName} />
                </Portal>
            );
        });
    }, [labelDisplayed, tabLabelNodes]);

    const sectionLabelPortal = useMemo(() => {
        if (!labelDisplayed) {
            return;
        }
        return sectionLabelNodes?.map(controlNode => {
            const sectionName = controlNode.getAttribute('sectionlogicalname');
            if (!sectionName) {
                return null;
            }
            return (
                <Portal key={`sectionName_${sectionName}`} container={controlNode}>
                    <LogicalNameTypography label={sectionName} />
                </Portal>
            );
        });
    }, [labelDisplayed, sectionLabelNodes]);


    const cache = createCache({
        key: 'css',
        container: formDocument?.head ?? document.head,
        prepend: true
    });


    return (
        <>
            <FormToolButton
                controlled={true}
                icon={labelDisplayed ? <BookIcon /> : <BookOutlinedIcon />}
                tooltip='Show Tabs & Sections Control LogicalNames'
                setEnabled={setLabelDisplayed}
            />
            <CacheProvider value={cache as any}>
                {tabLabelPortal}
                {sectionLabelPortal}
            </CacheProvider>
        </>
    );
}

export default ShowTabLabel;