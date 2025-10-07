
import { NavigationButton } from '../../../utils/types/NavigationButton';
import { PowerAutomateIcon } from '../icons';
import DirectNavigationButton from '../components/NavigationButton';

function ToPowerAutomate(props: NavigationButton) {
    const { environmentId, clientUrl } = props;

    function handleClick() {
        window.open(`https://make.powerautomate.com/environments/${environmentId}/home`, '_blank');
    }

    return (
        <DirectNavigationButton
            icon={<PowerAutomateIcon />}
            label='Power Automate'
            onClick={handleClick}
            tooltip='Power Automate - Home'
        />
    )
}

export default ToPowerAutomate;