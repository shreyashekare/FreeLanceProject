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

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

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
            const response = await axios.get(`${USER_API_ENDPOINT}getAllActivities2`)
            const data = response.data.data

            const revisedData = data.filter((activity) => activity.Assign_For_Testing === '1')
            setReports(revisedData)
            setFilteredReports(revisedData)
            setModifiedData(revisedData)

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
          const response = await axios.get(`${USER_API_ENDPOINT}getAllActivities2`)
          const data = response.data.data.reverse()

          const revisedData = data.filter((activity) => activity.Assign_For_Testing === '1')
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

  const handleSwitchChange = async (Activity_ID, checked, Project_ID) => {
    if (checked === true) {
      const time = new Date().toLocaleTimeString()
      setStartTime(time)
      alert(time)
      setCompleteTime('')
    }
    setTimers((prevTimers) => {
      const newTimers = { ...prevTimers }
      if (checked) {
        const now = new Date()
        newTimers[Activity_ID] = {
          isChecked: true,
          startTime: now.toISOString(),
          elapsedTime: 0,
        }
        localStorage.setItem('timers', JSON.stringify(newTimers))
      } else {
        delete newTimers[Activity_ID]
        localStorage.setItem('timers', JSON.stringify(newTimers))
      }
      return newTimers
    })

    if (checked === false) {
      const Date_Of_Entry = new Date().toLocaleDateString()
      const endTime = new Date().toLocaleTimeString()
      setEndTime(endTime)

      // Access the updated timer state after the state update
      const updatedTimers = JSON.parse(localStorage.getItem('timers'))
      const elapsedTimeInSeconds = updatedTimers[Activity_ID]?.elapsedTime || 0
      const elapsedTimeInHours = (elapsedTimeInSeconds / 3600).toFixed(2) // Convert to hours and format to 2 decimal places
      setCompleteTime(elapsedTimeInHours)
      const data = await axios.post(`${USER_API_ENDPOINT}addTimerData`, {
        Activity_ID,
        AddedBy_EmployeeID: userID,
        Time_Spent: elapsedTimeInHours, // Send the elapsed time in hours
        Date_Of_Entry,
        EndTime: endTime,
        StartTime: newStartTime,
      })
      console.log('Entered Date', data)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers }
        Object.keys(newTimers).forEach((activityId) => {
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
  }
  const handleDescription = async (id) => {
    // setTaskStatus(Status)
    setCKvisible(true)
  }

  const getTimeX = async (id, assignedTime) => {
    try {
      if (userDesignation !== 3) {
        const response = await axios.get(`${USER_API_ENDPOINT}getTimeTracking3/${id}`)
        console.log('This is response', response)
        const newData = response.data.data

        const newData2 = response.data.id
        console.log('This is new data', newData)
        setTImeLogged(newData.time_Logged)
        setActivityTime(newData.Time_remaining)
        setIssue(newData2.Activity_ID)
        SetTimeSpent1((pre) => {
          SetTimeSpent2(pre)
          return newData.Time_spent
        })
        setTimeSpent(newData.Time_spent)
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
        const newData2 = response.data.id
        console.log('This is new data', newData2)
        setTImeLogged(newData.time_Logged)
        setActivityTime(newData.Time_remaining)
        setIssue(newData2.Activity_ID)
        setTimeSpent(newData.Time_spent)
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
  const handleSubmit1 = async () => {
    try {
      if (!validateForm()) {
        return
      } else {
        if (userDesignation !== 2) {
          const data = await axios.post(`${USER_API_ENDPOINT}addTimeTracking`, {
            Allotted_time: assignedTime,
            Time_spent: timeSpent,
            Time_remaining: activityTime - timeSpent,
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
          const data = await axios.post(`${USER_API_ENDPOINT}addTimeTracking`, {
            Start_Date: dateTime,
            Work_Description: Work_Description,
            Time_spent: timeSpent,
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
          // await getNewStatus(project_ID)
          await fetchData()
          setVisibleEdit(false)
          resetForm()
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

  const handleAssignToTester = async (id, isChecked) => {
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
          <table
            className={`data-table${
              userDesignation === 1 ? '3X' : userDesignation !== 2 ? '' : '2'
            }`}
          >
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Project&nbsp;Name</th>
                <th>Activity&nbsp;Name</th>
                <th>Status</th>
                <th>Assigned Hours</th>
                {userDesignation !== 1 ? <th>Timer</th> : <th style={{ display: 'none' }}></th>}
                {userDesignation !== 2 && <th>Assign for testing</th>}
                {userDesignation === 1 ? <th>Time Tracking Logs</th> : <th>Time Tracking</th>}
              </tr>
            </thead>
            <tbody>
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No records available
                  </td>
                </tr>
              ) : (
                currentReports.map((activities, index) => {
                  const timer = timers[activities.id] || {}
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: getStatusColor(activities.Activity_Status),
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{activities.projectPlanning.project_name}</td>
                      <td>{activities.project_modules_activities}</td>
                      <td>
                        {activities.Activity_Status === 'Completed'
                          ? 'Assigned For Testing'
                          : activities.Activity_Status || 'Not Started Yet'}
                      </td>
                      <td>{activities.assigned_hrs || 'NA'}</td>
                      {userDesignation !== 1 ? (
                        <td style={{ textAlign: 'center', padding: '20px' }}>
                          <div style={{ display: 'inline-block', textAlign: 'center' }}>
                            <CFormSwitch
                              onChange={(event) =>
                                handleSwitchChange(
                                  activities.id,
                                  event.target.checked,
                                  activities.Project_ID,
                                )
                              }
                              className={`form-switch-lg ${timer.isChecked ? 'text-primary' : ''}`}
                              style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                // backgroundColor: '#f8f9fa',
                                borderRadius: '20px',
                                border: '1px solid #ced4da',
                                padding: '10px',
                                width: '40px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                              }}
                              size="lg"
                              id={`formSwitchCheckDefaultNormal-${activities.id}`}
                              checked={!!timer.isChecked}
                            />
                          </div>
                          <div
                            style={{
                              marginTop: '10px',
                              fontSize: '14px',
                              color: '#6c757d',
                            }}
                          >
                            <h6
                              style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#495057',
                                marginBottom: '5px',
                              }}
                            >
                              Timer
                            </h6>
                            <span
                              style={{
                                backgroundColor: '#e9ecef',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              {formatTime(timer.elapsedTime || 0)}
                            </span>
                          </div>
                        </td>
                      ) : (
                        <td style={{ display: 'none' }}></td>
                      )}
                      {userDesignation !== 2 && (
                        <td>
                          <CFormSwitch
                            onChange={(event) => {
                              const isChecked = event.target.checked
                              handleAssignToTester(
                                activities.id,
                                activities.projectPlanning.id,
                                isChecked ? 1 : 0,
                              )
                            }}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                            size="lg"
                            id="formSwitchCheckDefaultNormal"
                            checked={activities.Assign_For_Testing === '1'}
                          />
                        </td>
                      )}
                      {userDesignation !== 1 ? (
                        <td>
                          <CButton
                            className="btn"
                            id="CK1"
                            onClick={() => handleClick2(activities.id, activities.assigned_hrs)}
                          >
                            +
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px', width: '48px' }}
                            onClick={() => handleDescription(activities.id)}
                          >
                            <CIcon icon={cilPen} className="me-2" size="lg" />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px', width: '48px' }}
                            onClick={() => handleTimeLine(activities.id)}
                          >
                            <CIcon icon={cilCalendarCheck} className="me-2" size="lg" />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleIssueTimeLine(activities.id)}
                          >
                            <BugReportIcon />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleIssueSolvedTimeLine(activities.id)}
                          >
                            <TaskIcon />
                          </CButton>
                        </td>
                      ) : (
                        <td>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px', width: '48px' }}
                            onClick={() => handleDescription(activities.id)}
                          >
                            <CIcon icon={cilPen} className="me-2" size="lg" />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px', width: '48px' }}
                            onClick={() => handleTimeLine(activities.id)}
                          >
                            <CIcon icon={cilCalendarCheck} className="me-2" size="lg" />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleIssueTimeLine(activities.id)}
                          >
                            <BugReportIcon />
                          </CButton>
                          <CButton
                            className="btn"
                            id="CK1"
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleIssueSolvedTimeLine(activities.id)}
                          >
                            <TaskIcon />
                          </CButton>
                        </td>
                      )}
                    </tr>
                  )
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
          </div>
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
                  <CButton id="TimerButton" onClick={toggleModal}>
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
                  <div>
                    <label
                      htmlFor="activity-type"
                      style={{
                        marginRight: '4px',
                        fontSize: '15px',
                        fontWeight: 'bold',
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
            id="timeBox"
            size="sm"
            alignment="center"
            visible={modalVisible}
            onClose={toggleModal}
          >
            <CModalHeader id="timeHeader">
              <CModalTitle style={{ color: 'white' }}>Timer Modal</CModalTitle>
            </CModalHeader>
            <CModalBody>This is a small, centered modal.</CModalBody>
            {/* <CModalFooter>
              <CButton color="secondary" onClick={toggleModal}>
                Close
              </CButton>
            </CModalFooter> */}
          </CModal>

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
                      <h2
                        style={{
                          marginRight: '4px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        Issue description *{' '}
                      </h2>
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
                      onChange={handleEditorChange}
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
                  {userDesignation === 2 &&
                  (taskStatus === 'Completed' ||
                    taskStatus === 'In Review' ||
                    taskStatus === 'Issue/Bug Found' ||
                    taskStatus === 'Issue Assigned') ? (
                    <div className="formFooter">
                      <CFormLabel>
                        <b>Status *</b>
                      </CFormLabel>
                      <CFormSelect
                        id="status-dropdown"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="Issue Assigned">Issue Assigned</option>
                        <option value="Closed">Closed</option>
                        <option value="In Review">Testing</option>
                      </CFormSelect>
                    </div>
                  ) : (
                    ' '
                  )}
                </CForm>
              </CModalBody>
            </div>
          </CModal>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default AddTimeLog
