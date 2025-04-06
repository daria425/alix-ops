import { useWebSocket } from "../../hooks/useWebSocket";
import { useData } from "../../hooks/useData";
import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { LoadingState, ErrorState } from "../common/FetchStates";
import { red } from "@mui/material/colors";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
function getIcon(doc) {
  if (doc?.flowName) {
    return <AnnouncementIcon />;
  } else {
    if (doc.Direction === "outbound") {
      return <CallMadeIcon />;
    }
    return <CallReceivedIcon />;
  }
}

function StreamError({ error, refetch }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
        gap: 2,
        bgcolor: red[50],
      }}
    >
      <ErrorOutlineIcon
        sx={{
          color: red[500],
          fontSize: 25,
        }}
      />
      <Typography variant="h6">Error: {error?.status || null}</Typography>
      <Typography variant="body1">
        {error?.message || "An error occurred loading data"}
      </Typography>
      <Button variant="text" onClick={refetch} color="inherit">
        TRY AGAIN
      </Button>
    </Box>
  );
}
function WhatsAppStreamItem({ doc }) {
  const { description } = doc;
  return (
    <ListItem>
      <ListItemIcon>{getIcon(doc)}</ListItemIcon>
      <Typography variant="body2">{description}</Typography>
    </ListItem>
  );
}

export default function WhatsAppStream({ maxHeight }) {
  const {
    data: prevDbChangeData,
    loading,
    fetchError,
    refetch,
  } = useData("/monitoring/whatsapp/activity", "timeframe=7200");
  const { message: changeStreamMessage } = useWebSocket(
    "ws://127.0.0.1:8000/db-stream/ws"
  );

  const [combinedData, setCombinedData] = useState([]);
  useEffect(() => {
    if (prevDbChangeData) {
      setCombinedData(prevDbChangeData.documents || []);
    }
  }, [prevDbChangeData]);
  useEffect(() => {
    if (changeStreamMessage) {
      setCombinedData((prevData) => {
        const updatedData = [changeStreamMessage.document, ...prevData];
        return updatedData.sort((a, b) => {
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        });
      });
    }
  }, [changeStreamMessage]);

  return (
    <Card sx={{ height: maxHeight, flexGrow: 1 }}>
      <CardContent
        sx={{
          display: "grid",
          height: maxHeight,
          gridTemplateRows: "auto 1fr",
          boxSizing: "border-box",
        }}
      >
        <MainCardHeading title="WHATSAPP STREAM" />

        {loading ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState
            errorComponent={
              <StreamError error={fetchError} refetch={refetch} />
            }
          />
        ) : (
          <List sx={{ overflowY: "auto" }}>
            {combinedData.map((doc, index) => (
              <WhatsAppStreamItem key={index} doc={doc} />
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
