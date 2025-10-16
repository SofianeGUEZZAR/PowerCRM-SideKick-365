import { useCallback, useContext } from 'react';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import { type IToolButtonStandard, FormToolButton } from '../shared/FormToolButton';
import { FormToolContext } from '../shared/context';


function RefreshForm(props: IToolButtonStandard) {

    const { formContext } = useContext(FormToolContext);

    const refreshFromData = useCallback(() => {
        formContext?.data.refresh(false);
    }, [formContext]);

    return (
        <FormToolButton
            controlled={false}
            icon={<ViewQuiltIcon />}
            tooltip='Refresh Form Data'
            onClick={refreshFromData}
        />
    );
}

export default RefreshForm;