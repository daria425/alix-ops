import { Card, CardContent, Button } from "@mui/material";
import MainCardHeading from "./MainCardHeading";
export default function WidgetCard({ cardHeader, buttons }) {
  return (
    <Card>
      <CardContent>
        <MainCardHeading title={cardHeader} />
        {buttons.map((button, index) => (
          <Button variant="outlined" key={index} onClick={button.onClick}>
            {button.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
