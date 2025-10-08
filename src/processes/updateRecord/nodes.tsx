// Old module: react hooks are not well done but still work. A rework need to be done
/* eslint-disable react-hooks/exhaustive-deps */

import '../../utils/global/extensions';

import dayjs, { Dayjs } from 'dayjs';
import React, {
    type ReactNode, useEffect,
    useMemo, useState
} from 'react';

import ShortTextIcon from '@mui/icons-material/ShortText';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ListIcon from '@mui/icons-material/List';
import NotesIcon from '@mui/icons-material/Notes';
import NumbersIcon from '@mui/icons-material/Numbers';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

import MuiCalculator from '../../utils/components/MuiCalculator';
import NumericInput from '../../utils/components/NumericInput';
import RecordSelector from '../../utils/components/RecordSelector';
import { getCurrentDynamics365DateTimeFormat, groupBy, isArraysEquals } from '../../utils/global/common';
import {
    type AttributeMetadata, MSDateFormat, MSType
} from '../../utils/types/requestsType';
import {
    type PickListOption, RetrievePicklistValues
} from '../../utils/hooks/XrmApi/RetrievePicklistValues';
import { RetrieveSetName } from '../../utils/hooks/XrmApi/RetrieveSetName';
import { createSvgIcon, type Theme } from '@mui/material';
import { useUpdateEffect } from '@custom-react-hooks/all';


const DecimalIcon = createSvgIcon(
    <path
        d="M10 7A3 3 0 0 0 7 10V13A3 3 0 0 0 13 13V10A3 3 0 0 0 10 7M11 13A1 1 0 0 1 9 13V10A1 1 0 0 1 11 10M17 7A3 3 0 0 0 14 10V13A3 3 0 0 0 20 13V10A3 3 0 0 0 17 7M18 13A1 1 0 0 1 16 13V10A1 1 0 0 1 18 10M6 15A1 1 0 1 1 5 14A1 1 0 0 1 6 15Z"
    />,
    'Decimal',
);


export type AttributeProps = {
    attribute: AttributeMetadata,
    value: any,
    reset: boolean,
    remove: boolean,
    manageDirty: { set: () => void, remove: () => void },
    disabled: boolean,
    attributeToUpdateManager: { setAttributesValue: (key: string, value: any) => void, removeAttributesValue: (key: string) => void }
}

