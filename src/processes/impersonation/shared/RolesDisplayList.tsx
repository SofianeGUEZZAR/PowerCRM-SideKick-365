import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import type { ActiveUser } from "~utils/types/ActiveUser";
import type { TeamsSecurityRole } from "~utils/types/SecurityRole";

interface RolesDisplayListProps {
    user: ActiveUser;
}
const RolesDisplayList = React.memo((props: RolesDisplayListProps) => {
    const { user } = props;

    return (
        <List
            dense
            subheader={
                <>
                    <b>User roles</b>:
                </>
            }
            sx={{ fontSize: "1.15em" }}>
            {user.securityRoles.map((s) => (
                <ListItem sx={{ display: "list-item", pt: 0, pb: 0 }}>
                    <ListItemText primary={s.name} />
                </ListItem>
            ))}
            {!user.teamsRoles && (
                <ListItem sx={{ display: "list-item", pt: 0, pb: 0 }}>
                    <ListItemText primary={<i>Fetching teams security roles...</i>} />
                </ListItem>
            )}
            {user.teamsRoles &&
                Object.values(
                    user.teamsRoles.reduce((result: { [key: string]: TeamsSecurityRole[] }, currentItem) => {
                        // Retrieve attribute value to group by
                        const groupKey = currentItem["teamid"];
                        // Initialize the group if not existing
                        if (!result[groupKey]) {
                            result[groupKey] = [];
                        }
                        // Add element to group
                        result[groupKey].push(currentItem);
                        return result;
                    }, {})
                ).map((roles) => {
                    return (
                        <>
                            {roles.map((r) => (
                                <ListItem sx={{ display: "list-item", pt: 0, pb: 0 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                {r.name}{" "}
                                                <Typography sx={{ opacity: 0.75 }} variant="caption">
                                                    (team{" "}
                                                    <b>
                                                        <i>{roles[0]?.teamname}</i>
                                                    </b>{" "}
                                                    inheritance)
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </>
                    );
                })}
        </List>
    );
});

export default RolesDisplayList;