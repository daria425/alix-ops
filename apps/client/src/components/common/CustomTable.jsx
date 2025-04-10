import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useMemo } from "react";
export default function CustomTable({
  tableData,
  tableStyle = {},
  containerStyle = {},
  headerStyle = {},
  rowStyle = {},
  cellStyle = {},
  loading = false,
}) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { headers, rows } = tableData;
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const finalHeaders = useMemo(
    () => (isMobile ? headers.slice(0, 3) : headers),
    [isMobile, headers]
  );
  const finalRows = useMemo(
    () => (isMobile ? rows.map((row) => row.slice(0, 3)) : rows),
    [isMobile, rows]
  );
  const [visibleRows, setVisibleRows] = useState([]);
  useEffect(() => {
    const startRow = page * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    setVisibleRows(finalRows.slice(startRow, endRow));
  }, [page, finalRows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // const startRow = newPage * rowsPerPage;
    // const endRow = startRow + rowsPerPage;
    // setVisibleRows(finalRows.slice(startRow, endRow));
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
              <TableCell colSpan={finalHeaders.length} sx={cellStyle}>
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
              {finalHeaders.map((header, index) => (
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
