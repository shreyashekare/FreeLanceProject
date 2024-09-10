import React, { useEffect, useMemo, useState } from 'react'
import './Reports.css'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { USER_API_ENDPOINT } from 'src/constants'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

import abc from 'src/assets/images/eureka-logo.png'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [allSearchQuery, setAllSearchQuery] = useState('')
  const [searchFields, setSearchFields] = useState([])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [lastSelectedFilter, setLastSelectedFilter] = useState('') // Track the last selected filter
  const [projectNames, setProjectNames] = useState([])
  const [employeeDesignations, setDesignations] = useState([])

  const [ActivityNames, setActivityNames] = useState([])
  const [employeeNames, setEmployeeNames] = useState([])

  const [filteredReportsX, setFilteredReports] = useState([])

  const reportsPerPage = 10

  let userID
  let userDesignation
  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  userID = ParsedData.id
  userDesignation = ParsedData.designation_id

  useEffect(() => {
    const fetchData = async () => {
      if (userDesignation == 1) {
        try {
          const response = await axios.get(`${USER_API_ENDPOINT}getEmployeeReports`)
          setReports(response.data.data.reverse())
          setFilteredReports(response.data.data.reverse())

          // Extract unique employee names
          const EmployeeName = await axios.get(`${USER_API_ENDPOINT}getEmployeeNames`)
          const uniqueEmployeeNames = Array.from(
            new Set(EmployeeName.data.data.map((empName) => empName.name)),
          )
          setEmployeeNames(uniqueEmployeeNames)
          console.log(uniqueEmployeeNames)

          // Extract unique project names
          const ProjectName = await axios.get(`${USER_API_ENDPOINT}getProjectNames`)
          const uniqueProjectNames = Array.from(
            new Set(ProjectName.data.data.map((empName) => empName.name)),
          )
          setProjectNames(uniqueProjectNames)
          console.log(uniqueProjectNames)

          // Extract unique activity names
          const ActivityNames = await axios.get(`${USER_API_ENDPOINT}getActivityNames`)
          const uniqueActivityNames = Array.from(
            new Set(ActivityNames.data.data.map((empName) => empName.name)),
          )
          setActivityNames(uniqueActivityNames)
          console.log(uniqueActivityNames)

          const Designations = await axios.get(`${USER_API_ENDPOINT}getAllDesignations`)
          const uniqueDesignations = Array.from(
            new Set(Designations.data.data.map((desName) => desName.Designation)),
          )
          setDesignations(uniqueDesignations)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      } else {
        try {
          const response = await axios.get(`${USER_API_ENDPOINT}getEmployeeReports/${userID}`)
          const data = response.data.data

          // Use a Map to filter out duplicate project IDs
          const uniqueProjectsMap = new Map()
          data.forEach((report) => {
            const project = report.projectActivity.projectPlanning
            if (!uniqueProjectsMap.has(project.id)) {
              uniqueProjectsMap.set(project.id, project.project_name)
            }
          })

          const uniqueProjects = Array.from(uniqueProjectsMap.entries()).map(([id, name]) => ({
            id,
            name,
          }))

          setReports(data.reverse())
          setFilteredReports(response.data.data.reverse())
          setProjectNames(uniqueProjects.map((project) => project.name))
          // eslint-disable-next-line no-undef
          setProjectID(uniqueProjects.map((project) => project.id))

          const EmployeeName = await axios.get(`${USER_API_ENDPOINT}getEmployeeNames`)
          const uniqueEmployeeNames = Array.from(
            new Set(EmployeeName.data.data.map((empName) => empName.name)),
          )
          setEmployeeNames(uniqueEmployeeNames)
          console.log(uniqueEmployeeNames)

          // Extract unique project names
          const ProjectName = await axios.get(`${USER_API_ENDPOINT}getProjectNames`)
          const uniqueProjectNames = Array.from(
            new Set(ProjectName.data.data.map((empName) => empName.name)),
          )
          setProjectNames(uniqueProjectNames)
          console.log(uniqueProjectNames)

          // Extract unique activity names
          const ActivityNames = await axios.get(`${USER_API_ENDPOINT}getActivityNames`)
          const uniqueActivityNames = Array.from(
            new Set(ActivityNames.data.data.map((empName) => empName.name)),
          )
          setActivityNames(uniqueActivityNames)
          console.log(uniqueActivityNames)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()
  }, [])

  const handleAllSearchChange = (event) => {
    setAllSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }

  const handleFieldChange = (index, event) => {
    const values = [...searchFields]
    values[index][event.target.name] = event.target.value
    setSearchFields(values)
    setCurrentPage(1) // Reset to the first page on search
  }

  const addSearchField = (field) => {
    if (field) {
      setSearchFields([...searchFields, { field, query: '' }])
    }
  }
  const searchProject = (projectName) => {
    setLastSelectedFilter(projectName)
    if (projectName === '') {
      // Show all reports if no project is selected
      setFilteredReports(reports)
    } else {
      // Filter reports by selected project name
      const filtered = reports.filter(
        (report) => report.projectActivity.projectPlanning.project_name === projectName,
      )
      setFilteredReports(filtered)
    }
  }
  const removeSearchField = (index) => {
    const updatedFields = [...searchFields]
    updatedFields.splice(index, 1)
    setSearchFields(updatedFields)
    if (updatedFields.length > 0) {
      setLastSelectedFilter(updatedFields[updatedFields.length - 1].field) // Set to the last remaining filter
    } else {
      setLastSelectedFilter('') // Reset to empty if no filters left
    }
    setCurrentPage(1) // Reset to the first page on removing filter
  }

  const handleDateChange = (event) => {
    const { name, value } = event.target
    setDateRange({ ...dateRange, [name]: value })
    setCurrentPage(1) // Reset to the first page on date change
  }

  const isWithinDateRange = (date, fromDate, toDate) => {
    const dateObj = new Date(date)
    const fromDateObj = new Date(fromDate)
    const toDateObj = new Date(toDate)

    if (fromDate && toDate) {
      return dateObj >= fromDateObj && dateObj <= toDateObj
    }
    if (fromDate) {
      return dateObj >= fromDateObj
    }
    if (toDate) {
      return dateObj <= toDateObj
    }
    return true
  }

  // Filter reports based on search and date range
  const filteredReports = filteredReportsX.filter((report) => {
    const name = `${report.employeeName.firstName} ${report.employeeName.lastName}`.toLowerCase()
    const fullName =
      `${report.employeeName.firstName} ${report.employeeName.midName} ${report.employeeName.lastName}`.toLowerCase()
    const activityName = report.projectActivity.project_modules_activities.toLowerCase()
    const status = report.Status.toLowerCase()
    const projectName = report.projectActivity.projectPlanning.project_name.toLowerCase()
    const role = report.Activity_Type.toLowerCase()
    const reportDate = new Date(report.projectActivity.projectPlanning.createdAt)
    const designation = report.employeeName.employeeDesignation.designation.toLowerCase()

    const matchesAllSearch =
      name.includes(allSearchQuery.toLowerCase()) ||
      fullName.includes(allSearchQuery.toLowerCase()) ||
      activityName.includes(allSearchQuery.toLowerCase()) ||
      report.Activity_Type.toLowerCase().includes(allSearchQuery.toLowerCase()) ||
      status.includes(allSearchQuery.toLowerCase()) ||
      projectName.includes(allSearchQuery.toLowerCase()) ||
      designation.includes(allSearchQuery.toLowerCase())

    const matchesSpecificFields = searchFields.every(({ field, query }) => {
      switch (field) {
        case 'Name':
          return name.includes(query.toLowerCase()) || fullName.includes(query.toLowerCase())
        case 'Project':
          return projectName.includes(query.toLowerCase())
        case 'Activity':
          return activityName.includes(query.toLowerCase())
        case 'Role':
          return role.includes(query.toLowerCase())
        case 'Status':
          return status.includes(query.toLowerCase())
        case 'Date':
          return isWithinDateRange(reportDate, dateRange.from, dateRange.to)
        case 'Designation':
          return designation.includes(query.toLowerCase())
        default:
          return true
      }
    })

    return matchesAllSearch && matchesSpecificFields
  })

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const totalHoursForFilteredReports = filteredReports.reduce(
    (total, report) => total + parseFloat(report.Time_spent || 0),
    0,
  )

  const uniqueActivityIds = new Set() // Set to track unique activity_IDs

  const totalHoursForAllReports = filteredReports.reduce((total, report) => {
    // Convert Allotted_Time to a number using parseFloat or parseInt
    const allottedTime = parseFloat(report.Allotted_Time) // or parseInt(report.Allotted_Time, 10) for integers

    if (!isNaN(allottedTime) && !uniqueActivityIds.has(report.activity_ID)) {
      uniqueActivityIds.add(report.activity_ID) // Add activity_ID to Set
      return total + allottedTime // Add Allotted_Time to total as a number
    }
    return total // If activity_ID is already processed or Allotted_Time is NaN, return current total
  }, 0)

  const totalTimeSpentByDevelopers = filteredReports.reduce((total, report) => {
    if (report.employeeName.designation_id === 3 && report.Activity_Type !== 'Bug/issue Resolved') {
      const Time_spent = parseFloat(report.Time_spent)
      if (!isNaN(Time_spent)) {
        return total + Time_spent
      }
    }
    return total // Ensure the total is returned for each iteration
  }, 0)

  const totalTimeSpentForDebugging = filteredReports.reduce((total, report) => {
    if (report.employeeName.designation_id === 3 && report.Activity_Type === 'Bug/issue Resolved') {
      const Time_spent = parseFloat(report.Time_spent)
      if (!isNaN(Time_spent)) {
        return total + Time_spent
      }
    }
    return total // Ensure the total is returned for each iteration
  }, 0)

  const totalTimeSpentForTesters = filteredReports.reduce((total, report) => {
    if (report.employeeName.designation_id === 2 && report.Activity_Type === 'Testing') {
      const timeSpent = parseFloat(report.Time_spent)
      if (!isNaN(timeSpent)) {
        return total + timeSpent
      }
    }
    return total
  }, 0)

  console.log('Total Hours for Unique Activity IDs:', totalHoursForFilteredReports)

  // Function to generate an array of page numbers with ellipses
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 2 // Maximum visible page buttons
    const totalVisiblePages = Math.min(maxVisiblePages, totalPages)

    let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1)

    // Adjust startPage when nearing the end
    if (endPage === totalPages && totalPages > maxVisiblePages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    // Add ellipsis and first page
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis and last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const getActivities = (id) => {
    alert(id)
  }
  const Status = ['Pending', 'In Progress', 'Completed', 'Closed', 'In Review', 'Issue/Bug Found']
  const Role = ['Full Stack Developement', 'Backend Developement', 'Design', 'Testing']

  const getOptions = (field) => {
    switch (field) {
      case 'Name':
        return employeeNames.map((empName) => ({
          fullName: empName,
          nameWithoutDesignation: empName.split(' (')[0], // Extract name without designation
        }))

      case 'Project':
        return projectNames
      case 'Activity':
        return ActivityNames
      case 'Status':
        return Status
      case 'Role':
        return Role
      case 'Designation':
        return employeeDesignations
      default:
        return ['No record to display']
    }
  }

  const handleEllipsisClick = (type) => {
    if (type === 'left') {
      setCurrentPage(currentPage - 3)
    } else if (type === 'right') {
      setCurrentPage(currentPage + 3)
    }
  }

  const handleExportClick2 = () => {
    if (window.confirm('Are you sure you want to export the data to PDF?')) {
      exportToPdf(filteredReports)
    }
  }

  const exportToPdf = (data) => {
    const doc = new jsPDF()
    let pageCount = 0

    const header = () => {
      const imgData = abc

      const width = doc.internal.pageSize.getWidth()
      const imgWidth = 50 // specify the width you want for the image
      const imgHeight = 20 // specify the height you want for the image
      const x = (width - imgWidth) / 2 // center the image horizontally
      const y = 10 // specify the y position

      doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
    }

    // Footer with centered page number
    const footer = (pageNumber) => {
      doc.setFontSize(10)
      doc.text(
        `Page ${pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' },
      )
    }

    // Function to add custom HTML content
    const addCustomContent = (doc, startY) => {
      doc.setFontSize(14)
      doc.text('Shreyash Ekare', 14, startY)
      doc.text('This is enable it report generating service', 14, startY + 10)
      doc.setFontSize(16)
      doc.text('This is new data', 14, startY + 20)

      // Table Data
      const tableData = [
        ['Appendix III: Raw Data Work Sheet Form', 'Document No.: EKA-MSP-16-RWS'],
        ['', 'Page No.: 1 of 2'],
      ]

      // Table
      doc.autoTable({
        startY: 30,
        head: [
          [
            {
              content: 'Appendix III: Raw Data Work Sheet Form',
              styles: { fontStyle: 'bold' },
            },
            {
              content: 'Document No.: EKA-MSP-16-RWS',
              styles: { fontStyle: 'normal' },
            },
          ],
        ],
        body: tableData.slice(1),
        theme: 'plain', // Simple table with white background
        styles: {
          fillColor: [255, 255, 255], // White background for cells
          textColor: [0, 0, 0], // Black text color
          lineColor: [0, 0, 0], // Black border color
          lineWidth: 0.1, // Border width
          fontStyle: 'normal', // Default font style for body text
        },
        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0], // Black text color
        },
      })

      const customTableHeaders2 = ['Cell 1', 'Cell 2', 'Cell 3']
      const customTableRows2 = [
        [
          { content: 'Name: Shreyash', styles: { fontStyle: 'bold' } },
          { content: 'Age:23', styles: { fontStyle: 'bold' } },
          { content: 'City:Nagpur', styles: { fontStyle: 'bold' } },
        ],
      ]

      doc.autoTable({
        head: [customTableHeaders2],
        body: customTableRows2,
        startY: doc.lastAutoTable.finalY + 10,
        theme: 'grid',
        margin: { top: 10 },
      })

      return doc.lastAutoTable.finalY + 10
    }

    // Add initial custom content
    let currentY = addCustomContent(doc, 40) // Adjusted startY to accommodate header image

    const headers = [
      'Sr. No.',
      'Name',
      'Project Name',
      'Designation',
      'Date',
      'Activity',
      'Role',
      'Time Spent',
      'Allotted Time',
      'Status',
    ]

    const rows = data.map((report, index) => [
      index + 1,
      `${report.employeeName.firstName} ${report.employeeName.midName} ${report.employeeName.lastName}`,
      report.projectActivity.projectPlanning.project_name,
      report.employeeName.employeeDesignation.designation,
      new Date(report.projectActivity.projectPlanning.createdAt).toLocaleDateString(),
      report.projectActivity.project_modules_activities,
      report.Activity_Type,
      report.Time_spent,
      report.Allotted_Time,
      report.Status,
    ])

    // Determine the indices where the custom content will be inserted
    const insertIndices = [2, 5, 8] // Adjust these indices as needed

    rows.forEach((row, index) => {
      doc.autoTable({
        head: [headers],
        body: [row],
        startY: currentY,
        margin: { top: 40, bottom: 20 }, // Adjusted top margin to accommodate header image
        didDrawPage: function (data) {
          // Draw header
          header()
          // Draw footer
          const pageNumber = doc.internal.getCurrentPageInfo().pageNumber
          footer(pageNumber)
        },
        willDrawCell: function (data) {
          // Adjust the position of the content to avoid overlapping with header and footer
          if (data.section === 'body' && data.row.index === 0 && data.row.raw === row) {
            currentY =
              data.row.raw === row && data.row.y >= doc.internal.pageSize.getHeight() - 20
                ? data.row.y + 10
                : data.row.y
          }
        },
      })

      currentY = doc.lastAutoTable.finalY + 10

      // Insert custom content at specified indices
      if (insertIndices.includes(index + 1)) {
        currentY = addCustomContent(doc, currentY)
      }
    })

    // Calculate total pages
    pageCount = doc.internal.getNumberOfPages()

    // Re-render the pages to correct the footer page numbers
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      header()
      footer(i)
    }

    doc.save('Reports.pdf')
  }

  const handleExportClick = () => {
    if (window.confirm('Are you sure you want to export the data to Excel?')) {
      exportToExcel(filteredReports)
    }
  }

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((report, index) => ({
        'Sr. No.': index + 1,
        'Project Name': report.projectActivity.projectPlanning.project_name,
        'Activity Name': report.projectActivity.project_modules_activities,
        'Activity Type': report.Activity_Type,
        'Employee Name': `${report.employeeName.firstName} ${report.employeeName.midName} ${report.employeeName.lastName}`,
        Designation: report.employeeName.employeeDesignation.designation,
        Date: new Date(report.projectActivity.projectPlanning.createdAt).toLocaleDateString(),
        Allotted_Time: report.Allotted_Time,
        'Time Spent By Developer':
          report.employeeName.employeeDesignation.designation === 'Tester' ||
          report.Activity_Type === 'Bug/issue Resolved'
            ? 'NA'
            : report.Time_spent,
        'Time Spent For Testing':
          report.employeeName.employeeDesignation.designation === 'Software Developer'
            ? 'NA'
            : report.Time_spent,
        'Time Spent For Debugging':
          report.employeeName.employeeDesignation.designation === 'Software Developer' &&
          report.Activity_Type === 'Bug/issue Resolved'
            ? report.Time_spent
            : 'NA',
        Status: report.Status,
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports')
    XLSX.writeFile(workbook, 'Reports.xlsx')
  }

  const groupByProjectAndActivity = (reports) => {
    return reports.reduce((acc, report) => {
      const projectName = report.projectActivity.projectPlanning.project_name
      const activity = report.projectActivity.project_modules_activities

      if (!acc[projectName]) {
        acc[projectName] = {}
      }
      if (!acc[projectName][activity]) {
        acc[projectName][activity] = []
      }
      acc[projectName][activity].push(report)
      return acc
    }, {})
  }

  // eslint-disable-next-line react/prop-types

  let serial = 1
  // eslint-disable-next-line react/prop-types
  const DataTable = ({ userDesignation }) => {
    const groupedReports = groupByProjectAndActivity(currentReports)

    return (
      <div className="time-log-report">
        <div className="excelDiv">
          <h1 className="heading1">Time Log Reports</h1>
          <button onClick={handleExportClick}>Export Data to Excel Sheet</button>
          {/* <button onClick={handleExportClick2}>Export to PDF</button> */}
        </div>
        <div className="timeDetails">
          <b className="newBold">
            <p
              style={{
                backgroundColor: '#caffcb',
                padding: '10px',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              Fixed Total Hours: {totalHoursForAllReports}
            </p>
            <p
              style={{
                backgroundColor: '#caffcb',
                padding: '10px',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              Total Hours Spent For Developing: {totalTimeSpentByDevelopers}
            </p>
            <p
              style={{
                backgroundColor: '#caffcb',
                padding: '10px',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              Total Hours Spent for Testing: {totalTimeSpentForTesters}
            </p>
            <p
              style={{
                backgroundColor: '#caffcb',
                padding: '10px',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
              }}
            >
              Total Time Spent for Bug Solving: {totalTimeSpentForDebugging}
            </p>
          </b>
        </div>

        <header className="header1">
          <div className="filter-container">
            <div className="blocks">
              <div>
                <div className="filter">
                  <input
                    type="text"
                    value={allSearchQuery}
                    onChange={handleAllSearchChange}
                    placeholder="Search all fields..."
                  />
                </div>
                {searchFields.map((field, index) => (
                  <div key={index} className="filter">
                    {field.field === 'Date' ? (
                      <div className="date-filter">
                        <input
                          type="date"
                          name="from"
                          value={dateRange.from}
                          onChange={handleDateChange}
                          placeholder="From Date"
                        />
                        <input
                          type="date"
                          name="to"
                          value={dateRange.to}
                          onChange={handleDateChange}
                          placeholder="To Date"
                        />
                        <button
                          className="close-btn"
                          type="button"
                          onClick={() => removeSearchField(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="query"
                          value={field.query}
                          onChange={(event) => handleFieldChange(index, event)}
                          placeholder={`Search by ${field.field}...`}
                        />
                        <div className="filter3">
                          <select
                            name="query"
                            value={field.query}
                            onChange={(event) => handleFieldChange(index, event)}
                            style={{
                              height: '40px',
                              padding: '5px',
                              width: '35vw',
                            }}
                          >
                            <option>Select a {`${field.field}`}</option>
                            {getOptions(field.field, field.query).map((option, i) =>
                              field.field === 'Name' ? (
                                <option key={i} value={option.nameWithoutDesignation}>
                                  {option.fullName}
                                </option>
                              ) : (
                                <option key={i} value={option}>
                                  {option}
                                </option>
                              ),
                            )}
                          </select>
                          <button
                            className="close-btn"
                            type="button"
                            onClick={() => removeSearchField(index)}
                          >
                            &times;
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginLeft: '20px', height: '40px' }} className="filter">
                <select
                  style={{ height: '40px', padding: '5px', width: '35vw' }}
                  value={lastSelectedFilter} // Set the value to the last selected filter
                  onChange={(e) => addSearchField(e.target.value)}
                >
                  <option value="">Add Filter</option>
                  <option value="Name">Name</option>
                  <option value="Project">Project Name</option>
                  <option value="Activity">Activity</option>
                  <option value="Role">Role</option>
                  <option value="Status">Status</option>
                  <option value="Date">Date</option>
                  <option value="Designation">Designation</option>
                </select>
              </div>
            </div>
          </div>
        </header>
        <table className="data-table">
          <thead>
            <tr>
              <th>SR. No.</th>
              <th>Project Name</th>
              <th>Activity</th>
              <th>Activity Type</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Date</th>
              {userDesignation === 2 ? '' : <th>Allotted Time</th>}
              <th>Time Spent By Developer</th>
              <th>Time Spent For Testing</th>
              <th>Time Spent For Bug Solving</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length === 0 ? (
              <tr>
                <td colSpan={userDesignation === 2 ? 9 : 10} style={{ textAlign: 'center' }}>
                  No records available
                </td>
              </tr>
            ) : (
              Object.keys(groupedReports).map((projectName, projectIndex) => {
                const projectActivities = groupedReports[projectName]

                return Object.keys(projectActivities).map((activity, activityIndex) => {
                  const activityReports = projectActivities[activity]

                  return activityReports.map((report, rowIndex) => (
                    <tr key={`${projectIndex}-${activityIndex}-${rowIndex}`}>
                      {rowIndex === 0 && (
                        <>
                          <td rowSpan={activityReports.length}>{serial++}</td>
                          <td rowSpan={activityReports.length}>{projectName}</td>
                          <td rowSpan={activityReports.length}>{activity}</td>
                        </>
                      )}

                      {rowIndex > 0 && (
                        <>
                          <td rowSpan="1"></td>
                          <td></td>
                          <td></td>
                        </>
                      )}
                      <td>{report.Activity_Type}</td>
                      <td>{`${report.employeeName.firstName} ${report.employeeName.midName} ${report.employeeName.lastName}`}</td>
                      <td>{report.employeeName.employeeDesignation.designation}</td>
                      <td>
                        {new Date(
                          report.projectActivity.projectPlanning.createdAt,
                        ).toLocaleDateString()}
                      </td>
                      {userDesignation !== 2 && (
                        <td>{report.Allotted_Time ? report.Allotted_Time : 'NA'}</td>
                      )}
                      <td>
                        {report.employeeName.employeeDesignation.designation === 'Tester' ||
                        report.Activity_Type === 'Bug/issue Resolved'
                          ? 'NA'
                          : report.Time_spent}
                      </td>
                      <td>
                        {report.employeeName.employeeDesignation.designation ===
                        'Software Developer'
                          ? 'NA'
                          : report.Time_spent}
                      </td>
                      <td>
                        {report.employeeName.employeeDesignation.designation ===
                          'Software Developer' && report.Activity_Type === 'Bug/issue Resolved'
                          ? report.Time_spent
                          : 'NA'}
                      </td>
                      <td>
                        <span
                          style={{
                            backgroundColor:
                              report.Status === 'Completed'
                                ? 'rgb(3, 253, 3)'
                                : report.Status === 'Started'
                                ? 'aqua'
                                : report.Status === 'Closed'
                                ? 'rgb(206, 199, 199)'
                                : report.Status === 'In Review'
                                ? 'Orange'
                                : report.Status === 'Issue/Bug Found'
                                ? '#d6266c'
                                : report.Status === 'In Progress'
                                ? 'rgb(255, 255, 159)'
                                : 'rgb(249, 60, 60)',
                            padding: '2px 4px',
                            borderRadius: '7px',
                            display: 'inline-block',
                            width: '100px',
                            textAlign: 'center',
                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                            fontWeight: 'bold',
                          }}
                          className={`status ${
                            report.Status === ''
                              ? 'Not Started Yet'
                              : report.Status === 'In Progress'
                              ? 'inProgress'
                              : report.Status === 'Completed'
                              ? 'completed'
                              : report.Status === 'Issue/Bug Found'
                              ? 'issueFound'
                              : report.Status === 'In Review'
                              ? 'inReview'
                              : ''
                          }`}
                        >
                          {report.Status === 'Completed'
                            ? 'Assigned For Testing'
                            : report.Status || ' Not Started Yet '}
                        </span>
                      </td>
                    </tr>
                  ))
                })
              })
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            className="page-button arrow-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {generatePageNumbers().map((pageNumber, index) =>
            typeof pageNumber === 'number' ? (
              <button
                key={index}
                className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ) : (
              <button
                key={index}
                className="page-button ellipsis-button"
                onClick={() =>
                  handleEllipsisClick(
                    pageNumber === '...' && index < generatePageNumbers().length / 2
                      ? 'left'
                      : 'right',
                  )
                }
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            className="page-button arrow-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            &gt;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <DataTable />
    </div>
  )

  // return (

  //   <div className="time-log-report">
  //     <div className="excelDiv">
  //       <h1 className="heading1">Time Log Reports</h1>
  //       <button onClick={handleExportClick}>Export Data to Excel Sheet</button>
  //       {/* <button onClick={handleExportClick2}>Export to PDF</button> */}
  //     </div>
  //     <div className="timeDetails">
  //       <b className="newBold">
  //         {hasFilters && <p>Fixed Total Hours: {totalHoursForAllReports}</p>}
  //         <p>Total Hours Spent: {totalHoursForFilteredReports}</p>
  //       </b>
  //     </div>

  //     <header className="header1">
  //       <div className="filter-container">
  //         <div className="blocks">
  //           <div>
  //             <div className="filter">
  //               <input
  //                 type="text"
  //                 value={allSearchQuery}
  //                 onChange={handleAllSearchChange}
  //                 placeholder="Search all fields..."
  //               />
  //             </div>
  //             {searchFields.map((field, index) => (
  //               <div key={index} className="filter">
  //                 {field.field === 'Date' ? (
  //                   <div className="date-filter">
  //                     <input
  //                       type="date"
  //                       name="from"
  //                       value={dateRange.from}
  //                       onChange={handleDateChange}
  //                       placeholder="From Date"
  //                     />
  //                     <input
  //                       type="date"
  //                       name="to"
  //                       value={dateRange.to}
  //                       onChange={handleDateChange}
  //                       placeholder="To Date"
  //                     />
  //                     <button
  //                       className="close-btn"
  //                       type="button"
  //                       onClick={() => removeSearchField(index)}
  //                     >
  //                       &times;
  //                     </button>
  //                   </div>
  //                 ) : (
  //                   <>
  //                     <input
  //                       type="text"
  //                       name="query"
  //                       value={field.query}
  //                       onChange={(event) => handleFieldChange(index, event)}
  //                       placeholder={`Search by ${field.field}...`}
  //                     />
  //                     <div className="filter3">
  //                       <select
  //                         name="query"
  //                         value={field.query}
  //                         onChange={(event) => handleFieldChange(index, event)}
  //                         style={{ height: '40px', padding: '5px', width: '35vw' }}
  //                       >
  //                         <option>Select a {`${field.field}`}</option>
  //                         {getOptions(field.field, field.query).map((option, i) =>
  //                           field.field === 'Name' ? (
  //                             <option key={i} value={option.nameWithoutDesignation}>
  //                               {option.fullName}
  //                             </option>
  //                           ) : (
  //                             <option key={i} value={option}>
  //                               {option}
  //                             </option>
  //                           ),
  //                         )}
  //                       </select>
  //                       <button
  //                         className="close-btn"
  //                         type="button"
  //                         onClick={() => removeSearchField(index)}
  //                       >
  //                         &times;
  //                       </button>
  //                     </div>
  //                   </>
  //                 )}
  //               </div>
  //             ))}
  //           </div>
  //           <div style={{ marginLeft: '20px', height: '40px' }} className="filter">
  //             <select
  //               style={{ height: '40px', padding: '5px', width: '35vw' }}
  //               value={lastSelectedFilter} // Set the value to the last selected filter
  //               onChange={(e) => addSearchField(e.target.value)}
  //             >
  //               <option value="">Add Filter</option>
  //               <option value="Name">Name</option>
  //               <option value="Project">Project Name</option>
  //               <option value="Activity">Activity</option>
  //               <option value="Role">Role</option>
  //               <option value="Status">Status</option>
  //               <option value="Date">Date</option>
  //               <option value="Designation">Designation</option>
  //             </select>
  //           </div>
  //         </div>
  //       </div>
  //     </header>
  //     <table className="data-table">
  //       <thead>
  //         <tr>
  //           <th>SR. No.</th>
  //           <th>Project&nbsp;Name</th>
  //           <th>Activity</th>
  //           <th>Activity Type</th>
  //           <th>Employee&nbsp;Name</th>
  //           <th>Designation</th>
  //           <th>Date</th>

  //           {userDesignation == 2 ? '' : <th>Allotted Time</th>}
  //           <th>Time Spent</th>
  //           <th>Status</th>

  //         </tr>
  //       </thead>
  //       <tbody>
  //         {currentReports.length === 0 ? (
  //           <tr>
  //             <td colSpan="7" style={{ textAlign: 'center' }}>
  //               No records available
  //             </td>
  //           </tr>
  //         ) : (
  //           currentReports.map((report, index) => (
  //             <tr key={index}>
  //               <td>{indexOfFirstReport + index + 1}</td>
  //               <td>{report.projectActivity.projectPlanning.project_name}</td>
  //               <td>{report.projectActivity.project_modules_activities}</td>
  //               <td>{report.Activity_Type}</td>
  //               <td>{`${report.employeeName.firstName} ${report.employeeName.midName} ${report.employeeName.lastName}`}</td>
  //               <td>{report.employeeName.employeeDesignation.designation}</td>
  //               <td>
  //                 {new Date(report.projectActivity.projectPlanning.createdAt).toLocaleDateString()}
  //               </td>
  //               <td>{report.Allotted_Time ? report.Allotted_Time : 'NA'}</td>
  //               <td>{report.Time_spent ? report.Time_spent : 'NA'}</td>
  //               <td>
  //                 <span
  //                   style={{
  //                     backgroundColor:
  //                       report.Status === 'Completed'
  //                         ? 'rgb(3, 253, 3)'
  //                         : report.Status === 'Started'
  //                           ? 'aqua'
  //                           : report.Status === 'Closed'
  //                             ? 'rgb(206, 199, 199)'
  //                             : report.Status === 'In Review'
  //                               ? 'Orange'
  //                               : report.Status === 'Issue/Bug Found'
  //                                 ? '#d6266c'
  //                                 : report.Status === 'In Progress'
  //                                   ? 'rgb(255, 255, 159)'
  //                                   : 'rgb(249, 60, 60)',
  //                     padding: '2px 4px',
  //                     borderRadius: '7px',
  //                     display: 'inline-block',
  //                     width: '100px',
  //                     textAlign: 'center',
  //                     boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
  //                     fontWeight: 'bold',
  //                   }}
  //                   className={`status ${report.Status === 'Started'
  //                     ? 'started'
  //                     : report.Status === 'In Progress'
  //                       ? 'inProgress'
  //                       : report.Status === 'Completed'
  //                         ? 'completed'
  //                         : report.Status === 'Issue/Bug Found'
  //                           ? 'issueFound'
  //                           : report.Status === 'In Review'
  //                             ? 'inReview'
  //                             : ''
  //                     }`}
  //                 >
  //                   {report.Status}
  //                 </span>
  //               </td>
  //             </tr>
  //           ))
  //         )}
  //       </tbody>
  //     </table>

  // <div className="pagination">
  //   <button
  //     className="page-button arrow-button"
  //     onClick={() => handlePageChange(currentPage - 1)}
  //     disabled={currentPage === 1}
  //   >
  //     &lt;
  //   </button>
  //   {generatePageNumbers().map((pageNumber, index) =>
  //     typeof pageNumber === 'number' ? (
  //       <button
  //         key={index}
  //         className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
  //         onClick={() => handlePageChange(pageNumber)}
  //       >
  //         {pageNumber}
  //       </button>
  //     ) : (
  //       <button
  //         key={index}
  //         className="page-button ellipsis-button"
  //         onClick={() =>
  //           handleEllipsisClick(
  //             pageNumber === '...' && index < generatePageNumbers().length / 2
  //               ? 'left'
  //               : 'right',
  //           )
  //         }
  //       >
  //         {pageNumber}
  //       </button>
  //     ),
  //   )}
  //   <button
  //     className="page-button arrow-button"
  //     onClick={() => handlePageChange(currentPage + 1)}
  //     disabled={currentPage === totalPages || totalPages === 0}
  //   >
  //     &gt;
  //   </button>
  // </div>
  //   </div>
  // )
}

export default Reports
