import React from 'react';
import { Input, InputProps, FormLabel, Box } from '@mui/material';

interface CustomInputProps extends InputProps {
    label?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, ...props }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 2 }}>
            {label && <FormLabel>{label}</FormLabel>}
            <Input {...props} />
        </Box>
    );
};