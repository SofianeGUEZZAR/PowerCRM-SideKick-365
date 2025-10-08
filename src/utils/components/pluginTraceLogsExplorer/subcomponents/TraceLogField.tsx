import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface TraceLogFieldProps {
    label: string,
    value: any,
}
function TraceLogField(props: TraceLogFieldProps) {
    const { label, value } = props;

    return (
        <Grid size={{ xs: 4 }}>
            <Stack direction='row' gap={1} alignItems='center'>
                <Typography width='60%'>
                    {label}:
                </Typography>
                <TextField
                    fullWidth
                    variant="filled"
                    value={value ?? ''}
                    size="small"
                    focused={false}
                    inputProps={({
                        style: { padding: '4px 12px' },
                        readOnly: true,
                    })}
                />
            </Stack>
        </Grid>
    );
}

export default TraceLogField;