import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface DateProps {
  label: string;
  initial_date: string;
  handleChange: Function;
}

const DateInput = (props: DateProps) => {
  const { label, initial_date, handleChange } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={dayjs(initial_date)}
        onChange={(newValue: any) => {
          handleChange(new Date(newValue["$d"]).toLocaleDateString("en-US"));
        }}
        format="MM/DD/YYYY"
      />
    </LocalizationProvider>
  );
};

export default DateInput;
