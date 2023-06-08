import React, { useState } from "react";
import { Button, Modal, Box, Typography, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth0 } from "@auth0/auth0-react";
import { standardPost } from "../../services/standard";

interface DeleteProps {
  id: string;
  client: string;
  full_name: string;
}

const DeleteModal = (props: DeleteProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const deleteOrder = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const deleteObj = {
      ...props,
    };

    const deleteResp = await standardPost(
      accessToken,
      "deleteOrder",
      deleteObj
    );

    if (deleteResp.status === "Successful") {
      setLoading(false);
      setSuccess(true);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setSuccess(false);
  };
  return (
    <>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        sx={{
          borderRadius: "999em 999em 999em 999em",
          textTransform: "none",
        }}
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {!success && !error && (
            <>
              <Typography textAlign="center" sx={{ paddingBottom: "10px" }}>
                Are you sure you want to delete this order?
              </Typography>
              <Stack spacing={3} direction="row" justifyContent="center">
                <Button
                  sx={{
                    borderRadius: "999em 999em 999em 999em",
                    textTransform: "none",
                  }}
                  variant="contained"
                  onClick={deleteOrder}
                >
                  Yes
                </Button>
                <Button
                  sx={{
                    borderRadius: "999em 999em 999em 999em",
                    textTransform: "none",
                  }}
                  variant="contained"
                  onClick={() => setOpen(false)}
                >
                  No
                </Button>
              </Stack>
            </>
          )}
          {success && !error && (
            <Typography textAlign="center">Successfully Deleted!</Typography>
          )}
          {error && !success && (
            <Typography textAlign="center">Error in deleting</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DeleteModal;
