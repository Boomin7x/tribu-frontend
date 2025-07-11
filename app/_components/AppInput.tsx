/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "@mui/material";
import { JSX } from "react";

interface AppInputType {
  placeholder?: string | undefined;
  label?: string | undefined;
  type: string | undefined;
  id: string | undefined;
  hideBorders?: boolean;
  readonly?: boolean;
  style?: React.CSSProperties | undefined;
  value?: string | number | readonly string[] | undefined;
  onChange:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  maxLength?: number;
  minLength?: number;
  styles?: any | undefined;
  className?: string | undefined;
  multiline?: boolean;
  isPreview?: boolean;
  minRows?: number;
  startAdornment?: JSX.Element;
}
export const AppInput = ({ ...props }: AppInputType) => {
  return (
    <div className="flex flex-col">
      {props.label && props.label.length > 2 && (
        <label className="block text-sm/6 font-medium text-gray-900">
          {props.label}
        </label>
      )}
      <TextField
        type={props.type}
        fullWidth
        variant="outlined"
        size="small"
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => {
          if (props.onChange) props.onChange(e);
          // props.onChange && props.onChange(e);
        }}
        InputProps={{
          startAdornment: props.startAdornment,
          // maxLength: props.maxLength,
          // minLength: props.minLength,
          type: props.type,
          style: props.style,
        }}
        className={props.className}
        sx={
          props.hideBorders == false || props.hideBorders == undefined
            ? {
                "& .MuiFormLabel-root": {
                  fontSize: "0.875rem",
                },
                "& input::placeholder": {
                  fontSize: "0.875rem",
                },
              }
            : {
                border: "none",
                fontStyle: "italic",
                "& fieldset": { border: "none" },
                ":focus": {
                  border: "1px solid #FFFFFF",
                  "& fieldset": { border: "none" },
                },
                ":hover": {
                  border: "none",
                  "& fieldset": { border: "none" },
                },
              }
        }
      />
    </div>
  );
};

export default AppInput;
