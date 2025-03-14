import { Card, CardContent, Button, Typography } from "@mui/material";
export default function ButtonCard({ cardHeader, buttons }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{cardHeader}</Typography>
        {buttons.map((button, index) => (
          <Button variant="outlined" key={index} onClick={button.onClick}>
            {button.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
