import { Box, Button, type ButtonProps, type SxProps, type Theme } from "@mui/material";
import React from "react";
import BlockIcon from '@mui/icons-material/Block';


interface RedDisabledButtonProps {
    buttonSx?: SxProps<Theme>
}
function RedDisabledButton(props: ButtonProps & RedDisabledButtonProps) {
    const { disabled, buttonSx } = props;

    return (
        <Box>
            <Box position='relative' sx={props.sx}>
                <Button {...props} sx={buttonSx} />
                {disabled && <BlockIcon color='error' sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.75 }} />}
            </Box>
        </Box>
    )
}

export default RedDisabledButton;