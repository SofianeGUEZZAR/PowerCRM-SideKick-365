import { useCallback, useContext } from 'react';
import TabUnselectedIcon from '@mui/icons-material/TabUnselected';
import { type IToolButtonStandard, FormToolButton } from '../shared/FormToolButton';
import { FormToolContext } from '../shared/context';


function RefreshRibbon(props: IToolButtonStandard) {

    const { formContext } = useContext(FormToolContext);

    const refreshRibbonCallback = useCallback(() => {
        formContext?.ui.refreshRibbon(true);
    }, [formContext]);

    return (
        <FormToolButton
            controlled={false}
            icon={<TabUnselectedIcon />}
            tooltip='Refresh Ribbon'
            onClick={refreshRibbonCallback}
        />
    );
}

export default RefreshRibbon;