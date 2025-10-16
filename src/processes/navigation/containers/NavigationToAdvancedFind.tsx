
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import type { NavigationButton } from '../../../utils/types/NavigationButton';
import DirectNavigationButton from '../components/NavigationButton';

function AdvancedFind(props: NavigationButton) {
    const { environmentId, clientUrl } = props;


    async function handleClick() {
        const entityName = Xrm.Utility.getPageContext()?.input?.entityName;
        if (entityName) {
            const objectTypeCode = (await Xrm.Utility.getEntityMetadata(entityName)).ObjectTypeCode;
            window.open(`${clientUrl}/main.aspx?extraqs=%3F%26EntityCode%3D${objectTypeCode}&pagetype=AdvancedFind`, '_blank');
        }
        else {
            window.open(`${clientUrl}/main.aspx?pagetype=AdvancedFind`, '_blank');
        }
    }

    return (
        <DirectNavigationButton
            icon={<FilterAltIcon />}
            label='Advanced Find'
            onClick={handleClick}
            tooltip='Original Advanced Find'
        />
    )
}

export default AdvancedFind;