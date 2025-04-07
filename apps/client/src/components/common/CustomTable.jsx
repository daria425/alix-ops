import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
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
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [visibleRows, setVisibleRows] = useState(rows.slice(0, rowsPerPage));
  const handleChangePage = () => {
    setPage(page + 1);
    const startRow = page * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    setVisibleRows(rows.slice(startRow, endRow));
  };
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
    <>
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
            {visibleRows.map((row, rowIndex) => (
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
      <TablePagination
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={-1}
      />
    </>
  );
}
