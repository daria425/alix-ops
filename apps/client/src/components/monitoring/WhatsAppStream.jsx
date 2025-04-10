import { useWebSocket } from "../../hooks/useWebSocket";
import { websocket_url } from "../../config/api.config";
import { useData } from "../../hooks/useData";
import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { MainCardHeading } from "../common/CardContents";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const isMobile = useMediaQuery("(max-width:768px)");
  const getDescription = (isMobile) => {
    if (isMobile && description.length > 30) {
      return description.slice(0, 30) + "...";
    }
    return description;
  };
  return (
    <ListItem>
      <ListItemIcon>{getIcon(doc)}</ListItemIcon>
      <Typography variant="body2">{getDescription(isMobile)}</Typography>
    </ListItem>
  );
}

function WhatsAppStreamContent({ combinedData }) {
  if (combinedData.length === 0) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="body2">No activity in the last 2 hours</Typography>
      </Box>
    );
  } else {
    return (
      <List sx={{ overflowY: "auto", flexGrow: 1 }}>
        {combinedData.map((doc, index) => (
          <WhatsAppStreamItem key={index} doc={doc} />
        ))}
      </List>
    );
  }
}

export default function WhatsAppStream({ maxHeight }) {
  const {
    data: prevDbChangeData,
    loading,
    fetchError,
    refetch,
  } = useData("/monitoring/whatsapp/activity", "timeframe=7200");
  const { message: changeStreamMessage } = useWebSocket(websocket_url);

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
  console.log(combinedData);
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
          <WhatsAppStreamContent combinedData={combinedData} />
        )}
      </CardContent>
    </Card>
  );
}
