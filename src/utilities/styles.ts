const box_style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", md: "50%" },
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  maxHeight: { xs: "75%" },
  overflowY: "scroll",
};

const textfield_style = {
  "& fieldset": { borderRadius: "10px" },
};

const button_style = {
  borderRadius: "20px",
  textTransform: "none",
  fontSize: "70%",
};

export { box_style, textfield_style, button_style };
