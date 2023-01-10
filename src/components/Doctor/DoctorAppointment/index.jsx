import React, { useState, useEffect } from "react"
import axios from "axios"
import { getAuthData, getUserData } from "../../../Utils/Utilities/Utilities"
import { baseURL } from "../../../Utils/Api/Api"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableFooter from "@mui/material/TableFooter"
import TablePagination from "@mui/material/TablePagination"
import NotFound from "../../shared-components/NotFound"
import * as FileSaver from "file-saver"
import XLSX from "sheetjs-style"

const DoctorAppointmentList = () => {
  const [appointmentList, setAppontmentList] = useState([])

  const authToken=getAuthData().authToken;
  useEffect(() => {
    let doctor = getUserData()
   
 
    axios
      .get(baseURL + "showAcceptedAppointments", {params: { department:doctor.department,doctorId:doctor.userId },
       
      headers:{'Authorization': 'Bearer ' + authToken}})
      .then((response) => {
        let allpatientData = []

        if (response.data && response.data.length) {
          allpatientData = response.data
        }

        setAppontmentList(allpatientData)
        /* appointmentList = response.data;
        localStorage.setItem(
          "appointmentList",
          JSON.stringify(appointmentList)
        ); */
      })
      .catch(() => {})
  }, [])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - appointmentList.length)
      : 0

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"

  const fileExtension = ".xlsx"

  const Headings = [
    ["Patient Name", "Patient Age", "Disease", "Patient Mobile No", "Status"],
  ]

  const tableData = appointmentList.map((row) => ({
    patientname: row.patientName,
    patientAge: row.patientAge,
    disease: row.problem,
    mobileNumber: row.patientPhoneNo,
    status: row.status,
  }))

  const exportToCSV = async (fileName) => {
    const ws = XLSX.utils.json_to_sheet(tableData)
    XLSX.utils.sheet_add_aoa(ws, Headings, { originv: "A1" })
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, "DoctorAppointmentList" + fileExtension)
  }

  return (
    <>
      <div className='appointment_list mt-4 '>
        <div className='card mb-4 '>
          <div className='card-body  d-sm-block'>
            <div className='row '>
              <div className='col-md-12 '>
                <h4 className='pt-3 pb-1'>
                  <span style={{ color: " #EE6F1B" }}> Appointments </span>{" "}
                </h4>
              </div>
            </div>
            {appointmentList && appointmentList.length > 0 ? (
              <>
                <div className='d-flex justify-content-end'>
                  <button onClick={exportToCSV} className='btn btn-dark'>
                    Export
                  </button>
                </div>
                <div className='table-responsive'>
                  <Table
                    sx={{ minWidth: 500 }}
                    aria-label='custom pagination table'
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align='left'>Patient Name</TableCell>
                        <TableCell align='left'>Patient Age</TableCell>
                        <TableCell align='left'>Disease</TableCell>

                        <TableCell align='left'>Patient Mobile No</TableCell>
                        <TableCell align='left'>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? appointmentList.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : appointmentList
                      ).map((appointment) => (
                        <TableRow key={appointment.AppointmentId}>
                          <TableCell scope='row' align='left'>
                            {" "}
                            {appointment.patientName}{" "}
                          </TableCell>
                          <TableCell align='left'>
                            {appointment.patientAge}
                          </TableCell>
                          <TableCell align='left'>
                            {appointment.problem}
                          </TableCell>

                          <TableCell align='left'>
                            {appointment.patientPhoneNo}
                          </TableCell>
                          <TableCell align='left'>
                            <span
                              style={{
                                color: "green",
                                fontWeight: "bold",
                                border: "2px solid green",
                                padding: "3px",
                                borderRadius: "10px",
                              }}
                            >
                              {appointment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: "All", value: -1 },
                          ]}
                          count={appointmentList.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: {
                              "aria-label": "rows per page",
                            },
                            native: true,
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </>
            ) : (
              <NotFound />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorAppointmentList
