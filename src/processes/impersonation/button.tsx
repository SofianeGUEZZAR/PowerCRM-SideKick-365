import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import React, {  } from 'react';


import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { ConvertToActiveUserObject } from '../../utils/hooks/XrmApi/RetrieveActiveUsersWithSecurityRoles';

import { MessageType } from '../../utils/types/Message';
import type { ActiveUser } from '../../utils/types/ActiveUser';
import type { ProviderContext } from 'notistack';
import MessageManager from '../../utils/global/MessageManager';

import { ToolPanelButton } from '~utils/global/.toolPanelButton';
import RolesDisplayList from './shared/RolesDisplayList';

class ImpersonationButton extends ToolPanelButton {
    static id = "impersonate";
    constructor() {
        super(
            'impersonate',
            'Impersonation',
            () => PersonSearchIcon,
            350
        );
        this.description = <>
            <Typography><i>Empower yourself with the ability to impersonate any user on your environment.</i></Typography>
            <Typography>The list of users you can impersonate depends on the environment type:</Typography>
            <List sx={{ listStyleType: 'disc', ml: 3, pt: 0 }}>
                <Typography component='li'><b>Online</b>: Enabled users with valid licenses associated with a security role.</Typography>
                <Typography component='li'><b>On-Premise</b>: Enabled users associated with a security role.</Typography>
            </List>
            <Typography>You can <b>filter</b> the list by <b>name</b>, <b>email address</b> and even with <b>security roles</b>.</Typography>
            <Typography>You can also check each user's security by hovering over their entry in the list.</Typography>
        </>
    }

    onExtensionLoad(snackbarProviderContext: ProviderContext): void {

        MessageManager.sendMessage(MessageType.GETIMPERSONATION).then(
            async function (existingRules: chrome.declarativeNetRequest.Rule[] | null) {
                const url = Xrm.Utility.getGlobalContext().getClientUrl();
                const currentRule = existingRules?.find(r => r.condition.urlFilter?.includes(url) && !r.condition.urlFilter.includes('RemovedAction'));

                if (currentRule) {
                    const currentAzureIdOrUserId = currentRule.action.requestHeaders?.at(0)?.value;

                    if (currentAzureIdOrUserId) {

                        const result = await Xrm.WebApi.online.retrieveMultipleRecords("systemuser", `?$select=systemuserid,fullname&$filter=(systemuserid eq ${currentAzureIdOrUserId} or azureactivedirectoryobjectid eq ${currentAzureIdOrUserId})&$expand=systemuserroles_association($select=roleid,name,roleidunique),teammembership_association($select=teamid,name)`);
                        if (result.entities.length > 0) {
                            const user: ActiveUser = await ConvertToActiveUserObject(result.entities[0]);

                            snackbarProviderContext.enqueueSnackbar(<>You are impersonating <b>{user.fullname}</b> ({user.systemuserid})</>, {
                                variant: 'detailsFile',
                                detailsVariant: 'info',
                                persist: true,
                                detailsNode: <RolesDisplayList user={user} />
                            })
                        }
                    }
                }
            }
        );
    }
}


export default ImpersonationButton;