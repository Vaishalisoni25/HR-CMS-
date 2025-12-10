import React from "react";
import { Box, InputBase, IconButton, Paper } from "@mui/material";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <MagnifyingGlassIcon size={20} color="#64748b" />
      <InputBase
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{ ml: 1, flex: 1 }}
      />
      {value && (
        <IconButton onClick={() => onChange({ target: { value: "" } })}>
          ✕
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;