export function LookupNode(props: AttributeProps & { theme: Theme }) {
    const [oldValue, setOldValue] = useState<string[]>(props.value ? [props.value] : []);
    const [value, setValue] = useState<string[]>(props.value ? [props.value] : []);
    const [updatingValue, setUpdatingValue] = useState<string[]>([]);

    const pluralName = RetrieveSetName(props.attribute.Parameters.Target);

    useEffect(() => {
        if (!props.disabled) {
            var val;
            if (value.length)
                val = "/" + pluralName + "(" + value.at(0) + ")";
            else
                val = null;
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName + "@odata.bind", val);
        }
    }, [pluralName, value]);


    const setDirty = (newValue: string[]) => {
        if (!isArraysEquals(oldValue, newValue)) {
            props.manageDirty.set();
        }
        else {
            props.manageDirty.remove();
        }
    }

    useEffect(() => {
        setOldValue(props.value ? [props.value] : []);
        setValue(props.value ? [props.value] : []);
        setUpdatingValue(props.value ? [props.value] : []);
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue);
            setUpdatingValue(oldValue);
            props.manageDirty.remove();
        }
    }, [oldValue, props.manageDirty, props.reset]);

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName + "@odata.bind");
        }
    }, [props.attributeToUpdateManager, props.remove]);

    useUpdateEffect(() => {
        if (isArraysEquals(value, updatingValue)) return;
        setValue(updatingValue ? updatingValue : []);
        setDirty(updatingValue ? updatingValue : []);
    }, [updatingValue]);


    return <RecordSelector
        entityname={props.attribute.Parameters.Target}
        recordsIds={value}
        setRecordsIds={setUpdatingValue}
        disabled={props.disabled}
        theme={props.theme}
    />
}
export function StringNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<string | null>(props.value ? props.value : null)
    const [value, setValue] = useState<string | null>(props.value ? props.value : null)
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue: string | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? props.value : null)
        setValue(props.value ? props.value : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset]);

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value
        setValue(newValue ? newValue : null)
        setDirty(newValue ? newValue : null)
    }

    return (
        <>
            <TextField
                placeholder='Enter a string'
                size={"small"}
                fullWidth
                inputProps={{ maxLength: props.attribute.Parameters.MaxLength }}
                value={value ?? ''}
                onChange={onChange}
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setOpenDialog(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <ShortTextIcon />
                        </InputAdornment>
                    )
                }}
            />
            {
                !props.disabled && openDialog &&
                <Dialog onClose={() => { setOpenDialog(false) }} open={openDialog} maxWidth={false} >
                    <DialogTitle>
                        Text Editor
                    </DialogTitle>
                    <DialogContent sx={{ height: "55vh", width: "50vw" }}>
                        <TextField
                            multiline
                            value={value ?? ''}
                            onChange={onChange}
                            rows={25}
                            fullWidth
                            inputProps={{ maxLength: props.attribute.Parameters.MaxLength }}
                        />
                    </DialogContent>
                    <Stack direction='row' justifyContent='space-between' margin='10px' marginTop='0' marginLeft='25px'>
                        <span>{value?.length ?? 0} / {props.attribute.Parameters.MaxLength}</span>
                        <Button variant='contained' onClick={() => { setOpenDialog(false) }}>
                            Close
                        </Button>
                    </Stack>
                </Dialog>
            }
        </>
    )
}
export function MemoNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<string | null>(props.value ? props.value : null)
    const [value, setValue] = useState<string | null>(props.value ? props.value : null)
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: string | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? props.value : null)
        setValue(props.value ? props.value : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value
        setValue(newValue ? newValue : null)
        setDirty(newValue ? newValue : null)
    }


    return (
        <>
            <TextField
                placeholder='Enter a multipleline string'
                size={"small"}
                fullWidth
                multiline
                rows={1}
                inputProps={{ maxLength: props.attribute.Parameters.MaxLength }}
                value={value ?? ''}
                onChange={onChange}
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setOpenDialog(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <NotesIcon />
                        </InputAdornment>
                    )
                }}
            />
            {
                !props.disabled && openDialog &&
                <Dialog onClose={() => { setOpenDialog(false) }} open={openDialog} maxWidth={false} >
                    <DialogTitle>
                        Text Editor
                    </DialogTitle>
                    <DialogContent sx={{ height: "55vh", width: "50vw" }}>
                        <TextField
                            multiline
                            value={value ?? ''}
                            onChange={onChange}
                            rows={25}
                            fullWidth
                            inputProps={{ maxLength: props.attribute.Parameters.MaxLength }}
                        />
                    </DialogContent>
                    <Stack direction='row' justifyContent='space-between' margin='10px' marginTop='0' marginLeft='25px'>
                        <span>{value?.length ?? 0} / {props.attribute.Parameters.MaxLength}</span>
                        <Button variant='contained' onClick={() => { setOpenDialog(false) }}>
                            Close
                        </Button>
                    </Stack>
                </Dialog>
            }
        </>
    )
}
export function DecimalNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [value, setValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: number | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? Number(props.value) : null)
        setValue(props.value ? Number(props.value) : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (newValue: number | null) => {
        setValue(newValue)
        setDirty(newValue)
    }
    

    return (
        <>
            <NumericInput
                fullWidth
                placeholder={"Decimal by " + props.attribute.Parameters.Precision}
                value={value}
                onChange={onChange}
                variant='outlined'
                size='small'
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setCalculatorOpen(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <DecimalIcon />
                        </InputAdornment>
                    )
                }}
                numericOptions={{
                    allowDecimalPadding: 'floats',
                    decimalCharacter: '.',
                    decimalPlaces: props.attribute.Parameters.Precision,
                    decimalPlacesRawValue: props.attribute.Parameters.Precision,
                    digitGroupSeparator: ',',
                    modifyValueOnWheel: false,
                    readOnly: props.disabled,
                    minimumValue: props.attribute.Parameters.MinValue.noExponents(),
                    maximumValue: props.attribute.Parameters.MaxValue.noExponents(),
                    selectOnFocus: false,
                    onInvalidPaste: 'clamp',
                }}
            />
            {
                calculatorOpen &&
                <MuiCalculator
                    value={value}
                    open={calculatorOpen}
                    onClose={() => { setCalculatorOpen(false) }}
                    integer={false}
                    onChange={onChange}
                    minimumValue={Number(props.attribute.Parameters.MinValue.noExponents())}
                    maximumValue={Number(props.attribute.Parameters.MaxValue.noExponents())}
                />
            }
        </>
    )
}
export function DoubleNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [value, setValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: number | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? Number(props.value) : null)
        setValue(props.value ? Number(props.value) : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (newValue: number | null) => {
        setValue(newValue)
        setDirty(newValue)
    }

    return (
        <>
            <NumericInput
                fullWidth
                placeholder={"Double by " + props.attribute.Parameters.Precision}
                value={value}
                onChange={onChange}
                variant='outlined'
                size='small'
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setCalculatorOpen(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <DecimalIcon />
                        </InputAdornment>
                    )
                }}
                numericOptions={{
                    allowDecimalPadding: 'floats',
                    decimalCharacter: '.',
                    decimalPlaces: props.attribute.Parameters.Precision,
                    decimalPlacesRawValue: props.attribute.Parameters.Precision,
                    digitGroupSeparator: ',',
                    modifyValueOnWheel: false,
                    readOnly: props.disabled,
                    minimumValue: props.attribute.Parameters.MinValue.noExponents(),
                    maximumValue: props.attribute.Parameters.MaxValue.noExponents(),
                    selectOnFocus: false,
                    onInvalidPaste: 'clamp',
                }}
            />
            {
                calculatorOpen &&
                <MuiCalculator
                    value={value}
                    open={calculatorOpen}
                    onClose={() => { setCalculatorOpen(false) }}
                    integer={false}
                    onChange={onChange}
                    minimumValue={Number(props.attribute.Parameters.MinValue.noExponents())}
                    maximumValue={Number(props.attribute.Parameters.MaxValue.noExponents())}
                />
            }
        </>
    )
}
export function MoneyNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<number | null>(props.value ? props.value : null)
    const [value, setValue] = useState<number | null>(props.value ? props.value : null)
    const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: number | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? props.value : null)
        setValue(props.value ? props.value : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (newValue: number | null) => {
        setValue(newValue)
        setDirty(newValue)
    }

    return (
        <>
            <NumericInput
                fullWidth
                placeholder={"Money by " + props.attribute.Parameters.Precision}
                value={value}
                onChange={onChange}
                variant='outlined'
                size='small'
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setCalculatorOpen(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <AttachMoneyIcon />
                        </InputAdornment>
                    )
                }}
                numericOptions={{
                    allowDecimalPadding: 'floats',
                    decimalCharacter: '.',
                    decimalPlaces: props.attribute.Parameters.Precision,
                    decimalPlacesRawValue: props.attribute.Parameters.Precision,
                    digitGroupSeparator: ',',
                    modifyValueOnWheel: false,
                    readOnly: props.disabled,
                    minimumValue: props.attribute.Parameters.MinValue.noExponents(),
                    maximumValue: props.attribute.Parameters.MaxValue.noExponents(),
                    selectOnFocus: false,
                    onInvalidPaste: 'clamp',
                }}
            />
            {
                calculatorOpen &&
                <MuiCalculator
                    value={value}
                    open={calculatorOpen}
                    onClose={() => { setCalculatorOpen(false) }}
                    integer={false}
                    onChange={onChange}
                    minimumValue={Number(props.attribute.Parameters.MinValue.noExponents())}
                    maximumValue={Number(props.attribute.Parameters.MaxValue.noExponents())}
                />
            }
        </>
    )
}
export function IntegerNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [value, setValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: number | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? Number(props.value) : null)
        setValue(props.value ? Number(props.value) : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (newValue: number | null) => {
        setValue(newValue)
        setDirty(newValue)
    }

    return (
        <>
            <NumericInput
                fullWidth
                placeholder={"Integer"}
                value={value}
                onChange={onChange}
                variant='outlined'
                size='small'
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setCalculatorOpen(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <NumbersIcon />
                        </InputAdornment>
                    )
                }}
                numericOptions={{
                    decimalCharacter: '.',
                    decimalPlaces: 0,
                    decimalPlacesRawValue: 0,
                    digitGroupSeparator: ',',
                    modifyValueOnWheel: false,
                    readOnly: props.disabled,
                    minimumValue: props.attribute.Parameters.MinValue.noExponents(),
                    maximumValue: props.attribute.Parameters.MaxValue.noExponents(),
                    selectOnFocus: false,
                    onInvalidPaste: 'clamp',
                }}
            />
            {
                calculatorOpen &&
                <MuiCalculator
                    value={value}
                    open={calculatorOpen}
                    onClose={() => { setCalculatorOpen(false) }}
                    integer={true}
                    onChange={onChange}
                    minimumValue={Number(props.attribute.Parameters.MinValue.noExponents())}
                    maximumValue={Number(props.attribute.Parameters.MaxValue.noExponents())}
                />
            }
        </>
    )
}
export function BigIntNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [value, setValue] = useState<number | null>(props.value ? Number(props.value) : null)
    const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (newValue?: number | null) => {
        if (oldValue !== newValue) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ? Number(props.value) : null)
        setValue(props.value ? Number(props.value) : null)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (newValue: number | null) => {
        setValue(newValue)
        setDirty(newValue)
    }

    return (
        <>
            <NumericInput
                fullWidth
                placeholder={"BigInt"}
                value={value}
                onChange={onChange}
                variant='outlined'
                size='small'
                disabled={props.disabled}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            onClick={() => { !props.disabled && setCalculatorOpen(true) }}
                            sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                        >
                            <NumbersIcon />
                        </InputAdornment>
                    )
                }}
                numericOptions={{
                    decimalCharacter: '.',
                    decimalPlaces: 0,
                    decimalPlacesRawValue: 0,
                    digitGroupSeparator: ',',
                    modifyValueOnWheel: false,
                    readOnly: props.disabled,
                    minimumValue: props.attribute.Parameters.MinValue.noExponents(),
                    maximumValue: props.attribute.Parameters.MaxValue.noExponents(),
                    selectOnFocus: false,
                    onInvalidPaste: 'clamp',
                }}
            />
            {
                calculatorOpen &&
                <MuiCalculator
                    value={value}
                    open={calculatorOpen}
                    onClose={() => { setCalculatorOpen(false) }}
                    integer={true}
                    onChange={onChange}
                    minimumValue={Number(props.attribute.Parameters.MinValue.noExponents())}
                    maximumValue={Number(props.attribute.Parameters.MaxValue.noExponents())}
                />
            }
        </>
    )
}
export function BooleanNode(props: AttributeProps & { entityname: string }) {
    const [oldValue, setOldValue] = useState<boolean | null>(props.value);
    const [value, setValue] = useState<boolean | null>(props.value);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value);
    }, [value])

    const setDirty = (checked: boolean | null) => {
        if (oldValue !== checked) {
            props.manageDirty.set();
        }
        else {
            props.manageDirty.remove();
        }
    }

    useEffect(() => {
        setOldValue(props.value);
        setValue(props.value);
    }, [props.value]);

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue);
            props.manageDirty.remove();
        }
    }, [oldValue, props.manageDirty, props.reset]);

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: SelectChangeEvent<number>, checked: ReactNode) => {
        const result = event.target.value === 1 ? true : event.target.value === 0 ? false : null;
        setValue(result);
        setDirty(result);
    }

    const handleOnClick = () => {
        setOpen(prev => !prev);
    }

    const [stateOptions, isFetching] = RetrievePicklistValues(props.entityname, props.attribute.MStype, props.attribute.LogicalName) as [any, boolean];

    return (
        <FormControl fullWidth>
            <Select
                open={open}
                value={value === true ? 1 : value === false ? 0 : -1}
                onChange={onChange}
                onClick={handleOnClick}
                size={"small"}
                fullWidth
                disabled={props.disabled}
                startAdornment={(
                    <InputAdornment
                        position='start'
                        onClick={() => {
                            !props.disabled &&
                                setValue(old => {
                                    setDirty(!old)
                                    return !old
                                })
                        }}
                        sx={{ cursor: props.disabled ? 'auto' : 'pointer' }}
                    >
                        {value ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />}
                    </InputAdornment>
                )}
            >
                <MenuItem disabled={props.disabled} value={-1}>- - -</MenuItem>
                <MenuItem disabled={props.disabled} value={1}>{stateOptions[props.attribute.LogicalName]?.TrueOption.Label.UserLocalizedLabel.Label ?? "Yes"}</MenuItem>
                <MenuItem disabled={props.disabled} value={0}>{stateOptions[props.attribute.LogicalName]?.FalseOption.Label.UserLocalizedLabel.Label ?? "No"}</MenuItem>
            </Select>
        </FormControl>
    )
}
export function DateTimeNode(props: AttributeProps) {
    const [oldValue, setOldValue] = useState<Dayjs | null>(props.value ? dayjs(props.value) : null);
    const [value, setValue] = useState<Dayjs | null>(props.value ? dayjs(props.value) : null);

    useEffect(() => {
        if (!props.disabled) {
            if (!value || !value.isValid()) {
                props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, null);
            }
            else if (props.attribute.Parameters.Format === MSDateFormat.DateOnly) {
                props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value.format("YYYY-MM-DD") ?? null);
            }
            else {
                props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value.toISOString() ?? null);
            }
        }
    }, [value]);

    const setDirty = (date: Dayjs | null) => {
        if ((oldValue != null || date != null) && !oldValue?.isSame(date)) {
            props.manageDirty.set();
        }
        else {
            props.manageDirty.remove();
        }
    }

    const dateTimeFormat = useMemo(() => getCurrentDynamics365DateTimeFormat(), []);

    useEffect(() => {
        setOldValue(props.value ? dayjs(props.value) : null);
        setValue(props.value ? dayjs(props.value) : null);
    }, [props.value]);

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue);
            props.manageDirty.remove();
        }
    }, [oldValue, props.manageDirty, props.reset]);

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (date: Dayjs | null) => {
        setValue(date ? dayjs(date) : null);
        setDirty(date ? dayjs(date) : null);
    }

    return (<>
        {props.attribute.Parameters.Format === MSDateFormat.DateOnly ?
            <DatePicker
                value={value}
                onChange={onChange}
                format={dateTimeFormat.ShortDatePattern}
                slotProps={{
                    inputAdornment: {
                        position: 'start',
                    },
                    field: { clearable: true }
                }}
                sx={{
                    width: '100%',
                    '& input': {
                        padding: '8.5px 14px 8.5px 0px'
                    },
                    '& fieldset': {
                        borderWidth: !!value && !value.isValid() ? 'thick' : undefined,
                    }
                }}
                disabled={props.disabled}
            />
            :
            <DateTimePicker
                ampm={dateTimeFormat.is12hours}
                onChange={onChange}
                value={value}
                format={dateTimeFormat.ShortDateTimePattern}
                slotProps={{
                    inputAdornment: {
                        position: 'start',
                    },
                    field: { clearable: true }
                }}
                sx={{
                    width: '100%',
                    '& input': {
                        padding: '8.5px 14px 8.5px 0px'
                    },
                    '& fieldset': {
                        borderWidth: !!value && !value.isValid() ? 'thick' : undefined,
                    }
                }}
                disabled={props.disabled}
            />
        }
    </>)
}
export function PicklistNode(props: AttributeProps & { nullable?: boolean, entityname: string }) {
    const [oldValue, setOldValue] = useState<number>(props.value ?? -1);
    const [value, setValue] = useState<number>(props.value ?? -1);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value !== -1 ? value : null);
    }, [value])

    const setDirty = (newOption: typeof value) => {
        if (oldValue !== newOption) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ?? -1)
        setValue(props.value ?? -1)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: SelectChangeEvent<number>) => {
        const newValue = typeof event.target.value == 'string' ? -1 : event.target.value
        setValue(newValue)
        setDirty(newValue)
    }

    const handleOnClick = () => {
        setOpen(prev => !prev);
    }

    const [stateOptions, isFetching] = RetrievePicklistValues(props.entityname, props.attribute.MStype, props.attribute.LogicalName)

    return (
        <FormControl fullWidth>
            <Select
                open={open}
                value={value}
                onChange={onChange}
                size={"small"}
                fullWidth
                disabled={props.disabled}
                onClick={handleOnClick}
                startAdornment={
                    <InputAdornment position="start">
                        <ListIcon />
                    </InputAdornment>
                }
            >
                {props.nullable && <MenuItem disabled={props.disabled} value={-1}>- - -</MenuItem>}
                {
                    stateOptions[props.attribute.LogicalName]?.Options?.map((optionNode) => {
                        var option: Xrm.OptionSetValue = { text: optionNode.Label.UserLocalizedLabel!.Label, value: optionNode.Value };
                        return <MenuItem disabled={props.disabled} value={option.value}>{option.text} ({option.value})</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}
export function GroupedPicklistNode(props: AttributeProps & { nullable?: boolean, groupBy: string, entityname: string }) {
    const [oldValue, setOldValue] = useState<number>(props.value ?? -1);
    const [value, setValue] = useState<number>(props.value ?? -1);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value !== -1 ? value : null);
    }, [value])

    const setDirty = (newOption: typeof value) => {
        if (oldValue !== newOption) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(props.value ?? -1)
        setValue(props.value ?? -1)
    }, [props.value])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: SelectChangeEvent<number>) => {
        const newValue = typeof event.target.value == 'string' ? -1 : event.target.value
        setValue(newValue)
        setDirty(newValue)
    }

    const handleOnClick = () => {
        setOpen(prev => !prev);
    }

    const [statusCode, isFetchingStatus] = RetrievePicklistValues(props.entityname, props.attribute.MStype, props.attribute.LogicalName);
    const [stateCode, isFetchingState] = RetrievePicklistValues(props.entityname, MSType.State, 'statecode');

    return (
        <FormControl fullWidth>
            <Select
                open={open}
                value={value}
                onChange={onChange}
                size={"small"}
                fullWidth
                disabled={props.disabled}
                onClick={handleOnClick}
                startAdornment={
                    <InputAdornment position="start">
                        <ListIcon />
                    </InputAdornment>
                }
            >
                {props.nullable && <MenuItem disabled={props.disabled} value={-1}>- - -</MenuItem>}
                {
                    statusCode[props.attribute.LogicalName] && Object.entries(groupBy(statusCode[props.attribute.LogicalName]?.Options, props.groupBy))?.map(([group, value]) => {
                        const parentOption = stateCode['statecode']?.Options?.find(state => state.Value === Number(group));
                        return (
                            [
                                <ListSubheader>{parentOption?.Label.UserLocalizedLabel!.Label} ({parentOption?.Value})</ListSubheader>,
                                value.sort((a: PickListOption, b: PickListOption) => {
                                    return a.Label.UserLocalizedLabel!.Label?.localeCompare(b.Label.UserLocalizedLabel!.Label)
                                }).map((optionNode) => {
                                    var option: Xrm.OptionSetValue = { text: optionNode.Label.UserLocalizedLabel!.Label, value: optionNode.Value }
                                    return <MenuItem disabled={props.disabled} value={option.value}>{option.text} ({option.value})</MenuItem>
                                })
                            ]
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}
export function MultiplePicklistNode(props: AttributeProps & { entityname: string }) {
    const defaultValues = useMemo(() => {
        let values: string = props.value
        return values?.split(",").map<number>((v: string) => {
            return parseInt(v)
        }) ?? []
    }, [props.value])

    const [oldValue, setOldValue] = useState<number[]>(defaultValues);
    const [value, setValue] = useState<number[]>(defaultValues);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!props.disabled)
            props.attributeToUpdateManager.setAttributesValue(props.attribute.LogicalName, value.join(","));
    }, [value])

    const setDirty = (newOption: typeof value) => {
        if (!isArraysEquals(oldValue, newOption)) {
            props.manageDirty.set()
        }
        else {
            props.manageDirty.remove()
        }
    }

    useEffect(() => {
        setOldValue(defaultValues)
        setValue(defaultValues)
    }, [defaultValues])

    useEffect(() => {
        if (props.reset) {
            setValue(oldValue)
            props.manageDirty.remove()
        }
    }, [oldValue, props.manageDirty, props.reset])

    useEffect(() => {
        if (props.remove) {
            props.attributeToUpdateManager.removeAttributesValue(props.attribute.LogicalName);
        }
    }, [props.attributeToUpdateManager, props.remove]);

    const onChange = (event: SelectChangeEvent<any>) => {
        const newValue = typeof event.target.value == 'string' ? [] : event.target.value
        setValue(newValue)
        setDirty(newValue)
    }

    const handleOnClick = () => {
        setOpen(prev => !prev);
    }

    const [stateOptions, isFetching] = RetrievePicklistValues(props.entityname, props.attribute.MStype, props.attribute.LogicalName)

    return (
        <FormControl fullWidth>
            <Select
                open={open}
                multiple
                value={value}
                onChange={onChange}
                size={"small"}
                fullWidth
                disabled={props.disabled}
                onClick={handleOnClick}
                startAdornment={
                    <InputAdornment position="start">
                        <ListIcon />
                    </InputAdornment>
                }
            >
                {
                    stateOptions[props.attribute.LogicalName]?.Options?.map((optionNode) => {
                        var option: Xrm.OptionSetValue = { text: optionNode.Label.UserLocalizedLabel!.Label, value: optionNode.Value };
                        return <MenuItem disabled={props.disabled} value={option.value}>{option.text} ({option.value})</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}
export function ImageNode(props: AttributeProps) {
    return (<img alt='' />)
}