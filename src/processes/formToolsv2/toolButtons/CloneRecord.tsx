import { useContext } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import { type IToolButtonStandard, FormToolButton } from '../shared/FormToolButton';
import { FormToolContext } from '../shared/context';

function CloneRecord(props: IToolButtonStandard) {

    const { formContext } = useContext(FormToolContext);


    const openClonedRecord = () => {
        if (!formContext?.data?.entity) return;

        var pageInput: Xrm.Navigation.PageInputEntityRecord = {
            pageType: "entityrecord",
            entityName: formContext.data?.entity?.getEntityName(),
            data: formContext.getAttribute().reduce((data, attribute) => ({ ...data, [attribute.getName()]: attribute.getValue() }), {})
        };
        var navigationOptions: Xrm.Navigation.NavigationOptions = {
            target: 2,
            height: { value: 80, unit: "%" },
            width: { value: 70, unit: "%" },
            position: 1
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions);
    }

    return (
        <FormToolButton
            controlled={false}
            icon={<FileCopyIcon />}
            tooltip='Clone Record'
            onClick={openClonedRecord}
        />
    );
}

export default CloneRecord;