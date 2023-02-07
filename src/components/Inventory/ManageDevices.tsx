import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";
import AssignModal from "./AssignModal";
import ManageModal from "./ManageModal";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { InventorySummary } from "../../interfaces/inventory";

interface ManageDeviceProps {
  devices: InventorySummary[];
}

const ManageDevices = (props: ManageDeviceProps) => {
  const { devices } = props;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [device_names, setNames] = useState<string[]>([]);

  const handleClick = () => {};

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setNames([...devices.map((dev) => dev.name)]);
  }, [devices]);

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        sx={{ boxShadow: 0 }}
      >
        {selectedIndex === 0 && (
          <Button
            onClick={handleClick}
            sx={{ borderRadius: "10px 0px 0px 10px" }}
            disabled
          >
            Manage Devices
          </Button>
        )}
        {selectedIndex === 1 && (
          <AssignModal type="general" devices={devices} />
        )}
        {selectedIndex === 2 && (
          <ManageModal type="general" device_names={device_names} />
        )}
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="manage devices"
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{ borderRadius: "0px 10px 10px 0px" }}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    key="Manage Devices"
                    selected={0 === selectedIndex}
                    disabled
                    onClick={(event) => handleMenuItemClick(event, 0)}
                  >
                    Manage Devices
                  </MenuItem>
                  <MenuItem
                    key="Assign Device"
                    selected={1 === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, 1)}
                  >
                    Assign a Device
                  </MenuItem>
                  <MenuItem
                    key="Offboard Device"
                    selected={2 === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, 2)}
                  >
                    Offboard a Device
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default ManageDevices;
