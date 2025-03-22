import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function CustomTable({
  tableData,
  tableStyle = {},
  containerStyle = {},
  headerStyle = {},
  rowStyle = {},
  cellStyle = {},
  loading = false,
}) {
  const { headers, rows } = tableData;
  if (loading) {
    return (
      <TableContainer sx={containerStyle}>
        <Table sx={tableStyle}>
          <TableHead>
            <TableRow sx={headerStyle}>
              {headers.map((header, index) => (
                <TableCell key={index} sx={cellStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={rowStyle}>
              <TableCell colSpan={headers.length} sx={cellStyle}>
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return (
    <TableContainer sx={containerStyle}>
      <Table sx={tableStyle}>
        <TableHead>
          <TableRow sx={headerStyle}>
            {headers.map((header, index) => (
              <TableCell key={index} sx={cellStyle}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={rowStyle}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} sx={cellStyle}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
