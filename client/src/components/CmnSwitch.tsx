import { Switch, SwitchProps } from "@mui/material";
import React, { useContext } from "react";
import { LoadingContext } from "../context/Loading";

export type TypeCmnSwitchProps = Omit<SwitchProps, 'onChange'> & {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
}
export const CmnSwitch: React.FC<TypeCmnSwitchProps> = (props) => {
    const { onChange, ...rest } = props;
    const loading = useContext(LoadingContext); // ローディング状態を管理

    const handleChange: SwitchProps['onChange'] = async (e, checked) => {
        e.preventDefault(); // デフォルトの動作を防ぐ
        if (onChange) {
            loading.setLoading(true);
            await onChange(e);
            loading.setLoading(false);
        }
    }

    return (
        <Switch
            onChange={handleChange}
            {...rest}
        />
    );
}