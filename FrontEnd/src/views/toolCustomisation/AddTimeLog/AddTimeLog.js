import React, { useEffect, useState } from 'react'
import './AddTimeLog.css'
import axios from 'axios'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { USER_API_ENDPOINT } from 'src/constants'
import CIcon from '@coreui/icons-react'
import BugReportIcon from '@mui/icons-material/BugReport'
import TaskIcon from '@mui/icons-material/Task'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'

import {
  CAlert,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormSwitch,
  CFormInput,
  CRow,
  CCol,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CProgress,
  CProgressStacked,
} from '@coreui/react'
import {
  cilArrowTop,
  cilChevronBottom,
  cilChevronTop,
  cilCalendarCheck,
  cilPen,
  cilDescription,
  cilTask,
  cilX,
  cilAvTimer,
} from '@coreui/icons'
import Swal from 'sweetalert2'
import {
  PedalBike,
  TimelapseRounded,
  TimelapseSharp,
  Timer,
  Timer10,
  TimeToLeave,
} from '@mui/icons-material'
import { TimeSeriesScale } from 'chart.js'
import DataTable from 'react-data-table-component'

const AddTimeLog = () => {
  const [status, setStatus] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [Data, setData] = useState([])
  const [reports, setReports] = useState([])
  const [activityTime, setActivityTime] = useState()
  const [allSearchQuery, setAllSearchQuery] = useState('')
  const [searchFields, setSearchFields] = useState([])
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [lastSelectedFilter, setLastSelectedFilter] = useState('') // Track the last selected filter
  const [projectNames, setProjectNames] = useState([])
  const [project_ID, setProjectID] = useState([])
  const [filteredReportsX, setFilteredReports] = useState([])
  const [subMenuVisible, setSubMenuVisible] = useState(false)
  const [subSubMenuVisible, setSubSubMenuVisible] = useState(false)
  const [subSubMenuOptions, setSubSubMenuOptions] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [newStatus, setNewStatus] = useState(' ')
  const [TimeSpent, SetTimeSpent1] = useState('')
  const [TimeSpent2, SetTimeSpent2] = useState(0)
  const [time_Logged, setTImeLogged] = useState()
  const [issue, setIssue] = useState()
  const [assignedTime, setTime] = useState('')
  const [cKvisible, setCKvisible] = useState(false)
  const reportsPerPage = 5
  const [errors, setErrors] = useState([])
  const [projectPlanning_to_assign, setProjectPlanning_to_assign] = useState({})
  const [timeSpent, setTimeSpent] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')

  const totalTime = 2 * 24 // assuming the original estimate is 2 days (in hours)
  let time
  const [editorContent, setEditorContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activityID, setActivityID] = useState('')
  const [activityID2, setActivityID2] = useState('')
  const [allDescription, setAlldescription] = useState([])
  const [allChanges, setAllChanges] = useState([])
  const [employeeID, setEmpID] = useState()
  const [Activity_Type, setActivityType] = useState('')
  const [toggleModule, setToggleModule] = useState(false)
  const [userModule, setUserModule] = useState([])
  const [Work_Description, setWorkDescription] = useState('')
  const [total, setTotal] = useState('')
  const [ActivityNames, setActivityNames] = useState([])
  const [testerLog, setTesterLog] = useState([])
  const [tasKvisible, settasKvisible] = useState(false)
  const [IssueVisible, setIssueVisible] = useState(false)
  const [solvedIssues, setIssueSolvedVisible] = useState(false)
  const [taskStatus, setTaskStatus] = useState(' ')
  const [modalVisible, setModalVisible] = useState(false)
  const [Priority, setPriority] = useState('')

  const handleTimeSpentChange = (e) => {
    setTimeSpent(e.target.value)
  }
  const [completeTime, setCompleteTime] = useState([''])
  let userID
  let userDesignation
  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  userID = ParsedData.id
  userDesignation = ParsedData.designation_id
  let fName = ParsedData.firstName
  let mName = ParsedData.midName
  let lName = ParsedData.lastName
  let Naam = fName + ' ' + lName
  let fullName = fName + ' ' + mName + ' ' + lName
  const [modifiedDataData, setModifiedData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      if (userDesignation === 1) {
        try {
          const response = await axios.get(`${USER_API_ENDPOINT}getAllActivities2`)
          const data = response.data.data.reverse()
          console.log('This is the data from API', data)
          setReports(data)
          setFilteredReports(data)
          setModifiedData(data)
          const names = data.map((activity) => activity.projectPlanning.project_name)
          const activityNames = data.map((activity) => activity.project_modules_activities)
          // Filter out unique project names if needed
          const uniqueNames = [...new Set(names)]
          const uniqueActivityNames = [...new Set(activityNames)]

          setProjectNames(uniqueNames.reverse())
          setActivityNames(uniqueActivityNames.reverse()) // Reverse if needed
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      } else {
        if (userDesignation === 3) {
          try {
            const response = await axios.get(`${USER_API_ENDPOINT}getActivitiesByUserId/${userID}`)
            const data = response.data.data
            setReports(data)
            setFilteredReports(data)
            setModifiedData(data)
            const names = data.map((activity) => activity.projectPlanning.project_name)
            const names2 = data.map((activity) => activity.project_modules_activities)
            // Filter out unique project names if needed
            const uniqueNames = [...new Set(names)]
            const activities = [...new Set(names2)]

            setProjectNames(uniqueNames.reverse())
            setActivityNames(activities.reverse()) // Reverse if needed
          } catch (error) {
            console.error('Error fetching data:', error)
          }

          // Sorting logic
        } else {
          try {
            const response = await axios.get(`${USER_API_ENDPOINT}getActivitiesForTester`)
            const data = response.data.data

            const revisedData = data
            setReports(revisedData)
            setFilteredReports(revisedData)
            setModifiedData(revisedData)

            console.log('<><><><><>', revisedData)

            const uniqueProjectNames = Array.from(
              new Set(revisedData.map((item) => item.projectPlanning.project_name)),
            )
            const uniqueActivities = Array.from(
              new Set(revisedData.map((item) => item.project_modules_activities)),
            )
            setActivityNames(uniqueActivities)
            setProjectNames(uniqueProjectNames)
            console.log(uniqueProjectNames)
          } catch (error) {
            console.error('Error fetching data:', error)
          }
        }
      }
    }

    fetchData()
  }, [])
  const [StartDate, setStartDate] = useState('')
  const [EndDate, setEndDate] = useState('')
  const [newStartTime, setStartTime] = useState('')
  const [EndTime, setEndTime] = useState('')
  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById('scrollToTopButton')
      if (button) {
        if (window.scrollY > 300) {
          button.style.display = 'block'
        } else {
          button.style.display = 'none'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const columns = [
    {
      name: 'Sr.No.',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Project Name',
      selector: (row) => row.projectPlanning.project_name,
      sortable: true,
    },
    {
      name: 'Activity Name',
      selector: (row) => row.project_modules_activities,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) =>
        row.Activity_Status === 'Completed'
          ? 'Assigned For Testing'
          : row.Activity_Status === 'In Review'
          ? 'Testing'
          : row.Activity_Status || 'Not Started Yet',
      sortable: true,
    },
    {
      name: 'Assigned Hours',
      selector: (row) => row.assigned_hrs || 'NA',
      sortable: true,
      width: '160px',
    },
    {
      name: 'Timer',
      cell: (row) =>
        userDesignation !== 1 ? (
          <div className="timer-container">
            <CFormSwitch
              style={{ cursor: 'pointer' }}
              onChange={(event) =>
                handleSwitchChange(
                  row.id,
                  event.target.checked,
                  row.Project_ID,
                  row.project_modules_activities,
                  row.projectPlanning.project_name,
                )
              }
              className={`form-switch-lg custom-switch ${
                timers[row.id]?.isChecked ? 'text-primary' : ''
              }`}
              size="lg"
              id={`formSwitchCheckDefaultNormal-${row.id}`}
              checked={!!timers[row.id]?.isChecked}
            />
            <span className="timer-display">{formatTime(timers[row.id]?.elapsedTime || 0)}</span>
          </div>
        ) : null,
      width: '150px',
      omit: userDesignation === 1,
    },
    {
      name: 'Assign for Testing',
      cell: (row) => (
        <CFormSwitch
          style={{ cursor: 'pointer' }}
          onChange={(event) => {
            const isChecked = event.target.checked
            handleAssignToTester(row.id, row.projectPlanning.id, isChecked ? 1 : 0)
          }}
          className="form-switch-lg custom-switch"
          size="lg"
          id={`formSwitchCheckDefaultNormal-${row.id}`}
          checked={row.Assign_For_Testing === '1'}
        />
      ),
      width: '150px',
      omit: userDesignation !== 3,
    },
    {
      name: userDesignation === 1 ? 'Time Tracking Logs' : 'Time Tracking',
      cell: (row) => (
        <div className="action-buttons">
          <CButton className="action-button" onClick={() => handleClick2(row.id, row.assigned_hrs)}>
            <AddIcon />
          </CButton>
          <CButton
            className="action-button"
            onClick={() => handleDescription(row.id, row.Activity_Status)}
          >
            <CreateIcon />
          </CButton>
          <CButton className="action-button" onClick={() => handleTimeLine(row.id)}>
            <EventAvailableIcon />
          </CButton>
          <CButton className="action-button" onClick={() => handleIssueTimeLine(row.id)}>
            <BugReportIcon />
          </CButton>
          <CButton className="action-button" onClick={() => handleIssueSolvedTimeLine(row.id)}>
            <TaskIcon />
          </CButton>
        </div>
      ),
      width: '300px',
    },
  ]

  const scrollToTop = () => {
    const modalBody = document.querySelector('.c-modal-body') // Adjust the selector as per your modal structure

    if (modalBody) {
      modalBody.scrollTo({
        top: 0,
        behavior: 'smooth', // Optional: Adds smooth scrolling behavior
      })
    }
  }

  const fetchData = async () => {
    if (userDesignation === 1) {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}getAllActivities2`)
        const data = response.data.data
        console.log('This is the data from API', data)
        setReports(data)
        setFilteredReports(data)
        const names = data.map((activity) => activity.projectPlanning.project_name)
        const activityNames = data.map((activity) => activity.project_modules_activities)
        // Filter out unique project names if needed
        const uniqueNames = [...new Set(names)]
        const uniqueActivityNames = [...new Set(activityNames)]

        setProjectNames(uniqueNames.reverse())
        setActivityNames(uniqueActivityNames.reverse()) // Reverse if needed
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    } else {
      if (userDesignation === 3) {
        try {
          const response = await axios.get(`${USER_API_ENDPOINT}getActivitiesByUserId/${userID}`)
          const data = response.data.data
          setReports(data)
          setFilteredReports(data)
          const names = data.map((activity) => activity.projectPlanning.project_name)
          const names2 = data.map((activity) => activity.project_modules_activities)
          // Filter out unique project names if needed
          const uniqueNames = [...new Set(names)]
          const activities = [...new Set(names2)]

          setProjectNames(uniqueNames.reverse())
          setActivityNames(activities.reverse()) // Reverse if needed
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      } else {
        try {
          const response = await axios.get(`${USER_API_ENDPOINT}getActivitiesForTester`)
          const data = response.data.data.reverse()

          const revisedData = data
          setReports(revisedData)
          setFilteredReports(revisedData)

          console.log('<><><><><>', revisedData)

          const ProjectName = await axios.get(`${USER_API_ENDPOINT}getProjectNames`)
          const uniqueProjectNames = Array.from(
            new Set(ProjectName.data.data.map((empName) => empName.name)),
          )

          setProjectNames(uniqueProjectNames)
          console.log(uniqueProjectNames)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }
  }
  const handleClear = () => {
    setDateTime('')
  }

  const searchProject = (projectName) => {
    setLastSelectedFilter(projectName)
    if (projectName === '') {
      // Show all reports if no project is selected
      setFilteredReports(reports)
    } else {
      // Filter reports by selected project name
      const filtered = reports.filter(
        (report) => report.projectPlanning.project_name === projectName,
      )
      setFilteredReports(filtered)
    }
  }
  const calculateProgress = (time_Logged) => {
    const percentage = (time_Logged / assignedTime) * 100
    return Math.min(percentage, 100)
  }

  const handleDateChange = (event) => {
    const { name, value } = event.target
    setDateRange({ ...dateRange, [name]: value })
    setCurrentPage(1) // Reset to the first page on date change
  }

  const handleFieldChange = (index, event) => {
    const values = [...searchFields]
    values[index][event.target.name] = event.target.value
    setSearchFields(values)
    setCurrentPage(1) // Reset to the first page on search
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

  const [timers, setTimers] = useState(() => {
    const savedTimers = JSON.parse(localStorage.getItem('timers')) || {}
    return savedTimers
  })
  const [spent_Time, setSpentTime] = useState()

  const handleSwitchChange = async (
    Activity_ID,
    checked,
    Project_ID,
    activityName,
    projectName,
  ) => {
    const otherRunningTimer = Object.keys(timers).find(
      (id) => id !== Activity_ID && timers[id].isChecked,
    )

    if (checked && otherRunningTimer) {
      const previousActivityName = timers[otherRunningTimer]?.activityName || 'Unknown Activity'
      const previousProjectName = timers[otherRunningTimer]?.projectName || 'Unknown Project'

      const confirmSwitch = await Swal.fire({
        title: `Timer is already running for another activity.`,
        html: `
          <p><strong>Previous Project:</strong> ${previousProjectName}</p>
          <p><strong>Previous Activity:</strong> ${previousActivityName}</p>
          <p>Do you want to stop it and start a new timer?</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, stop it!',
        cancelButtonText: 'No, keep it running',
      })

      if (!confirmSwitch.isConfirmed) {
        return
      }

      // Stop the current running timer
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers }
        const now = new Date()
        const endTime = now.toLocaleTimeString()

        const elapsedTimeInSeconds = Math.floor(
          (now.getTime() - new Date(newTimers[otherRunningTimer].startTime).getTime()) / 1000,
        )
        const elapsedTimeInHours = (elapsedTimeInSeconds / 3600).toFixed(2)

        newTimers[otherRunningTimer] = {
          ...newTimers[otherRunningTimer],
          isChecked: false,
          endTime: now.toISOString(),
          elapsedTime: elapsedTimeInSeconds,
        }

        localStorage.setItem('timers', JSON.stringify(newTimers))

        axios.post(`${USER_API_ENDPOINT}addTimerData`, {
          Activity_ID: otherRunningTimer,
          AddedBy_EmployeeID: userID,
          Time_Spent: elapsedTimeInHours,
          Date_Of_Entry: new Date().toLocaleDateString(),
          EndTime: endTime,
          StartTime: new Date(newTimers[otherRunningTimer].startTime).toLocaleTimeString(),
        })

        return newTimers
      })
    }

    setTimers((prevTimers) => {
      const newTimers = { ...prevTimers }
      if (checked) {
        const now = new Date()
        newTimers[Activity_ID] = {
          isChecked: true,
          startTime: now.toISOString(),
          elapsedTime: 0,
          activityName, // Store the current activity name
          projectName, // Store the current project name
        }
        console.log('Timer started at:', now.toLocaleTimeString())
      } else {
        delete newTimers[Activity_ID]
      }
      localStorage.setItem('timers', JSON.stringify(newTimers))
      return newTimers
    })

    if (!checked) {
      const isoString = timers[Activity_ID]?.startTime
      const date = new Date(isoString)

      const Start_Time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      })

      const Date_Of_Entry = new Date().toLocaleDateString()
      const endTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      })

      const elapsedTimeInSeconds = timers[Activity_ID]?.elapsedTime || 0
      const elapsedTimeInHours = (elapsedTimeInSeconds / 3600).toFixed(2)
      localStorage.setItem('timeValue', JSON.stringify(elapsedTimeInHours))

      const data = await axios.post(`${USER_API_ENDPOINT}addTimerData`, {
        Activity_ID,
        AddedBy_EmployeeID: userID,
        Time_Spent: elapsedTimeInHours,
        Date_Of_Entry,
        EndTime: endTime,
        StartTime: Start_Time,
      })

      console.log('Entered Date', data)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers }
        const activeTimers = Object.keys(newTimers).filter(
          (activityId) => newTimers[activityId].isChecked,
        )

        if (activeTimers.length > 1) {
          // Stop all timers except the last started one
          const lastStartedTimer = activeTimers[activeTimers.length - 1]
          activeTimers.forEach((activityId) => {
            if (activityId !== lastStartedTimer) {
              newTimers[activityId].isChecked = false
              newTimers[activityId].elapsedTime = 0
            }
          })
        }

        activeTimers.forEach((activityId) => {
          const { startTime } = newTimers[activityId]
          newTimers[activityId].elapsedTime = Math.floor(
            (Date.now() - new Date(startTime).getTime()) / 1000,
          )
        })

        localStorage.setItem('timers', JSON.stringify(newTimers))
        return newTimers
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Filter reports based on search and date range
  const filteredReports = filteredReportsX.filter((report) => {
    const activityName = report.project_modules_activities.toLowerCase()
    const status = report.Activity_Status.toLowerCase() // Assuming Activity_Status is a direct property of report
    const projectName = report.projectPlanning.project_name.toLowerCase()

    const matchesAllSearch =
      activityName.includes(allSearchQuery.toLowerCase()) ||
      status.includes(allSearchQuery.toLowerCase()) ||
      projectName.includes(allSearchQuery.toLowerCase())

    const matchesSpecificFields = searchFields.every(({ field, query }) => {
      switch (field) {
        case 'Project':
          return projectName.includes(query.toLowerCase())
        case 'Activity':
          return activityName.includes(query.toLowerCase())
        case 'Status':
          return status.includes(query.toLowerCase())
        default:
          return true
      }
    })

    return matchesAllSearch && matchesSpecificFields
  })

  const sortedReports = filteredReports.sort((a, b) => {
    if (a.Activity_Status === 'Pending' && b.Activity_Status !== 'Pending') return -1
    if (a.Activity_Status !== 'Pending' && b.Activity_Status === 'Pending') return 1
    return 0
  })

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReportsX.length / reportsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const hasFilters = allSearchQuery || searchFields.length > 0

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setEditorContent(data)
    if (errorMessage) {
      setErrorMessage('')
    }
  }
  const [Activity_Id, setActivity_Id] = useState('')

  const handleDescription = async (id, Status) => {
    setTaskStatus(Status)
    setActivity_Id(id)
    setCKvisible(true)
  }

  const getTimeX = async (id, assignedTime) => {
    try {
      if (userDesignation !== 3) {
        const response = await axios.get(`${USER_API_ENDPOINT}getTimeTracking2/${id}`, {
          params: {
            userID: userID,
            Date_Of_Entry: new Date().toLocaleDateString(),
          },
        })

        console.log('This is response', response)
        const newData = response.data.data
        const newTime = response.data.Time_spent
        const newData2 = response.data.id
        console.log('This is new data', newData2)
        setTImeLogged(newData.time_Logged)
        setActivityTime(newData.Time_remaining)
        setIssue(newData2.Activity_ID)
        if (newTime) {
          setTimeSpent(newTime)
        } else {
          setTimeSpent(0)
        }
        SetTimeSpent1((pre) => {
          SetTimeSpent2(pre)
          return newData.Time_spent
        })
        setTotal(assignedTime - newData.Time_remaining)
      } else {
        const response = await axios.get(`${USER_API_ENDPOINT}getTimeTracking2/${id}`, {
          params: {
            userID: userID,
            Date_Of_Entry: new Date().toLocaleDateString(),
          },
        })

        console.log('This is response', response)
        const newData = response.data.data
        const newTime = response.data.Time_spent
        const newData2 = response.data.id
        console.log('This is new data', newData2)
        setTImeLogged(newData.time_Logged)
        setActivityTime(newData.Time_remaining)
        setIssue(newData2.Activity_ID)
        if (newTime) {
          setTimeSpent(newTime)
        } else {
          setTimeSpent(0)
        }
        SetTimeSpent1((pre) => {
          SetTimeSpent2(pre)
          return newData.Time_spent
        })
        setTotal(assignedTime - newData.Time_remaining)
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTImeLogged(0)
        // setTimeSpent(completeTime)
        const data = await axios.get(`${USER_API_ENDPOINT}getAllSum/${id}`, {
          params: {
            userID: userID,
            Date_Of_Entry: new Date().toLocaleDateString(),
          },
        })
        console.log('Total Time', data)
        setTimeSpent(data.data.data)
        setIssue('')
        console.log('YE HAI TIME', assignedTime)
        console.warn('No data found for the provided activity ID. Using assigned time.')

        setActivityTime(assignedTime)
        console.log('YE HAI TIME', assignedTime) // Fallback to assignedTime
      } else {
        console.error('An error occurred while fetching time tracking data', error)
        setIssue('')
      }
    }
  }
  const [workDescription, setWorkDescriptions] = useState([])
  const [expandedItems, setExpandedItems] = useState(Array(workDescription.length).fill(false))

  const toggleReadMore = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems]
      newExpandedItems[index] = !newExpandedItems[index]
      return newExpandedItems
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (timeSpent <= 0 && userDesignation !== 2) {
      newErrors.timeSpent = 'Enter your time spent'
    }
    if (!dateTime) {
      newErrors.dateTime = 'Date started required.'
    }
    if (!Work_Description || Work_Description.trim() === '') {
      newErrors.Work_Description = 'Work description is required.'
    } else if (Work_Description.length > 1000) {
      // Example: Adjust the max length as needed
      newErrors.Work_Description = 'Work description should not exceed 1000 characters.'
    }
    if (!status) {
      newErrors.status = 'Status is required.'
    }
    if (!Activity_Type) {
      newErrors.Activity_Type = 'Activity type is required'
    }
    if (status === 'Issue/Bug Found') {
      if (!Priority) {
        newErrors.Priority = 'Priority is required'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
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

  const handleAllSearchChange = (event) => {
    setAllSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }

  const resetForm = () => {
    setTimeSpent('')
    setDateTime('')
    setWorkDescription('')
    setStatus('')
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setVisibleEdit(false)
  }

  const Status = ['In Progress', 'Pending', 'Completed', 'Closed', 'In Review', 'Issue/Bug Found']

  const getOptions = (field) => {
    switch (field) {
      case 'Project':
        return projectNames
      case 'Activity':
        return ActivityNames
      case 'Status':
        return Status
      default:
        return ['No record to display']
    }
  }
  const [csrfTokenX, setCsrfToken] = React.useState('')
  const handleSubmit1 = async () => {
    try {
      if (!validateForm()) {
        return
      } else {
        if (userDesignation !== 2) {
          const value = localStorage.getItem('timeValue')
          const reqTime = JSON.parse(value)
          const data = await axios.post(`${USER_API_ENDPOINT}addTimeTracking`, {
            Allotted_time: assignedTime,
            Time_spent: reqTime,
            Time_remaining: (parseFloat(activityTime) - parseFloat(timeSpent)).toFixed(2),
            Start_Date: dateTime,
            Work_Description: Work_Description,
            Status: status,
            Activity_Type: Activity_Type,
            activity_ID: activityID2,
            AddedBy_EmployeeID: userID,
          })
          console.log(data)

          Swal.fire({
            title: `${data.data.message}`,
            icon: 'success',
          })
          fetchData()
          setVisibleEdit(false)
          resetForm()
        } else {
          const value = localStorage.getItem('timeValue')
          const reqTime = JSON.parse(value)
          const data = await axios.post(`${USER_API_ENDPOINT}addTimeTracking`, {
            Start_Date: dateTime,
            Work_Description: Work_Description,
            Time_spent: reqTime,
            Status: status,
            Activity_Type: Activity_Type,
            activity_ID: activityID2,
            AddedBy_EmployeeID: userID,
            Priority: Priority,
          })
          console.log(data)
          Swal.fire({
            title: `${data.data.message}`,
            icon: 'success',
          })
          fetchData()
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
      })

      console.error('ERROR SUBMITTING DATA', error)
    }
  }

  const handleCloseModal = () => {
    setCKvisible(false)
    setSuccessMessage('')
  }

  const addSearchField = (field) => {
    if (field) {
      setSearchFields([...searchFields, { field, query: '' }])
    }
  }

  const formatDate2 = (isoString) => {
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const handleAssignToTester = async (id, project_Id, isChecked) => {
    // Use activityId and isChecked as needed
    console.log(`Activity ID: ${id}, Switch State: ${isChecked}, Name: ${fullName}`)

    const data = await axios.put(`${USER_API_ENDPOINT}assignToTester/${id}`, {
      Assign_For_Testing: isChecked,
      userID: userID,
      fullName: fullName,
    })
    console.log(data)
    fetchData()
  }

  const [chnageLog, setChangeLog] = useState([])

  const [workDetails, setWorkDetails] = useState([])

  const handleTimeLine = async (id) => {
    setTesterLog([])
    setAllChanges([])
    setWorkDescriptions([])
    setChangeLog([])
    setAlldescription([])

    settasKvisible(true)

    if (userDesignation !== 1) {
      try {
        const [testerTimeLog, assignedTesterLog, work, change] = await Promise.all([
          axios.get(`${USER_API_ENDPOINT}getTesterTimeLog/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getAssignedTesterLog/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getWorkDescription/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getChangeLog/${id}`).catch((e) => e),
        ])

        const testerData = testerTimeLog.status === 200 ? testerTimeLog.data.data : []
        const testerChanges = change.status === 200 ? change.data.data : []
        const workDetails = work.status === 200 ? work.data.data : []
        const changeDetails = change.status === 200 ? change.data.data : []
        console.log('abc', testerData)
        const filteredTesterData = testerData.filter(
          (item) =>
            item.AddedBy_EmployeeID == userID &&
            ['Completed', 'In Progress', 'Pending', 'In Review'].includes(item.Status),
        )

        // const filteredTesterData2 = testerChanges.filter((item) =>
        //   item.Assigned_To_Tester === "1" &&
        //   item.Client === null
        // );
        console.log('////////// Tester Time Log', filteredTesterData)
        setTesterLog(filteredTesterData)
        setAllChanges(testerChanges)
        setWorkDescriptions(work)
        setChangeLog(changeDetails)

        const allDescriptions = [
          ...filteredTesterData.map((item) => ({
            ...item,
            type: 'Description1',
            dateTime: item.createdAt,
          })),
          ...changeDetails.map((item) => ({
            ...item,
            type: 'Description2',
            dateTime: item.createdAt,
          })),
          ...workDetails.map((item) => ({
            ...item,
            type: 'Description3',
            dateTime: item.createdAt,
          })),
          ...changeDetails.map((item) => ({
            ...item,
            type: 'Description4',
            dateTime: item.createdAt,
          })),
        ]
        allDescriptions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
        setAlldescription(allDescriptions)
      } catch (error) {
        console.log('Something went wrong')
        console.error(error)
      }
    } else {
      try {
        const [testerTimeLog, assignedTesterLog, change, workDescription] = await Promise.all([
          axios.get(`${USER_API_ENDPOINT}getTesterTimeLog/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getAssignedTesterLog/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getChangeLog/${id}`).catch((e) => e),
          axios.get(`${USER_API_ENDPOINT}getWorkDescription/${id}`).catch((e) => e),
        ])

        const testerData = testerTimeLog.status === 200 ? testerTimeLog.data.data : []
        const testerChanges = assignedTesterLog.status === 200 ? assignedTesterLog.data.data : []
        const changeLog = change.status === 200 ? change.data.data : []
        const work = workDescription.status === 200 ? workDescription.data.data : []

        const filteredTesterData = testerData.filter(
          (item) =>
            ['Completed', 'In Progress', 'Pending', 'In Review'].includes(item.Status) &&
            item.Activity_Type !== 'Bug/issue Resolved' &&
            item.Activity_Type !== 'Testing',
        )

        const filteredTesterData2 = testerChanges.filter(
          (item) => item.Assigned_To_Tester === '1' && item.Client == null,
        )
        console.log('//////////', filteredTesterData)
        setTesterLog(filteredTesterData)
        setAllChanges(filteredTesterData2)
        setChangeLog(changeLog)
        setWorkDetails(work)

        const allDescriptions = [
          ...filteredTesterData.map((item) => ({
            ...item,
            type: 'Description1',
            dateTime: item.createdAt,
          })),

          ...changeLog.map((item) => ({
            ...item,
            type: 'Description2',
            dateTime: item.createdAt,
          })),

          ...work.map((item) => ({
            ...item,
            type: 'Description3',
            dateTime: item.createdAt,
          })),
        ]
        allDescriptions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
        setAlldescription(allDescriptions)
      } catch (error) {
        console.log('Something went wrong')
        console.error(error)
      }
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

  const handleIssueTimeLine = async (id) => {
    setIssueVisible(true)

    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getTesterTimeLog/${id}`)
      const newData = response.data.data
      const filteredData = newData.filter((item) => item.Status === 'Issue/Bug Found')
      console.log('<><><><><><><><> Filter', filteredData)
      setTesterLog(filteredData)
    } catch (error) {
      console.log('Something went wrong')
      console.error(error)
      setTesterLog('')
    }
  }
  const handleIssueSolvedTimeLine = async (id) => {
    setIssueSolvedVisible(true)

    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getTesterTimeLog/${id}`)
      const newData = response.data.data
      const filteredData = newData.filter(
        (item) => item.Activity_Type === 'Bug/issue Resolved' || item.Activity_Type === 'No issue',
      )
      console.log('<><><><><><><><> Filter', filteredData)
      setTesterLog(filteredData)
    } catch (error) {
      console.log('Something went wrong')
      console.error(error)
      setTesterLog('')
    }
  }
  const [expandedItems2, setExpandedItems2] = useState({})
  const toggleReadMore2 = (index) => {
    setExpandedItems2((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleSubmit2 = async (taskStatus, userDesignation) => {
    try {
      if (!editorContent.trim()) {
        setErrorMessage('Work description cannot be empty.')
        return // Exit the function if validation fails
      }
      let newEvent
      let data

      // Create the event based on userDesignation and taskStatus
      if (
        userDesignation === 3 ||
        (userDesignation === 2 && taskStatus !== 'Completed') ||
        userDesignation === 1
      ) {
        newEvent = {
          date: new Date().toLocaleDateString(),
          event: editorContent,
          timeSpent,
          timeRemaining: time - timeSpent,
          dateTime: new Date().toLocaleTimeString(),
        }
        data = await axios.post(`${USER_API_ENDPOINT}addWorkDetails`, {
          Name: Naam,
          Task_Date: newEvent.date,
          Task_Time: newEvent.dateTime,
          Work_Description: newEvent.event,
          activity_ID: activityID,
        })

        Swal.fire({
          title: `${data.data.message}`,
          icon: 'success',
        })
      } else if (
        userDesignation === 2 &&
        (taskStatus === 'Completed' ||
          taskStatus === 'In Review' ||
          taskStatus === 'Closed' ||
          taskStatus === 'Issue/Bug Found')
      ) {
        newEvent = {
          event: editorContent,
          dateTime: new Date().toLocaleTimeString(),
        }
        data = await axios.post(`${USER_API_ENDPOINT}addIssues`, {
          Tester_Name: Naam,
          Issue_details: newEvent.event,
          Assigned_Employee: employeeID,
          Activity_ID: activityID,
          Issue_Status: newStatus,
          Assigned_Tester: userID,
          Issue_Time: new Date().toLocaleTimeString(),
        })

        Swal.fire({
          title: `${data.data.message}`,
          icon: 'success',
        })
      }

      setEditorContent('')
      setTimeSpent('')
      setDateTime('')
      setSuccessMessage('Work description saved successfully!')
      setErrorMessage('')
      console.log(data)

      handleCloseModal()
    } catch (error) {
      console.error('An error occurred:', error)
      setErrorMessage('An error occurred while saving the data. Please try again.')
    }
  }

  const handleStatusFilter2 = (status) => {
    try {
      setResetButtonDisabled(false)
      console.log('Selected Status:', status)
      console.log('Original Data:', modifiedDataData)

      let filteredData

      if (status === '') {
        filteredData = modifiedDataData
      } else if (status === 'Not Started Yet') {
        filteredData = modifiedDataData.filter((item) => item.Activity_Status === '')
      } else {
        filteredData = modifiedDataData.filter((item) => item.Activity_Status === status)
      }

      console.log('Filtered Data:', filteredData)
      setFilteredReports(filteredData)
    } catch (error) {
      console.error('Error filtering data:', error)
    }
  }

  const [resetDisbaled, setResetButtonDisabled] = useState(true)
  const handleResetData = () => {
    setResetButtonDisabled(true)
    setFilteredReports(modifiedDataData)
  }

  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader
    }

    upload() {
      return this.loader.file.then((file) => {
        const csrfToken = '15WpFN7P-zHqqfcSQjjD32pURFUuzG7pdXjA' // Replace with actual token
        const formData = new FormData()
        formData.append('file', file) // Change 'file' to 'upload'
        formData.append('csrfToken', csrfToken)
        formData.append('activity_ID', Activity_Id)

        return new Promise((resolve, reject) => {
          fetch('http://localhost:8002/addActivityFile', {
            method: 'POST',
            body: formData,
            credentials: 'include', // Ensure cookies are sent
          })
            .then((response) => {
              if (!response.ok) {
                reject(response.statusText)
              }
              return response.json()
            })
            .then((data) => {
              console.log('Full response from server:', data) // Log full server response
              resolve({
                default: data.url,
                data: data.data,
                abc: data.abc,
              })
            })
            .catch((error) => {
              console.error('Error uploading file:', error)
              reject(error)
            })
        })
      })
    }

    abort() {
      // Implement abort if needed
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case '':
        return '#bdced7'
      case 'In Progress':
        return '#0dcaf0'
      case 'Completed':
        return '#6297e4'
      case 'Pending':
        return '#f60000'
      case 'Closed':
        return '#1ccd1f'
      case 'In Review':
        return '#eefe11'
      case 'Issue/Bug Found':
        return '#ff8f06'
      default:
        return '#ffffff' // default white background for unknown status
    }
  }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleClick2 = async (id, TIME) => {
    setVisibleEdit(true)
    setTime(TIME)
    setActivityID2(id)
    await getTimeX(id, TIME)
  }
  const [timerData, setTimerData] = useState([])
  const fetchTimerData = async (id) => {
    setModalVisible(!modalVisible)
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getTimerData`, {
        params: {
          AddedBy_EmployeeID: userID,
          Activity_ID: id,
        },
      })
      console.log('API Response:', response.data) // Log the entire response
      setTimerData(response.data.data)
    } catch (error) {
      console.error('Error fetching timer data:', error)
    }
  }

  const conditionalRowStyles = [
    {
      when: (row) => row.Activity_Status === 'Completed',
      style: {
        backgroundColor: '#bdced7',
      },
    },
    {
      when: (row) => row.Priority === 'Normal',
      style: {
        backgroundColor: '#0dcaf0',
      },
    },
    {
      when: (row) => row.Priority === 'High',
      style: {
        backgroundColor: '#d1fe24',
      },
    },
    {
      when: (row) => row.Priority === 'Urgent',
      style: {
        backgroundColor: '#f2b714',
      },
    },
    {
      when: (row) => row.Priority === 'Immediate',
      style: {
        backgroundColor: '#fb1100',
      },
    },
  ]

  return (
    <CCard className="md-4">
      <CCardHeader className="d-flex justify-content-between">
        {userDesignation === 2 ? (
          <h1 className="heading11">Activities For Testing</h1>
        ) : (
          <h1 className="heading11">Assigned Activities</h1>
        )}
        <CButton
          disabled={resetDisbaled}
          style={{ cursor: 'pointer' }}
          onClick={() => handleResetData()}
        >
          Reset
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="time-log-report">
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
                    <option value="Project">Project Name</option>
                    <option value="Activity">Activity</option>
                    <option value="Status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </header>
          <div className="timeDetails2">
            <b className="newBold3">
              <p
                className="statusItemNew1"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('Not Started Yet')}
              >
                Not Started Yet
              </p>
              <p
                className="statusItemNew2"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('In Progress')}
              >
                In Progress
              </p>
              <p
                className="statusItemNew3"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('Pending')}
              >
                Pending
              </p>

              <p
                className="statusItemNew4"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('Completed')}
              >
                Assigned For Testing
              </p>

              <p
                className="statusItemNew5"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('In Review')}
              >
                Testing
              </p>

              <p
                className="statusItemNew6"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('Issue/Bug Found')}
              >
                Issue/Bug Found
              </p>
              <p
                className="statusItemNew7"
                style={{ cursor: 'pointer' }}
                onClick={() => handleStatusFilter2('Closed')}
              >
                Closed
              </p>
            </b>
          </div>
          <div className="custom-data-table-container">
            <DataTable
              className="custom-data-table"
              columns={columns}
              data={currentReports}
              pagination
              responsive
              highlightOnHover
              striped
              style={{ cursor: 'pointer', border: '1px solid', marginTop: '15px' }}
              noHeader
              paginationServer
              paginationTotalRows={filteredReports.length}
              onChangePage={handlePageChange}
              conditionalRowStyles={[
                {
                  when: (row) => row.Activity_Status === 'Completed',
                  style: {
                    backgroundColor: '#6297e4',
                    color: 'white',
                    border: '1px solid #4a73b6',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'In Review',
                  style: {
                    backgroundColor: '#eefe11',
                    color: 'black',
                    border: '1px solid #d4d519',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'Issue/Bug Found',
                  style: {
                    backgroundColor: '#ff8f06',
                    color: 'white',
                    border: '1px solid #d46c02',

                    fontSize: '14px',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'Closed',
                  style: {
                    backgroundColor: '#1ccd1f',
                    color: 'white',
                    border: '1px solid #17a71d',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'Pending',
                  style: {
                    backgroundColor: '#f60000',
                    color: 'white',
                    border: '1px solid #d30000',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'In Progress',
                  style: {
                    backgroundColor: '#0dcaf0',
                    color: 'black',
                    border: '1px solid #0a9edc',

                    fontSize: '14px',
                  },
                },
                {
                  when: (row) => row.Activity_Status === 'Not Started Yet',
                  style: {
                    backgroundColor: '#bdced7',
                    color: 'black',
                    border: '1px solid #9fabb3',

                    fontSize: '14px',
                  },
                },
              ]}
            />
          </div>

          {/* <div className="pagination">
            <button
              className="page-button arrow-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {generatePageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              className="page-button arrow-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &gt;
            </button>
          </div> */}
          <CModal visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
            <CModalHeader>
              <CModalTitle>Time tracking</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {userDesignation === 3 ? (
                <>
                  <CProgressStacked style={{ height: '10px' }}>
                    <CProgress
                      value={calculateProgress(time_Logged)}
                      color={timeSpent > assignedTime ? 'info' : 'info'}
                    />
                    {time_Logged > assignedTime && (
                      <CProgress
                        color="danger"
                        value={((time_Logged - assignedTime) / assignedTime) * 100}
                      />
                    )}
                  </CProgressStacked>
                  <h6 style={{ color: 'gray', fontSize: '15px' }}>
                    {`${Math.floor(timeSpent / 24)}d ${time_Logged % 24}h logged`}
                  </h6>
                  <div id="CP">
                    <h6>The original estimate for this issue was:-</h6>
                    <span>{assignedTime} hours</span>
                  </div>
                </>
              ) : null}

              <CForm>
                <div id="input">
                  <div className="div1">
                    <label style={{ fontWeight: 'bold' }} className="label">
                      Time spent <span style={{ color: 'red' }}>*</span>{' '}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Time in hours"
                      value={timeSpent}
                      onChange={handleTimeSpentChange}
                      style={{ width: userDesignation === 2 ? '467px' : '100%' }} // Adjust width based on userDesignation
                    />

                    {errors.timeSpent && userDesignation !== 2 && (
                      <p id="validPara" style={{ color: 'red' }}>
                        {errors.timeSpent}
                      </p>
                    )}
                  </div>
                  <CButton
                    id="TimerButton"
                    onClick={() => {
                      fetchTimerData(activityID2)
                    }}
                  >
                    <CIcon icon={cilAvTimer}></CIcon>
                  </CButton>
                  {modalVisible && <div className="modal-blur"></div>}
                  {userDesignation === 3 ? (
                    <div className="div2">
                      <label className="label">Time remaining</label>
                      <input
                        type="text"
                        placeholder="Enter Time in hours"
                        value={activityTime || `${assignedTime}`}
                        style={{ cursor: 'not-allowed' }}
                        readOnly
                      />
                    </div>
                  ) : null}
                </div>
                <div className="container">
                  <label htmlFor="date-started" className="lable">
                    Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="input-container">
                    <input
                      type="datetime-local"
                      id="date-started"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value.replace('T', ' '))}
                    />

                    <button className="clear-btn" onClick={handleClear}>
                      &#x2716;
                    </button>
                  </div>
                </div>
                {errors.dateTime && (
                  <p id="validPara" style={{ color: 'red' }}>
                    {errors.dateTime}
                  </p>
                )}
                <div id="CKeditor">
                  <h2
                    style={{
                      marginRight: '4px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Work description <span style={{ color: 'red' }}>*</span>
                  </h2>
                  <CKEditor
                    data={Work_Description}
                    onChange={(event, editor) => {
                      const data = editor.getData()
                      setWorkDescription(data)
                    }}
                    editor={ClassicEditor}
                    config={{
                      ckfinder: {
                        uploadUrl: 'https://example.com/your-upload-endpoint',
                      },

                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'blockQuote',
                        '|',
                        'insertTable',
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        '|',
                        'undo',
                        'redo',
                        '|',
                        'imageUpload',
                      ],
                    }}
                  />
                </div>
                {errors.Work_Description && (
                  <p id="validPara" style={{ color: 'red' }}>
                    {errors.Work_Description}
                  </p>
                )}
              </CForm>
            </CModalBody>
            <CModalFooter style={{ height: '135px' }}>
              <div id="select-section">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <label
                      htmlFor="status-dropdown"
                      style={{
                        marginRight: '4px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        marginLeft: status === 'Issue/Bug Found' ? '6px' : '0px',
                      }}
                    >
                      Status <span style={{ color: 'red' }}>*</span>
                    </label>

                    <select
                      id="status-dropdown"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{
                        padding: '5px',
                        borderRadius: '4px',
                        color: 'gray',
                        width: status === 'Issue/Bug Found' ? '140px' : '135px',
                      }}
                    >
                      {userDesignation === 2 ? (
                        <>
                          <option value="">Select Status</option>
                          <option value="In Review">Testing</option>
                          <option value="Issue/Bug Found">Issue/Bug Found</option>
                          <option value="Closed">Closed</option>
                        </>
                      ) : (
                        <>
                          <option value="">Select Status</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>

                          <option value="Completed">Assigned For Testing</option>
                        </>
                      )}
                    </select>
                  </div>
                  {errors.status && (
                    <p id="validPara" style={{ color: 'red' }}>
                      {errors.status}
                    </p>
                  )}
                </div>
                <div>
                  {status === 'Issue/Bug Found' ? (
                    <div>
                      <label
                        htmlFor="status-dropdown"
                        style={{
                          marginTop: '3px',
                          marginRight: '4px',
                          fontSize: '15px',
                          fontWeight: 'bold',
                          marginLeft: status === 'Issue/Bug Found' ? '8px' : '0px',
                        }}
                      >
                        Priority <span style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        id="status-dropdown"
                        value={Priority}
                        onChange={(e) => {
                          setPriority(e.target.value)
                        }}
                        style={{
                          padding: '5px',
                          borderRadius: '4px',
                          color: 'gray',
                          marginLeft: '5px',
                          width: '100%',
                        }}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Immediate">Immediate</option>
                      </select>
                      {errors.Priority && (
                        <p id="validPara" style={{ color: 'red' }}>
                          {errors.Priority}
                        </p>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <div>
                    <label
                      htmlFor="activity-type"
                      style={{
                        marginRight: '4px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        marginLeft: status === 'Issue/Bug Found' ? '15px' : '0px',
                      }}
                    >
                      Activity Type <span style={{ color: 'red' }}>*</span>
                    </label>

                    <select
                      id="status-dropdown"
                      value={Activity_Type}
                      onChange={(e) => setActivityType(e.target.value)}
                      style={{
                        marginRight: 'auto',
                        padding: '5px',
                        borderRadius: '4px',
                        color: 'gray',
                        width: status === 'Issue/Bug Found' ? '90%' : '150px',
                        marginLeft: status === 'Issue/Bug Found' ? '15px' : '0px',
                      }}
                    >
                      {userDesignation === 2 ? (
                        <>
                          <option value="">Select Type</option>
                          <option value="Testing">Testing</option>
                          <option value="No issue">No issue</option>
                        </>
                      ) : (
                        <>
                          <option value="">Select Status</option>
                          <option value="Design">Design</option>
                          <option value="Backend Developement">Backend Developement</option>
                          <option value="Full Stack Developement">Full Stack Developement</option>
                          <option value="Bug/issue Resolved">Issue Solved</option>
                        </>
                      )}
                    </select>
                  </div>
                  {errors.Activity_Type && (
                    <p id="validPara" style={{ color: 'red' }}>
                      {errors.Activity_Type}
                    </p>
                  )}
                </div>
              </div>

              <div id="save_btn">
                <CButton
                  style={{
                    padding: '5px',
                    marginRight: '15px',
                    fontSize: '14px',
                    width: '70px',
                    fontWeight: 'bold',
                  }}
                  color="primary"
                  onClick={() => {
                    handleSubmit1(status, userDesignation)
                  }}
                >
                  Save
                </CButton>
                <CButton
                  style={{
                    padding: '5px',
                    fontSize: '14px',
                    width: '70px',
                    fontWeight: 'bold',
                  }}
                  color="secondary"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </CButton>
              </div>
              <br></br>
            </CModalFooter>
          </CModal>

          {/* ////////////Time Tracking Stop time modal/////////////// */}

          <CModal
            visible={solvedIssues}
            onClose={() => setIssueSolvedVisible(false)}
            aria-labelledby="ToggleBetweenModalsExample1"
            fullscreen
            id="taskModal"
          >
            <div className="header-container">
              <h1 id="headTask">
                History of Bugs / Issues Solved
                <button className="cancel-button" onClick={() => setIssueSolvedVisible(false)}>
                  Cancel
                </button>
              </h1>
            </div>

            <CModalBody className="c-modal-body">
              {testerLog.length === 0 ? (
                <div className="no-activity-message">
                  <div id="msg">No logs to display</div>
                </div>
              ) : (
                <div className="timeline">
                  {testerLog.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${
                          item.change ? 'red' : 'green'
                        }`}
                      >
                        <div className="timeline-content">
                          <div id="timeStart">
                            <h6
                              style={{
                                color: ['Testing', 'Bug/Issue Finding', 'No issue'].includes(
                                  item.Activity_Type,
                                )
                                  ? 'rgba(0, 0, 255, 0.98)'
                                  : '#64bae5',
                              }}
                            >
                              {['Testing', 'Bug/Issue Finding', 'No issue'].includes(
                                item.Activity_Type,
                              )
                                ? 'Time Tracking Details (Tester)'
                                : 'Time Tracking Details (Developer)'}
                            </h6>

                            <span className="timeline-date">{item.Start_Date}</span>
                          </div>
                          <div
                            id={
                              item.Activity_Type === 'Testing' ||
                              item.Activity_Type === 'Bug/Issue Finding' ||
                              item.Activity_Type === 'No issue'
                                ? 'TimeSec2'
                                : 'TimeSec'
                            }
                          >
                            <span>Time Spent: {item.Time_spent}hr</span>
                            <span style={{ position: 'relative', left: '117px' }}>
                              Time Remaining: {item.Time_remaining}hr
                            </span>
                          </div>
                          <p
                            style={{
                              marginTop: '15px',
                              color: '#808080',
                              fontWeight: '600',
                            }}
                            id="status"
                          >
                            <span>Status : </span> {item.Status.toUpperCase()}{' '}
                          </p>

                          <p
                            style={{
                              marginTop: '15px',
                              color: '#808080',
                              fontWeight: '600',
                            }}
                            id="status"
                          >
                            <span>Activity Type : </span> {item.Activity_Type.toUpperCase()}{' '}
                          </p>

                          <p id="para">
                            <span style={{ fontWeight: '700' }}>Work:</span>{' '}
                            {item.Work_Description
                              ? expandedItems2[index]
                                ? item.Work_Description
                                : `${item.Work_Description.substring(0, 150)}...`
                              : 'No description available'}
                            {item.Work_Description && item.Work_Description.length > 150 && (
                              <span
                                style={{ color: 'lightblue', cursor: 'pointer' }}
                                onClick={() => toggleReadMore2(index)}
                              >
                                {expandedItems2[index] ? ' Read less' : ' Read more'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CModalBody>

            <CButton
              id="scrollToTopButton"
              onClick={() => {
                scrollToTop()
              }}
            >
              <CIcon icon={cilArrowTop} />
            </CButton>
          </CModal>

          <CModal
            visible={IssueVisible}
            onClose={() => setIssueVisible(false)}
            aria-labelledby="ToggleBetweenModalsExample1"
            fullscreen
            id="taskModal"
          >
            <div className="header-container">
              <h1 id="headTask">
                History of Bugs / Issue Logs Found
                <button className="cancel-button" onClick={() => setIssueVisible(false)}>
                  Cancel
                </button>
              </h1>
            </div>

            <CModalBody className="c-modal-body">
              {testerLog.length === 0 ? (
                <div className="no-activity-message">
                  <div id="msg">No logs to display</div>
                </div>
              ) : (
                <div className="timeline">
                  {testerLog.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${
                          item.change ? 'red' : 'green'
                        }`}
                      >
                        <div className="timeline-content">
                          <div id="timeStart">
                            <h6
                              style={{
                                color:
                                  item.Activity_Type === 'Testing' ||
                                  item.Activity_Type === 'Bug/Issue Finding' ||
                                  item.Activity_Type === 'No issue'
                                    ? 'rgba(0, 0, 255, 0.98)'
                                    : '#64bae5',
                              }}
                            >
                              Tester Time Tracking
                            </h6>
                            <span className="timeline-date">{item.Start_Date}</span>
                          </div>
                          <div
                            id={
                              item.Activity_Type === 'Testing' ||
                              item.Activity_Type === 'Bug/Issue Finding' ||
                              item.Activity_Type === 'No issue'
                                ? 'TimeSec2'
                                : 'TimeSec'
                            }
                          >
                            <span>Time Spent: {item.Time_spent}hr</span>
                            <span style={{ position: 'relative', left: '117px' }}>
                              Time Remaining: {item.Time_remaining}hr
                            </span>
                          </div>
                          <p
                            style={{
                              marginTop: '15px',
                              color: '#808080',
                              fontWeight: '600',
                            }}
                            id="status"
                          >
                            <span>Status : </span> {item.Status.toUpperCase()}{' '}
                          </p>

                          <p
                            style={{
                              marginTop: '15px',
                              color: '#808080',
                              fontWeight: '600',
                            }}
                            id="status"
                          >
                            <span>Activity Type : </span> {item.Activity_Type.toUpperCase()}{' '}
                          </p>

                          <p id="para">
                            <span style={{ fontWeight: '700' }}>Work:</span>{' '}
                            {item.Work_Description
                              ? expandedItems2[index]
                                ? item.Work_Description
                                : `${item.Work_Description.substring(0, 150)}...`
                              : 'No description available'}
                            {item.Work_Description && item.Work_Description.length > 150 && (
                              <span
                                style={{ color: 'lightblue', cursor: 'pointer' }}
                                onClick={() => toggleReadMore2(index)}
                              >
                                {expandedItems2[index] ? ' Read less' : ' Read more'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CModalBody>

            <CButton
              id="scrollToTopButton"
              onClick={() => {
                scrollToTop()
              }}
            >
              <CIcon icon={cilArrowTop} />
            </CButton>
          </CModal>

          <CModal
            visible={tasKvisible}
            onClose={() => settasKvisible(false)}
            aria-labelledby="ToggleBetweenModalsExample1"
            fullscreen
            id="taskModal"
          >
            <div className="header-container">
              {userDesignation === 2 ? (
                <h1 id="headTask">
                  History of Testing Logs
                  <button className="cancel-button" onClick={() => settasKvisible(false)}>
                    Cancel
                  </button>
                </h1>
              ) : (
                <h1 id="headTask">
                  History of Activity Logs
                  <button className="cancel-button" onClick={() => settasKvisible(false)}>
                    Cancel
                  </button>
                </h1>
              )}
            </div>

            <CModalBody className="c-modal-body">
              {allDescription.length === 0 ? (
                <div className="no-activity-message">
                  <div id="msg">No logs to display</div>
                </div>
              ) : (
                <div className="timeline">
                  {allDescription.map((item, index) => {
                    if (item.type === 'Description1') {
                      return (
                        <div
                          key={index}
                          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${
                            item.change ? 'red' : 'green'
                          }`}
                        >
                          <div className="timeline-content">
                            <div id="timeStart">
                              <h6
                                style={{
                                  color: ['Testing', 'Bug/Issue Finding', 'No issue'].includes(
                                    item.Activity_Type,
                                  )
                                    ? 'rgba(0, 0, 255, 0.98)'
                                    : '#64bae5',
                                }}
                              >
                                {['Testing', 'Bug/Issue Finding', 'No issue'].includes(
                                  item.Activity_Type,
                                )
                                  ? 'Time Tracking Details (Tester)'
                                  : 'Time Tracking Details (Developer)'}
                              </h6>
                              <span className="timeline-date">{item.Start_Date}</span>
                            </div>
                            <div
                              id={
                                ['Testing', 'Bug/Issue Finding', 'No issue'].includes(
                                  item.Activity_Type,
                                )
                                  ? 'TimeSec2'
                                  : 'TimeSec'
                              }
                            >
                              <span>Time Spent: {item.Time_spent}hr</span>
                              <span style={{ position: 'relative', left: '117px' }}>
                                Time Remaining: {item.Time_remaining}hr
                              </span>
                            </div>
                            <p
                              style={{
                                marginTop: '15px',
                                color: '#808080',
                                fontWeight: '600',
                              }}
                              id="status"
                            >
                              <span>Status: </span> {item.Status.toUpperCase()}
                            </p>
                            <p
                              style={{
                                marginTop: '15px',
                                color: '#808080',
                                fontWeight: '600',
                              }}
                              id="status"
                            >
                              <span>Activity Type: </span> {item.Activity_Type.toUpperCase()}
                            </p>
                            <p id="para">
                              <span style={{ fontWeight: '700' }}>Work: </span>
                              {item.Work_Description
                                ? expandedItems2[index]
                                  ? item.Work_Description
                                  : `${item.Work_Description.substring(0, 150)}...`
                                : 'No description available'}
                              {item.Work_Description && item.Work_Description.length > 150 && (
                                <span
                                  style={{
                                    color: 'lightblue',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => toggleReadMore2(index)}
                                >
                                  {expandedItems2[index] ? ' Read less' : ' Read more'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    } else if (item.type === 'Description2') {
                      return (
                        <div
                          key={index}
                          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} red`}
                        >
                          <div className="timeline-content">
                            <div id="divDate">
                              {item.Assigned_To_Tester === '1' ? (
                                <h6>Assigned Tester</h6>
                              ) : (
                                <h6>Assigned Task</h6>
                              )}
                              <span className="timeline-date">{formatDate2(item.createdAt)}</span>
                            </div>
                            <br />
                            <p>
                              {item.Assigned_To_Tester === '1' ? (
                                <span>
                                  <b>{item.unassigned_Employee}</b> has assigned the activity to{' '}
                                  <b>{item.assigned_Employee}</b> for testing.
                                </span>
                              ) : (
                                <>
                                  {item.unassigned_Employee ? (
                                    <span>
                                      <b>{item.assigned_Employee}</b> was assigned in place of{' '}
                                      <b>{item.unassigned_Employee}</b> by <b>{item.Client}</b>
                                    </span>
                                  ) : (
                                    <span>
                                      <b>{item.assigned_Employee}</b> was assigned by{' '}
                                      <b>{item.Client}</b>
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    } else if (item.type === 'Description3') {
                      return (
                        <div
                          key={index}
                          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${
                            item.change ? 'green' : 'orange'
                          }`}
                        >
                          <div className="timeline-content">
                            <div id="nameDate">
                              <h3>Work Description</h3>
                              <div id="nameDate2">
                                <span style={{ marginLeft: '10px' }}> {item.Task_Date}</span>
                                <span style={{ marginLeft: '10px' }}>{item.Task_Time}</span>
                              </div>
                            </div>
                            <h3 id="name1">
                              Name: <span>{item.Name}</span>
                            </h3>
                            <p id="para2">
                              <span style={{ fontWeight: '700' }}>Work Done :</span>{' '}
                              {item.Work_Description
                                ? expandedItems[index]
                                  ? item.Work_Description
                                  : `${item.Work_Description.substring(0, 200)}...`
                                : 'No description available'}
                            </p>
                            {item.Work_Description && (
                              <span id="lastSpan" onClick={() => toggleReadMore(index)}>
                                {expandedItems[index] ? 'Read Less' : 'Read More...'}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div
                          key={index}
                          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} red`}
                        >
                          <div className="timeline-content">
                            <div id="divDate">
                              <h6>Assigned Task</h6>
                              <span className="timeline-date">{formatDate2(item.createdAt)}</span>
                            </div>
                            <br />
                            <p></p>
                            <p>
                              {item.Assigned_To_Tester === '1' ? (
                                <span>
                                  <b>{item.unassigned_Employee}</b> has assigned the activity to{' '}
                                  <b>{item.assigned_Employee}</b> for testing.
                                </span>
                              ) : (
                                <>
                                  {item.unassigned_Employee ? (
                                    <span>
                                      <b>{item.assigned_Employee}</b> was assigned in place of{' '}
                                      <b>{item.unassigned_Employee}</b> by <b>{item.Client}</b>
                                    </span>
                                  ) : (
                                    <span>
                                      <b>{item.assigned_Employee}</b> was assigned by{' '}
                                      <b>{item.Client}</b>
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
            </CModalBody>

            <CButton
              id="scrollToTopButton"
              onClick={() => {
                scrollToTop()
              }}
            >
              <CIcon icon={cilArrowTop} />
            </CButton>
          </CModal>
          <CModal visible={cKvisible} onClose={handleCloseModal} id="ckeditor" size="xl">
            <div id="CKwork">
              <CModalHeader>
                <CModalTitle style={{ font: 'bold' }}>
                  {userDesignation === 2 &&
                  (taskStatus === 'Completed' ||
                    taskStatus === 'In Review' ||
                    taskStatus === 'Issue/Bug Found' ||
                    taskStatus === 'Closed')
                    ? ' Describe the issues faced '
                    : "Write Your Today's Work"}
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div id="CKeditor1">
                    {userDesignation === 2 &&
                    (taskStatus === 'Completed' ||
                      taskStatus === 'In Review' ||
                      taskStatus === 'Issue/Bug Found' ||
                      taskStatus === 'Closed') ? (
                      <>
                        <h2
                          style={{
                            marginRight: '4px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          }}
                        >
                          Issue Description *{' '}
                        </h2>
                      </>
                    ) : (
                      <h2
                        style={{
                          marginRight: '4px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        Work description
                      </h2>
                    )}

                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          'link',
                          'bulletedList',
                          'numberedList',
                          'blockQuote',
                          '|',
                          'insertTable',
                          'tableColumn',
                          'tableRow',
                          'mergeTableCells',
                          '|',
                          'undo',
                          'redo',
                          '|',
                          'imageUpload',
                        ],
                        image: {
                          toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
                        },
                      }}
                      onReady={(editor) => {
                        // Override the default upload adapter with the custom one
                        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                          return new CustomUploadAdapter(loader) // Use 'new' to create an instance
                        }
                      }}
                      onChange={handleEditorChange}
                    />

                    {errorMessage && (
                      <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
                    )}
                    {successMessage && (
                      <CAlert color="success" style={{ marginTop: '8px' }}>
                        {successMessage}
                      </CAlert>
                    )}
                  </div>
                  <CButton
                    id="btnn"
                    onClick={() => {
                      handleSubmit2(taskStatus, userDesignation)
                    }}
                  >
                    Submit
                  </CButton>
                </CForm>
              </CModalBody>
            </div>
          </CModal>
        </div>
      </CCardBody>
      <CModal
        id="timeBox"
        size="lg"
        alignment="center"
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
        }}
        className="custom-modal-width"
      >
        <CModalHeader id="timeHeader">
          <CModalTitle style={{ color: 'white' }}>Timer Modal</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {timerData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Start Time</th>
                    <th scope="col">End Time</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time Spent (hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {timerData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.StartTime || 'N/A'}</td>
                      <td>{entry.EndTime || 'N/A'}</td>
                      <td>{entry.Date_Of_Entry || 'N/A'}</td>
                      <td>{entry.Time_Spent || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No records to display</p>
          )}
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default AddTimeLog
