import React, { useContext } from "react";
import { LoadingContext } from "../context/Loading";
import { Button, ButtonProps } from "@mui/material";

export type CmnButtonProps = Omit<ButtonProps, 'onClick'> & {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
};
export const CmnButton: React.FC<CmnButtonProps> = (props) => {
    const { onClick, ...rest } = props;
    const loading = useContext(LoadingContext); // ローディング状態を管理

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // デフォルトのクリック動作を防ぐ
        loading.setLoading(true); // ローディング状態をtrueにする
        if (onClick) {
            await onClick(e); // onClickが指定されている場合はそれを呼び出す
        }
        loading.setLoading(false); // ローディング状態をfalseにする
    };

    return (
        <Button
            onClick={handleClick}
            {...rest}
        >
            {props.children}
        </Button>
    );
}