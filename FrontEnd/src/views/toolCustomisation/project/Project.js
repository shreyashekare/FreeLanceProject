import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CFormSwitch,
  CProgress,
  CProgressStacked,
} from '@coreui/react'
import {
  cilArrowTop,
  cilCalendarCheck,
  cilChevronBottom,
  cilChevronTop,
  cilPen,
  cilDescription,
  cilTask,
  cilAvTimer,
  cilX,
} from '@coreui/icons'
import React, { useCallback, useRef } from 'react'
import './Project.css'
import Card from 'react-bootstrap/Card'
import styles from './Project.module.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { USER_API_ENDPOINT } from 'src/constants'
import CIcon from '@coreui/icons-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import BugReportIcon from '@mui/icons-material/BugReport'
import TaskIcon from '@mui/icons-material/Task'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'

import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CFormSelect,
} from '@coreui/react'
import Swal from 'sweetalert2'
import AssignTask from '../assignTask/AssignTask'
import PurchaseOrder from '../purchaseOrder/PurchaseOrder'
import { Button } from '@coreui/coreui'
import { info } from 'sass'
import { CardBody } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
const Project = () => {
  const [timeSpent, setTimeSpent] = useState('0')
  const [timeRemaining, setTimeRemaining] = useState('')
  const totalTime = 2 * 24 // assuming the original estimate is 2 days (in hours)
  let time
  const [total, setTotal] = useState('')

  // const handleTimeSpentChange = (e) => {
  //   setTimeSpent(e.target.value)
  // }
  const editorRef = useRef(null)

  const handleTimeRemainingChange = (e) => {
    setTimeRemaining(e.target.value)
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/users/octocat')
      .then((response) => response.json())
      .then((data) => setUser(data))
  }, [])

  const spent = parseFloat(timeSpent) || 0
  const remaining = parseFloat(timeRemaining) || 0
  const loggedTime = Math.min(spent, totalTime)
  const remainingTime = Math.max(0, totalTime - spent)

  const progressLogged = (loggedTime / totalTime) * 100
  const progressRemaining = (remainingTime / totalTime) * 100

  const [status, setStatus] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [Data, setData] = useState([])
  let Name

  const [StartDate, setStartDate] = useState('')
  const [EndDate, setEndDate] = useState('')
  const [visibleUpdate_projectPlanning, setVisibleUpdate_projectPlanning] = useState(false)
  const [visible_assignTask, setVisible_assignTask] = useState(false)
  const [validated, setValidated] = useState(false)
  const [updateToast, setUpdateToast] = useState(false)
  const [projectPlanning_data, setProjectPlanning_data] = useState([])
  const [search, setSearch] = useState('')
  const [filterData, setfilterData] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectPlanning_file, setProjectPlanning_file] = useState([])
  const [removedAttachments, setRemovedAttachments] = useState([])
  const [selected_purchaseOrder_Id, setSelected_purchaseOrder_Id] = useState('')
  const [purchaseOrder_ToUpdate, setPurchaseOrder_ToUpdate] = useState({})
  const [projectPlanning_to_assign, setProjectPlanning_to_assign] = useState({})
  const [activeEmployee, setActiveEmployee] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [assignedEmployee, setAssignedEmployee] = useState('')
  const [assignedHrs, setAssignedHrs] = useState('')
  const [expandModule, setExpandModule] = useState([])
  const [expandTask, setExpandTask] = useState([])
  const [expandSubTask, setExpandSubTask] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [cKvisible, setCKvisible] = useState(false)
  const [tasKvisible, settasKvisible] = useState(false)
  const [timelineData, setTimelineData] = useState([])
  const [workDetails, setWorkDetails] = useState('')
  const [newActivityID, setNewID] = useState()
  const [activityTime, setActivityTime] = useState()
  const [errors, setErrors] = useState([])
  const [Description3, setDescription3] = useState([''])
  const [projectNames, setProjectNames] = useState([])

  ////////////////////////////////// CK Modal ////////////////////
  const [editorContent, setEditorContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [assignedTime, setTime] = useState('')
  const [activityID, setActivityID] = useState('')
  const [activityID2, setActivityID2] = useState('')
  const [allDescription, setAlldescription] = useState([])
  const [employeeID, setEmpID] = useState()
  const [Activity_Type, setActivityType] = useState('')
  const [toggleModule, setToggleModule] = useState(false)
  const [userModule, setUserModule] = useState([])
  const [modifiedData, setModifiedData] = useState([])
  const [Project_ID, setProjectId] = useState('')
  const [Priority, setPriority] = useState('')
  const [activityCounts, setActivityCounts] = useState({
    'NOT STARTED': 0,
    'IN PROGRESS': 0,
    PENDING: 0,
    COMPLETED: 0,
    'IN REVIEW': 0,
    'ISSUE/BUG FOUND': 0,
    CLOSED: 0,
  })

  const [completeTime, setCompleteTime] = useState([''])
  const [visibleActivitiesDetails, setVisibleActivities] = useState(false)

  const [activitiesByStatus, setActivitiesByStatus] = useState({
    'NOT STARTED': [],
    'IN PROGRESS': [],
    PENDING: [],
    COMPLETED: [],
    'IN REVIEW': [],
    'ISSUE/BUG FOUND': [],
    CLOSED: [],
  })

  const handleCloseModal = () => {
    setCKvisible(false)
    setSuccessMessage('')
  }
  let userID
  let userDesignation
  const [csrfTokenX, setCsrfToken] = React.useState('')

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setEditorContent(data)

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  let fName = ParsedData.firstName
  let lName = ParsedData.lastName
  let mName = ParsedData.midName
  let Naam = fName + ' ' + mName + ' ' + lName
  let fullName = fName + ' ' + mName + ' ' + lName
  console.log('EmployeeID', ParsedData.id)
  userID = ParsedData.id
  userDesignation = ParsedData.designation_id
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

  const [modalVisible, setModalVisible] = useState(false)

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

  const [timerData, setTimerData] = useState([])

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

  const [taskStatus, setTaskStatus] = useState(' ')

  const handleClick = (id, employeeID, Status) => {
    alert(Status)
    setEmpID(employeeID)
    setTaskStatus(Status)
    setVisibleEdit(true)
    setActivityID(id)
  }

  const handleSubmit1 = async (Activity_Status, userDesignation) => {
    try {
      // Check if editorContent is empty

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
          activity_ID: activity_id,
          userDesignation: userDesignation,
          AddedBy_EmployeeID: userID,
          Activity_Status: Activity_Status,
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

  // Function to toggle the expanded state of an item
  const toggleReadMore = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems]
      newExpandedItems[index] = !newExpandedItems[index]
      return newExpandedItems
    })
  }

  const handleClear = () => {
    setDateTime('')
  }

  const [modules, setModules] = useState([
    {
      modules: '',
      tasks: [
        {
          task: '',
          task_planned_startDate: '',
          task_planned_endDate: '',
          task_planned_Hrs: '',
          task_actual_startDate: '',
          task_actual_endDate: '',
          task_actual_hrs: '',
          subTasks: [
            {
              subTask: '',
              subTask_planned_startDate: '',
              subTask_planned_endDate: '',
              subTask_planned_Hrs: '',
              subTask_actual_startDate: '',
              subTask_actual_endDate: '',
              subTask_actual_hrs: '',
              activities: [
                {
                  activities: '',
                  activities_planned_startDate: '',
                  activities_planned_endDate: '',
                  activities_planned_Hrs: '',
                  activities_actual_startDate: '',
                  activities_actual_endDate: '',
                  activities_actual_hrs: '',
                },
              ],
            },
          ],
        },
      ],
      planned_startDate: '',
      planned_endDate: '',
      planned_Hrs: '',
      actual_startDate: '',
      actual_endDate: '',
      actual_hrs: '',
    },
  ])
  const [activityName, setActivityNames] = useState([])

  useEffect(() => {
    if (userDesignation === 3) {
      const Project = async (id) => {
        try {
          const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data4/${id}`)
          setData(projectData.data)
          setModifiedData(projectData.data)
          setStartDate(projectData.data)
          const projects = projectData.data

          console.log(projectData)
          const projectNames = projects.map((project) => ({
            id: project.id,
            name: project.project_name,
          }))
          setProjectNames(projectNames.reverse())

          countActivities(projects)
          console.log('Length of data is:', projectData.data.length)
        } catch (error) {
          console.log(error)
          setData('')
        }
      }
      Project(userID)
    } else if (userDesignation === 2) {
      const Project = async () => {
        try {
          const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data`)

          const projects = projectData.data

          setData(projects)
          setModifiedData(projects)

          const projectNames = projects.map((project) => ({
            id: project.id,
            name: project.project_name,
          }))
          setProjectNames(projectNames)
          countActivities(projects)

          // Extract activity names

          // Logging for debugging
          // Assuming you have a state called activityNames
        } catch (error) {
          console.error('Error fetching project data:', error)
        }
      }
      Project()
    } else {
      const Project = async () => {
        try {
          const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data`)

          const projects = projectData.data

          setData(projects)
          setModifiedData(projects)

          const projectNames = projects.map((project) => ({
            id: project.id,
            name: project.project_name,
          }))
          setProjectNames(projectNames)
          countActivities(projects)

          // Extract activity names

          // Logging for debugging
          // Assuming you have a state called activityNames
        } catch (error) {
          console.error('Error fetching project data:', error)
        }
      }
      Project()
    }
  }, [userID])

  const Project = async () => {
    try {
      const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data`)

      // Assuming the response data is an array of projects
      const projects = projectData.data

      // Set the entire response data if needed
      setData(projects)
      setModifiedData(projects)

      const projectNames = projects.map((project) => ({
        id: project.id,
        name: project.project_name,
      }))
      setProjectNames(projectNames)
      countActivities(projects)

      // Logging for debugging
      console.log(projectData)
      console.log('Length of data is:', projects.length)
      // console.log("This is the required ID", projects[0]?.id);
    } catch (error) {
      console.error('Error fetching project data:', error)
    }
  }
  const Project2 = async (id) => {
    try {
      const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data4/${id}`)
      setData(projectData.data)
      setModifiedData(projectData.data)
      setStartDate(projectData.data)
      const projects = projectData.data

      console.log(projectData)
      const projectNames = projects.map((project) => ({
        id: project.id,
        name: project.project_name,
      }))
      setProjectNames(projectNames)

      countActivities(projects)
      console.log('Length of data is:', projectData.data.length)
    } catch (error) {
      console.log(error)
      setData('')
    }
  }

  const countActivities = (projects) => {
    const counts = {
      'NOT STARTED': 0,
      'IN PROGRESS': 0,
      PENDING: 0,
      COMPLETED: 0,
      'IN REVIEW': 0,
      'ISSUE/BUG FOUND': 0,
      CLOSED: 0,
    }

    const activitiesByStatus = {
      'NOT STARTED': [],
      'IN PROGRESS': [],
      PENDING: [],
      COMPLETED: [],
      'IN REVIEW': [],
      'ISSUE/BUG FOUND': [],
      CLOSED: [],
    }

    projects.forEach((project) => {
      project.project_planning_moduleDetails.forEach((module) => {
        module.projectPlanning_module_tasks_details.forEach((task) => {
          task.projectPlanning_task_subtasks_details.forEach((subTask) => {
            subTask.projectPlanning_subTasks_Activities_details.forEach((activity) => {
              let status = activity.Activity_Status
                ? activity.Activity_Status.toUpperCase()
                : 'NOT STARTED'

              if (counts[status] !== undefined) {
                counts[status]++
                activitiesByStatus[status].push(activity.project_modules_activities)
              }
            })
          })
        })
      })
    })

    setActivityCounts(counts)
    setActivitiesByStatus(activitiesByStatus) // Add this line
  }

  const fetch_projectPlanning_data_to_assign = async (id) => {
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}project_planning_data_for_AssignTask/${id}}`,
      )
      setProjectPlanning_to_assign(response.data)
      setUserModule(response.data.project_planning_moduleDetails)
      // console.log(JSON.stringify(response.data) + 'table dataaaaaaaaaa')
      console.log(
        'ACTIVITY KI ID',
        response.data.project_planning_moduleDetails.projectPlanning_subTasks_Activities_details.id,
      )
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }

  const [project_ID, setProjectID] = useState()
  const hadnleAssignTask = (id) => {
    setProjectID(id)
    fetch_projectPlanning_data_to_assign(id)
    setVisible_assignTask(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return ''
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return date.toLocaleDateString('en-US', options)
  }
  const updateAssignedHrs = (activitiesId, assignedHrs) => {
    console.log('activities id', activitiesId)
    fetch(`${USER_API_ENDPOINT}updateAssignedhrs/${activitiesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignedHrs }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data) // Handle success response
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
      })
  }
  const handleAssignedHrs = (e, activitiesId) => {
    const newValue = e.target.value
    updateAssignedHrs(activitiesId, newValue)
  }
  const getAssignedEmployee = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getEmployeeName/${id}`)
      const { firstName, lastName } = response.data.empName

      setFirstName(firstName)
      setLastName(lastName)

      console.log('EmployeeName', response)
    } catch (error) {
      console.error('Error fetching employee data', error)
    }
  }

  ///////////////////////////////////////// Expand Functionality start /////////////////////////////////////////////
  const HandleModuleExpand = (index) => {
    const updatedExpandModule = [...expandModule]
    updatedExpandModule[index] = !updatedExpandModule[index]
    setExpandModule(updatedExpandModule)
  }

  const HandleTaskExpand = (index) => {
    const updateExpandTask = [...expandTask]
    updateExpandTask[index] = !updateExpandTask[index]
    setExpandTask(updateExpandTask)
  }

  const HandleSubTaskExpand = (index) => {
    const updateExpandSubTask = [...expandSubTask]
    updateExpandSubTask[index] = !updateExpandSubTask[index]
    setExpandSubTask(updateExpandSubTask)
  }

  const [Work_Description, setWorkDescription] = useState('')

  useEffect(() => {
    axios
      .get(`${USER_API_ENDPOINT}getActiveEmployee`)
      .then((res) => {
        console.log('Active Data', res.data.data)
        setActiveEmployee(res.data.data || []) // Ensure it's an array
      })
      .catch((error) => {
        console.error('Error fetching active employees', error)
        setActiveEmployee([]) // Set to an empty array in case of error
      })
  }, [])
  const [Description, setDescription] = useState([''])
  const [Description2, setDescription2] = useState([''])
  const [IssueDescription, setIssueDescription] = useState([])
  const [currentUser, setCurrentUser] = useState(' ')

  const handleWorkDetails = async (id) => {
    settasKvisible(true) // Assuming this is correctly defined elsewhere

    // Reset state before fetching new data
    setDescription3([])
    setDescription2([])
    setDescription([])
    setIssueDescription([])
    setAlldescription([])
    setCurrentUser(null)

    try {
      const [testerIssueResponse, data3Response, timeTrackingResponse, workDescriptionResponse] =
        await Promise.all([
          axios.get(`${USER_API_ENDPOINT}getTesterIssues/${id}`),
          axios.get(`${USER_API_ENDPOINT}getChangeLog/${id}`),
          axios.get(`${USER_API_ENDPOINT}getTimeTracking/${id}`),
          axios.get(`${USER_API_ENDPOINT}getWorkDescription/${id}`),
        ])

      // Logging the responses to check their structure
      console.log('data3Response:', data3Response)
      console.log('timeTrackingResponse:', timeTrackingResponse)
      console.log('workDescriptionResponse:', workDescriptionResponse)

      // Check each response individually
      const testerData = testerIssueResponse.status === 200 ? testerIssueResponse.data.data : []
      const data3 = data3Response.status === 200 ? data3Response.data.data : []
      const timeTracking = timeTrackingResponse.status === 200 ? timeTrackingResponse.data.data : []
      const workDescription =
        workDescriptionResponse.status === 200 ? workDescriptionResponse.data.data : []

      // Extracting assigned_Employee dynamically
      let assignedEmployee = null
      if (Array.isArray(data3) && data3.length > 0) {
        // Choose the last item in data3 if it exists
        assignedEmployee = data3[data3.length - 1].assigned_Employee
      }

      // Set descriptions based on successful responses
      if (
        testerIssueResponse.status === 200 &&
        data3Response.status === 200 &&
        timeTrackingResponse.status === 200 &&
        workDescriptionResponse.status === 200
      ) {
        setIssueDescription(testerIssueResponse)
        setDescription3(data3)
        setDescription2(timeTracking)
        setDescription(workDescription)

        if (assignedEmployee) {
          setCurrentUser(assignedEmployee)
        }

        const allDescriptions = [
          ...testerData.map((item) => ({
            ...item,
            type: 'Description4',
            dateTime: item.createdAt,
          })),
          ...timeTracking.map((item) => ({
            ...item,
            type: 'Description2',
            dateTime: item.createdAt,
          })),
          ...workDescription.map((item) => ({
            ...item,
            type: 'Description',
            dateTime: item.createdAt,
          })),
          ...data3.map((item) => ({
            ...item,
            type: 'Description3',
            dateTime: item.createdAt,
          })),
        ]

        allDescriptions.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
        setAlldescription(allDescriptions)
      } else {
        // Clear any existing descriptions if at least one request failed
        setIssueDescription([])
        setDescription3([])
        setDescription2([])
        setDescription([])
        setAlldescription([])
      }
    } catch (error) {
      // Handle errors here (e.g., show an error message)
      console.error('Error fetching data:', error)
      // Optionally, set a default state or handle the error in another way
    }
  }

  const [expandedItems, setExpandedItems] = useState(Array(Description.length).fill(false))

  const handleClick2 = async (id, TIME) => {
    setVisibleEdit(true)
    setTime(TIME)
    setActivityID2(id)
    await getTimeX(id, TIME)
  }
  const [newStatus, setNewStatus] = useState(' ')
  const [TimeSpent, SetTimeSpent1] = useState('')
  const [TimeSpent2, SetTimeSpent2] = useState(0)
  const [time_Logged, setTImeLogged] = useState()
  const [issue, setIssue] = useState()

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
  const resetForm = () => {
    setTimeSpent('')
    setDateTime('')
    setWorkDescription('')
    setStatus('')
    setErrors({})
  }

  const getNewStatus = async (id) => {
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}project_planning_data_for_AssignTask/${id}}`,
      )
      setProjectPlanning_to_assign(response.data)
      setUserModule(response.data.project_planning_moduleDetails)
      // console.log(JSON.stringify(response.data) + 'table dataaaaaaaaaa')
      console.log(
        'ACTIVITY KI ID',
        response.data.project_planning_moduleDetails.projectPlanning_subTasks_Activities_details.id,
      )
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }
  const handleSubmit = async () => {
    alert('here')
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
          handleAssignedActivities(selectedProjectID)
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
          handleAssignedActivities(selectedProjectID)
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
  const combinedDescriptions = [...Description, ...Description2]
  const calculateProgress = (time_Logged) => {
    const percentage = (time_Logged / assignedTime) * 100
    return Math.min(percentage, 100)
  }

  const handleCancel = () => {
    resetForm()
    setVisibleEdit(false)
  }

  const [expandedItems2, setExpandedItems2] = useState({})

  const toggleReadMore2 = (index) => {
    setExpandedItems2((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
  const [selectedProjectID, setSelectedProjectID] = useState('')

  const switchToggle = (e) => {
    setToggleModule(e.target.checked)
    if (e.target.checked) {
      const filterData = projectPlanning_to_assign.project_planning_moduleDetails
        .map((module) => ({
          ...module,
          projectPlanning_module_tasks_details: module.projectPlanning_module_tasks_details
            .map((task) => ({
              ...task,
              projectPlanning_task_subtasks_details: task.projectPlanning_task_subtasks_details
                .map((subtask) => ({
                  ...subtask,
                  projectPlanning_subTasks_Activities_details:
                    subtask.projectPlanning_subTasks_Activities_details.filter(
                      (activity) => activity.assignedTo_employeeID === userID,
                    ),
                }))
                .filter(
                  (subtask) => subtask.projectPlanning_subTasks_Activities_details.length > 0,
                ),
            }))
            .filter((task) => task.projectPlanning_task_subtasks_details.length > 0),
        }))
        .filter((module) => module.projectPlanning_module_tasks_details.length > 0)

      setUserModule(filterData)
    } else {
      setUserModule(projectPlanning_to_assign.project_planning_moduleDetails)
    }
  }
  const [buttonDisbaled, setEnterButtonDisabled] = useState(true)
  const [defaultValue, setDefaultValue] = useState()
  const handleReset = () => {
    setEnterButtonDisabled(true)
    setDefaultValue('All Projects')
    if (userDesignation !== 3) {
      Project()
    } else {
      Project2(userID)
    }
  }

  async function handleFilterByProject(value, ID) {
    setProjectId(ID)
    setDefaultValue(value)

    setEnterButtonDisabled(false)
    if (ID === '') {
      setData(modifiedData)
    } else {
      try {
        setSelectedProjectID(ID)
        const response = await axios.get(`${USER_API_ENDPOINT}project_planning_data/${ID}`)
        const data = response.data

        console.log(data) // Log the response data to inspect its structure

        // Normalize the data to always be an array
        const projects = Array.isArray(data) ? data : [data]

        setData(projects)

        countActivities(projects)
      } catch (error) {
        console.error('Error fetching project data:', error)
      }
    }
  }

  const switchToggle2 = (value) => {
    if (value) {
      let filterData
      switch (value) {
        case 'Completed':
          filterData = filterByStatus('Completed')
          break
        case 'Closed':
          filterData = filterByStatus('Closed')
          break
        case 'In Review':
          filterData = filterByStatus('In Review')
          break

        case 'Others':
          filterData = filterByOtherStatus(['Completed', 'Closed', 'In Review', 'Issue/Bug Found'])
          break
        case 'Issue/Bug Found':
          filterData = filterByStatus('Issue/Bug Found')
          break
        case 'Reset':
        default:
          filterData = projectPlanning_to_assign.project_planning_moduleDetails
          break
      }
      setUserModule(filterData)
    } else {
      setUserModule(projectPlanning_to_assign.project_planning_moduleDetails)
    }
  }

  const filterByStatus = (status) => {
    return projectPlanning_to_assign.project_planning_moduleDetails
      .map((module) => ({
        ...module,
        projectPlanning_module_tasks_details: module.projectPlanning_module_tasks_details
          .map((task) => ({
            ...task,
            projectPlanning_task_subtasks_details: task.projectPlanning_task_subtasks_details
              .map((subtask) => ({
                ...subtask,
                projectPlanning_subTasks_Activities_details:
                  subtask.projectPlanning_subTasks_Activities_details.filter(
                    (activity) => activity.Activity_Status === status,
                  ),
              }))
              .filter((subtask) => subtask.projectPlanning_subTasks_Activities_details.length > 0),
          }))
          .filter((task) => task.projectPlanning_task_subtasks_details.length > 0),
      }))
      .filter((module) => module.projectPlanning_module_tasks_details.length > 0)
  }

  const filterByOtherStatus = (excludedStatuses) => {
    return projectPlanning_to_assign.project_planning_moduleDetails
      .map((module) => ({
        ...module,
        projectPlanning_module_tasks_details: module.projectPlanning_module_tasks_details
          .map((task) => ({
            ...task,
            projectPlanning_task_subtasks_details: task.projectPlanning_task_subtasks_details
              .map((subtask) => ({
                ...subtask,
                projectPlanning_subTasks_Activities_details:
                  subtask.projectPlanning_subTasks_Activities_details.filter(
                    (activity) => !excludedStatuses.includes(activity.Activity_Status),
                  ),
              }))
              .filter((subtask) => subtask.projectPlanning_subTasks_Activities_details.length > 0),
          }))
          .filter((task) => task.projectPlanning_task_subtasks_details.length > 0),
      }))
      .filter((module) => module.projectPlanning_module_tasks_details.length > 0)
  }

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

  const scrollToTop = () => {
    const modalBody = document.querySelector('.c-modal-body') // Adjust the selector as per your modal structure

    if (modalBody) {
      modalBody.scrollTo({
        top: 0,
        behavior: 'smooth', // Optional: Adds smooth scrolling behavior
      })
    }
  }

  const [activityStatus, setActivityStatus] = useState('')

  const [activitiesData, setActivitiesData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [newActivityStatus, setnewActivityStatus] = useState([])
  const [projectData, setProjectData] = useState([])

  const handleAssignedActivities = async (id) => {
    setVisibleActivities(true)
    if (userDesignation === 1) {
      try {
        const data = await axios.get(`${USER_API_ENDPOINT}getActivitiesByProjectID/${id}`)
        const response = data.data.data.reverse()
        setActivitiesData(response)
        setUpdatedData(response)

        // Extracting all activity names
        const activityNames = response.map((activity) => activity.project_modules_activities)

        // Extracting all activity statuses and ensuring unique values
        const activityStatusSet = new Set(
          response.map((activity) =>
            activity.Activity_Status === '' ? 'Not Started Yet' : activity.Activity_Status,
          ),
        )
        const uniqueActivityStatus = Array.from(activityStatusSet)

        // Setting the activity names and unique statuses in the state
        setActivityNames(activityNames)
        setnewActivityStatus(uniqueActivityStatus)
      } catch (error) {
        console.error('Something went wrong', error)
      }
    } else if (userDesignation === 2) {
      try {
        const data = await axios.get(`${USER_API_ENDPOINT}getActivitiesForTester/${id}`)
        const newData = data.data.data
        const response = newData.reverse()
        setActivitiesData(response)
        setUpdatedData(response)

        // Extracting all activity names
        const activityNames = response.map((activity) => activity.project_modules_activities)

        // Extracting all activity statuses and ensuring unique values
        const activityStatusSet = new Set(
          response.map((activity) =>
            activity.Activity_Status === '' ? 'Not Started Yet' : activity.Activity_Status,
          ),
        )
        const uniqueActivityStatus = Array.from(activityStatusSet)

        // Setting the activity names and unique statuses in the state
        setActivityNames(activityNames)
        setnewActivityStatus(uniqueActivityStatus)
      } catch (error) {
        console.error('Something went wrong', error)

        // Check if the error response is a 400 and handle it
        if (error.response && error.response.status === 400) {
          setActivitiesData([])
        }
      }
    } else {
      try {
        // Replace with the actual employee ID value

        const data = await axios.get(
          `${USER_API_ENDPOINT}getActivitiesByProjectID2/${id}/${userID}`,
        )
        const response = data.data.data
        setActivitiesData(response)
        setUpdatedData(response)
        const activityNames = response.map((activity) => activity.project_modules_activities)

        // Extracting all activity statuses and ensuring unique values
        const activityStatusSet = new Set(
          response.map((activity) =>
            activity.Activity_Status === '' ? 'Not Started Yet' : activity.Activity_Status,
          ),
        )
        const uniqueActivityStatus = Array.from(activityStatusSet)

        // Setting the activity names and unique statuses in the state

        setnewActivityStatus(uniqueActivityStatus)
        // Setting the activity names in the state
        setActivityNames(activityNames)
      } catch (error) {
        console.error('Something went wrong:', error)
      }
    }
    const project = await axios.get(`${USER_API_ENDPOINT}getProjectDetails/${id}`)
    const data = project.data.data
    setProjectData(data)
  }

  const handleAssignToTester = async (id, project_ID, isChecked) => {
    // Use activityId and isChecked as needed
    console.log(`Activity ID: ${id}, Switch State: ${isChecked}, Name: ${fullName}`)

    const data = await axios.put(`${USER_API_ENDPOINT}assignToTester/${id}`, {
      Assign_For_Testing: isChecked,
      userID: userID,
      fullName: fullName,
    })
    console.log(data)
    handleAssignedActivities(project_ID)
  }
  const [activity_id, setActivityid] = useState('')

  const handleDescription = async (id, Activity_Status) => {
    alert(csrfTokenX)
    setActivityid(id)
    setTaskStatus(Activity_Status)
    setCKvisible(true)
  }

  const [chnageLog, setChangeLog] = useState([])
  const [testerLog, setTesterLog] = useState([])

  const [IssueVisible, setIssueVisible] = useState(false)
  const [solvedIssues, setIssueSolvedVisible] = useState(false)
  const [allChanges, setAllChanges] = useState([])
  const [workDescription, setWorkDescriptions] = useState([])

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
            item.AddedBy_EmployeeID === userID &&
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
  const [allSearchQuery, setAllSearchQuery] = useState('')
  const [searchFields, setSearchFields] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [lastSelectedFilter, setLastSelectedFilter] = useState('')

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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

  const Status = [
    'Not Started Yet',
    'In Progress',
    'Pending',
    'Assigned For Testing',
    'Closed',
    'In Review',
    'Issue/Bug Found',
  ]
  const handleFieldChange = (index, event) => {
    const values = [...searchFields]
    values[index][event.target.name] = event.target.value
    setSearchFields(values)
    setCurrentPage(1) // Reset to the first page on search
  }
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const getOptions = (field) => {
    switch (field) {
      case 'Project':
        return projectNames
      case 'Activity':
        return activityName
      case 'Status':
        return Status
      default:
        return ['No record to display']
    }
  }

  const filteredReports = activitiesData.filter((report) => {
    const activityName = report.project_modules_activities.toLowerCase()
    const status = report.Activity_Status ? report.Activity_Status.toLowerCase() : '' // Handle cases where Activity_Status might be null or undefined

    // Check if there is any report with status "Completed"
    const hasCompletedStatus = activitiesData.some(
      (item) => item.Activity_Status && item.Activity_Status.toLowerCase() === 'completed',
    )

    // Condition for "Assigned For Testing" status
    if (status === 'assigned for testing' && !hasCompletedStatus) {
      return false
    }

    const matchesAllSearch =
      activityName.includes(allSearchQuery.toLowerCase()) ||
      status.includes(allSearchQuery.toLowerCase())

    const matchesSpecificFields = searchFields.every(({ field, query }) => {
      switch (field) {
        case 'Activity':
          if (query === 'Select a Status') {
            return true // Show all records when "Select a Status" is chosen
          }
          return activityName.includes(query.toLowerCase())
        case 'Status':
          if (query === 'Select a Status') {
            return true // Show all records when "Select a Status" is chosen
          } else if (query === 'Not Started Yet') {
            return status === '' || status === null
          } else {
            return status === query.toLowerCase()
          }
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

  const reportsPerPage = 5
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(activitiesData.length / reportsPerPage)
  const handleAllSearchChange = (event) => {
    setAllSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }
  const handleDateChange = (event) => {
    const { name, value } = event.target
    setDateRange({ ...dateRange, [name]: value })
    setCurrentPage(1) // Reset to the first page on date change
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
  const addSearchField = (field) => {
    if (field) {
      setSearchFields([...searchFields, { field, query: 'Select a Status' }])
    }
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

  const colors = ['#0dcaf0']
  const fixedWidth = '200px'

  const handleStatusFilter2 = (status) => {
    setResetButtonDisabled(false)
    if (status === '') {
      setActivitiesData(updatedData)
    } else if (status === 'Not Started Yet') {
      const data = updatedData.filter((item) => item.Activity_Status === '')
      setActivitiesData(data)
    } else {
      const data = updatedData.filter((item) => item.Activity_Status === status)
      setActivitiesData(data)
    }
  }
  const [resetDisbaled, setResetButtonDisabled] = useState(true)

  const handleResetData = () => {
    setResetButtonDisabled(true)
    setActivitiesData(updatedData)
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
        formData.append('activity_ID', activity_id)

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

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong style={{ fontSize: '25px' }}>Projects</strong>
        </CCardHeader>
        <CCardBody className={styles.cardBody}>
          <div
            className="projectHeader"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              marginLeft: '10px',
            }}
          >
            <CFormSelect
              value={defaultValue}
              onChange={(e) => {
                const selectedProject = projectNames.find(
                  (project) => project.name === e.target.value,
                )
                if (selectedProject) {
                  handleFilterByProject(selectedProject.name, selectedProject.id)
                }
              }}
              style={{ marginRight: '10px' }}
            >
              <option value="">All Projects</option>
              {projectNames.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </CFormSelect>

            <CButton
              color="success"
              onClick={() => {
                handleAssignedActivities(selectedProjectID)
              }}
              disabled={buttonDisbaled}
            >
              Enter
            </CButton>
            <CButton style={{ marginLeft: '10px' }} onClick={handleReset} disabled={buttonDisbaled}>
              Reset
            </CButton>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              marginTop: '10px',
              scrollBehavior: 'smooth',
            }}
          >
            {[
              'NOT STARTED',
              'IN PROGRESS',
              'PENDING',
              'COMPLETED',
              'IN REVIEW',
              'ISSUE/BUG FOUND',
              'CLOSED',
            ].map((status) => (
              <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox} key={status}>
                <div className={styles.projectBox}>
                  <Card className={styles.projectCards}>
                    <Card.Title className={styles.projectName}>
                      {status === 'COMPLETED'
                        ? 'ASSIGNED FOR TESTING'
                        : status === 'IN REVIEW'
                        ? 'TESTING'
                        : status}
                      <span className={styles.circle}>{activityCounts[status]}</span>
                    </Card.Title>
                    <Card.Body
                      className={`cardBody ${styles.scrollableBody}`}
                      style={{ textAlign: 'center', marginTop: '5px' }}
                    >
                      {activitiesByStatus[status].length === 0 ? (
                        <p>No Activity for this status</p>
                      ) : (
                        <ul
                          key={`list-${status}`}
                          style={{
                            padding: 0,
                            margin: '0 auto',
                            display: 'inline-block',
                            textAlign: 'left',
                          }}
                        >
                          {activitiesByStatus[status].map((activity, index) => (
                            <li
                              style={{
                                padding: '6px',
                                listStyle: 'none',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                backgroundColor: colors[index % colors.length],
                                width: fixedWidth,
                              }}
                              key={index}
                            >
                              {activity}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </CCol>
            ))}
          </div>

          {/* ////////////////////////////////////// project cards //////////////////////////// */}

          <CModal
            fullscreen
            visible={visible_assignTask}
            onClose={() => setVisible_assignTask(false)}
          >
            <CModalHeader>
              <CModalTitle>Project Assignment Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <>
                <div>
                  <table style={{ width: '70%' }} className={styles.assignTask_projectDetails}>
                    <tr>
                      <th>Name of Project</th>
                      <th>File</th>
                    </tr>

                    <tr>
                      <td style={{ position: 'absolute', border: 'none' }}>
                        {projectPlanning_to_assign.project_name}
                      </td>

                      {projectPlanning_to_assign.project_planning_files ? (
                        <td>
                          <ol>
                            {projectPlanning_to_assign.project_planning_files.map((data, index) => (
                              <li key={index}>
                                <a
                                  style={{ width: '106px' }}
                                  href={`${USER_API_ENDPOINT}uploads/${data.project_file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View
                                </a>
                              </li>
                            ))}
                          </ol>
                        </td>
                      ) : (
                        <p>No purchase order details available.</p>
                      )}
                    </tr>
                  </table>
                </div>

                <div>
                  <h6 className="mb-4">Modules Details</h6>

                  <div className={styles.modules_color_box}>
                    <CButton
                      style={{
                        backgroundColor: 'floralwhite',
                        border: '1px solid black',
                        height: '20px',
                        marginRight: '5px',
                      }}
                    ></CButton>
                    Modules
                    <CButton
                      style={{
                        backgroundColor: 'antiquewhite',
                        border: '1px solid black',
                        height: '20px',
                        marginRight: '5px',
                      }}
                    ></CButton>
                    Tasks
                    <CButton
                      style={{
                        backgroundColor: 'aquamarine',
                        border: '1px solid black',
                        height: '20px',
                        marginRight: '5px',
                      }}
                    ></CButton>
                    Sub Tasks
                    <CButton
                      style={{
                        backgroundColor: 'rgba(0, 255, 255, 0.22)',
                        border: '1px solid black',
                        height: '20px',
                        marginRight: '5px',
                      }}
                    ></CButton>
                    Activities
                  </div>
                  {userDesignation === 3 ? (
                    <div id="toggleSection">
                      <p>Your Modules</p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            switchToggle(e)
                          }}
                          checked={toggleModule}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  ) : (
                    <div className="newFilter">
                      <div className="filterLabel">
                        <CFormLabel className="cLabel">
                          <b>Filter Modules By Status</b>
                        </CFormLabel>
                      </div>
                      <div className="statusFilter">
                        <CFormSelect
                          className="newSelect"
                          onChange={(e) => switchToggle2(e.target.value)}
                        >
                          {userDesignation === '1' ? (
                            <>
                              <option value="">Select a value</option>
                              <option value="Closed">Closed</option>
                              <option value="In Review">Testing</option>
                              <option value="Completed">Assigned For Testing</option>
                              <option value="Reset">Reset</option>
                            </>
                          ) : (
                            <>
                              <option value="">Select a value</option>
                              <option value="Closed">Closed</option>
                              <option value="In Review">Testing</option>
                              <option value="Completed">Assigned For Testing</option>
                              <option value="Others">Others</option>
                              <option value="Reset">Reset</option>
                            </>
                          )}
                        </CFormSelect>
                      </div>
                    </div>
                  )}

                  <br></br>

                  <table className={styles.assignTask_Table} style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th colSpan={5}></th>
                        <th colSpan={2}></th>
                        <th colSpan={4}></th>
                      </tr>
                      <tr>
                        <th style={{ width: '50px' }}>Sr.No.</th>
                        <th>Modules</th>

                        <th>Tasks</th>

                        <th> Sub Tasks</th>

                        <th>Activities</th>

                        <th>Assign To</th>
                        <th>Hrs</th>
                        <th colSpan={2}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userModule
                        ? userModule.map((data, index) => (
                            <React.Fragment key={index}>
                              {console.log('modules Data', data)}
                              <tr style={{ background: 'floralwhite' }}>
                                <td>{index + 1}</td>
                                <td colSpan={4}>{data.project_modules}</td>
                                <td>
                                  <b>Total Hrs</b>
                                </td>
                                <td>
                                  <b>
                                    {Number(
                                      data.projectPlanning_module_tasks_details
                                        .flatMap((taskDetail) =>
                                          taskDetail.projectPlanning_task_subtasks_details.flatMap(
                                            (subtaskDetail) =>
                                              subtaskDetail.projectPlanning_subTasks_Activities_details.reduce(
                                                (total, activity) =>
                                                  total + parseFloat(activity.assigned_hrs || 0),
                                                0,
                                              ),
                                          ),
                                        )
                                        .reduce((total, taskTotal) => total + taskTotal, 0)
                                        .toFixed(2),
                                    )}
                                  </b>
                                </td>
                                <td colSpan={2}>
                                  {!expandModule[index] ? (
                                    <CIcon
                                      className={styles.upDownBtn}
                                      icon={cilChevronBottom}
                                      onClick={() => HandleModuleExpand(index)}
                                    />
                                  ) : (
                                    <CIcon
                                      className={styles.upDownBtn}
                                      icon={cilChevronTop}
                                      onClick={() => HandleModuleExpand(index)}
                                    />
                                  )}
                                </td>
                              </tr>
                              {expandModule[index] && (
                                <>
                                  {data.projectPlanning_module_tasks_details
                                    .map((task) => ({
                                      ...task,
                                      projectPlanning_task_subtasks_details:
                                        task.projectPlanning_task_subtasks_details
                                          .map((subTask) => ({
                                            ...subTask,
                                            projectPlanning_subTasks_Activities_details:
                                              subTask.projectPlanning_subTasks_Activities_details.sort(
                                                (a, b) =>
                                                  (b.assignedTo_employeeID === userID) -
                                                  (a.assignedTo_employeeID === userID),
                                              ),
                                          }))
                                          .sort(
                                            (a, b) =>
                                              b.projectPlanning_subTasks_Activities_details.some(
                                                (activity) =>
                                                  activity.assignedTo_employeeID === userID,
                                              ) -
                                              a.projectPlanning_subTasks_Activities_details.some(
                                                (activity) =>
                                                  activity.assignedTo_employeeID === userID,
                                              ),
                                          ),
                                    }))
                                    .sort(
                                      (a, b) =>
                                        b.projectPlanning_task_subtasks_details.some((subTask) =>
                                          subTask.projectPlanning_subTasks_Activities_details.some(
                                            (activity) => activity.assignedTo_employeeID === userID,
                                          ),
                                        ) -
                                        a.projectPlanning_task_subtasks_details.some((subTask) =>
                                          subTask.projectPlanning_subTasks_Activities_details.some(
                                            (activity) => activity.assignedTo_employeeID === userID,
                                          ),
                                        ),
                                    )
                                    .map((task, taskIndex) => (
                                      <React.Fragment key={`${index}-${taskIndex}`}>
                                        <tr style={{ background: 'antiquewhite' }}>
                                          <td colSpan={2}>{`${index + 1}.${taskIndex + 1}`}</td>
                                          <td colSpan={6}>{task.project_modules_tasks}</td>
                                          <td>
                                            {!expandTask[taskIndex] ? (
                                              <CIcon
                                                className={styles.upDownBtn}
                                                icon={cilChevronBottom}
                                                onClick={() => HandleTaskExpand(taskIndex)}
                                              />
                                            ) : (
                                              <CIcon
                                                className={styles.upDownBtn}
                                                icon={cilChevronTop}
                                                onClick={() => HandleTaskExpand(taskIndex)}
                                              />
                                            )}
                                          </td>
                                        </tr>
                                        {expandTask[taskIndex] && (
                                          <>
                                            {task.projectPlanning_task_subtasks_details.map(
                                              (subTask, subTaskIndex) => (
                                                <React.Fragment
                                                  key={`${index}-${taskIndex}-${subTaskIndex}`}
                                                >
                                                  <tr
                                                    id="row2"
                                                    style={{
                                                      backgroundColor: 'aquamarine',
                                                    }}
                                                  >
                                                    <td colSpan={3}>{`${index + 1}.${
                                                      taskIndex + 1
                                                    }.${subTaskIndex + 1}`}</td>
                                                    <td colSpan={3}>
                                                      {subTask.project_modules_subTasks}
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                      {!expandSubTask[subTaskIndex] ? (
                                                        <CIcon
                                                          className={styles.upDownBtn}
                                                          icon={cilChevronBottom}
                                                          onClick={() =>
                                                            HandleSubTaskExpand(subTaskIndex)
                                                          }
                                                        />
                                                      ) : (
                                                        <CIcon
                                                          className={styles.upDownBtn}
                                                          icon={cilChevronTop}
                                                          onClick={() =>
                                                            HandleSubTaskExpand(subTaskIndex)
                                                          }
                                                        />
                                                      )}
                                                    </td>
                                                  </tr>

                                                  {expandSubTask[subTaskIndex] && (
                                                    <>
                                                      {/* Assigned Tasks Section */}
                                                      {subTask.projectPlanning_subTasks_Activities_details.some(
                                                        (activities) =>
                                                          activities.assignedTo_employeeID ===
                                                          userID,
                                                      ) && (
                                                        <>
                                                          {subTask.projectPlanning_subTasks_Activities_details.map(
                                                            (activities, activitiesIndex) =>
                                                              activities.Activity_Status ===
                                                                'Complete' && (
                                                                <React.Fragment
                                                                  key={`${index}-${taskIndex}-${subTaskIndex}-${activitiesIndex}`}
                                                                >
                                                                  <tr
                                                                    id="row3"
                                                                    style={{
                                                                      backgroundColor:
                                                                        'rgba(0, 255, 255, 0.22)',
                                                                    }}
                                                                  >
                                                                    <td colSpan={4}>{`${
                                                                      index + 1
                                                                    }.${taskIndex + 1}.${
                                                                      subTaskIndex + 1
                                                                    }.${activitiesIndex + 1}`}</td>
                                                                    <td
                                                                      colSpan={2}
                                                                      style={{
                                                                        width: '250px',
                                                                      }}
                                                                    >
                                                                      {
                                                                        activities.project_modules_activities
                                                                      }
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width: '150px',
                                                                      }}
                                                                    >
                                                                      <p
                                                                        name="assignedEmployee"
                                                                        value={
                                                                          activities.assignedTo_employeeID
                                                                        }
                                                                      >
                                                                        {activeEmployee
                                                                          .filter(
                                                                            (data) =>
                                                                              data.id ===
                                                                              activities.assignedTo_employeeID,
                                                                          )
                                                                          .map((data, idx) => (
                                                                            <option
                                                                              key={idx}
                                                                              value={data.id}
                                                                            >
                                                                              {`${data.firstName} ${data.midName} ${data.lastName}`}
                                                                            </option>
                                                                          ))}
                                                                      </p>
                                                                    </td>

                                                                    <td
                                                                      style={{
                                                                        width: '50px',
                                                                      }}
                                                                    >
                                                                      {activities.assigned_hrs +
                                                                        ' '}
                                                                      <b>
                                                                        {activities.Activity_Status.trim() ===
                                                                        ''
                                                                          ? '(Not Started)'
                                                                          : '(' +
                                                                            activities.Activity_Status +
                                                                            ')'}
                                                                      </b>
                                                                    </td>

                                                                    <td id="btnRow">
                                                                      {(userID ===
                                                                        activities.assignedTo_employeeID ||
                                                                        ((activities.Activity_Status ===
                                                                          'Completed' ||
                                                                          activities.Activity_Status ===
                                                                            'Closed' ||
                                                                          activities.Activity_Status ===
                                                                            'In Review' ||
                                                                          activities.Activity_Status ===
                                                                            'Issue/Bug Found') &&
                                                                          userDesignation ===
                                                                            2)) && (
                                                                        <CButton
                                                                          className="btn"
                                                                          onClick={() =>
                                                                            handleClick2(
                                                                              activities.assigned_hrs,
                                                                              activities.id,
                                                                            )
                                                                          }
                                                                          id="CK1"
                                                                        >
                                                                          +
                                                                        </CButton>
                                                                      )}

                                                                      <CButton
                                                                        style={{
                                                                          position: 'relative',
                                                                          left: '10px',
                                                                          width: '40px',
                                                                        }}
                                                                        className="btn"
                                                                        onClick={() =>
                                                                          handleClick(
                                                                            activities.id,
                                                                            activities.assignedTo_employeeID,
                                                                            activities.Activity_Status,
                                                                          )
                                                                        }
                                                                        id="CK2"
                                                                      >
                                                                        <div>
                                                                          {activities.Activity_Status ===
                                                                            'Completed' ||
                                                                          activities.Activity_Status ===
                                                                            'In Review' ||
                                                                          activities.Activity_Status ===
                                                                            'Issue/Bug Found' ||
                                                                          activities.Activity_Status ===
                                                                            'Closed' ? (
                                                                            <CIcon
                                                                              icon={cilDescription}
                                                                              className="me-2"
                                                                            />
                                                                          ) : (
                                                                            <CIcon
                                                                              icon={cilPen}
                                                                              className="me-2"
                                                                            />
                                                                          )}
                                                                          {/* Other content */}
                                                                        </div>
                                                                      </CButton>
                                                                      <CButton
                                                                        style={{
                                                                          position: 'relative',
                                                                          left: '20px',
                                                                          width: '40px',
                                                                        }}
                                                                        className="btn"
                                                                        id="CK3"
                                                                        onClick={() =>
                                                                          handleWorkDetails(
                                                                            activities.id,
                                                                          )
                                                                        }
                                                                      >
                                                                        <CIcon
                                                                          icon={cilCalendarCheck}
                                                                          className="me-2"
                                                                        />
                                                                      </CButton>
                                                                    </td>
                                                                  </tr>
                                                                </React.Fragment>
                                                              ),
                                                          )}
                                                        </>
                                                      )}

                                                      {subTask.projectPlanning_subTasks_Activities_details.map(
                                                        (activities, activitiesIndex) =>
                                                          activities.Activity_Status !== userID && (
                                                            <React.Fragment
                                                              key={`${index}-${taskIndex}-${subTaskIndex}-${activitiesIndex}`}
                                                            >
                                                              <tr
                                                                id="row3"
                                                                style={{
                                                                  backgroundColor:
                                                                    'rgba(0, 255, 255, 0.22)',
                                                                }}
                                                              >
                                                                <td colSpan={4}>{`${index + 1}.${
                                                                  taskIndex + 1
                                                                }.${subTaskIndex + 1}.${
                                                                  activitiesIndex + 1
                                                                }`}</td>
                                                                <td
                                                                  colSpan={2}
                                                                  style={{
                                                                    width: '250px',
                                                                  }}
                                                                >
                                                                  {
                                                                    activities.project_modules_activities
                                                                  }
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    width: '150px',
                                                                  }}
                                                                >
                                                                  <p
                                                                    name="assignedEmployee"
                                                                    value={
                                                                      activities.assignedTo_employeeID
                                                                    }
                                                                  >
                                                                    {activeEmployee
                                                                      .filter(
                                                                        (data) =>
                                                                          data.id ===
                                                                          activities.assignedTo_employeeID,
                                                                      )
                                                                      .map((data, idx) => (
                                                                        <option
                                                                          key={idx}
                                                                          value={data.id}
                                                                        >
                                                                          {`${data.firstName} ${data.midName} ${data.lastName}`}
                                                                        </option>
                                                                      ))}
                                                                  </p>
                                                                </td>
                                                                <td
                                                                  style={{
                                                                    width: '50px',
                                                                  }}
                                                                >
                                                                  {activities.assigned_hrs + ' '}
                                                                  <b>
                                                                    {activities.Activity_Status.trim() ===
                                                                    ''
                                                                      ? '(Not Started)'
                                                                      : '(' +
                                                                        activities.Activity_Status +
                                                                        ')'}
                                                                  </b>
                                                                </td>

                                                                <td id="btnRow">
                                                                  {(userID ===
                                                                    activities.assignedTo_employeeID ||
                                                                    ((activities.Activity_Status ===
                                                                      'Completed' ||
                                                                      activities.Activity_Status ===
                                                                        'Closed' ||
                                                                      activities.Activity_Status ===
                                                                        'Issue/Bug Found' ||
                                                                      activities.Activity_Status ===
                                                                        'In Review') &&
                                                                      userDesignation === 2)) && (
                                                                    <CButton
                                                                      className="btn"
                                                                      onClick={() =>
                                                                        handleClick2(
                                                                          activities.id,
                                                                          activities.assigned_hrs,
                                                                        )
                                                                      }
                                                                      id="CK1"
                                                                    >
                                                                      +
                                                                    </CButton>
                                                                  )}
                                                                  <CButton
                                                                    style={{
                                                                      position: 'relative',
                                                                      left: '10px',
                                                                      width: '40px',
                                                                    }}
                                                                    onClick={() =>
                                                                      handleClick(
                                                                        activities.id,
                                                                        activities.assignedTo_employeeID,
                                                                        activities.Activity_Status,
                                                                      )
                                                                    }
                                                                    id="CK2"
                                                                  >
                                                                    <div>
                                                                      {(activities.Activity_Status ===
                                                                        'Completed' ||
                                                                        activities.Activity_Status ===
                                                                          'In Review' ||
                                                                        activities.Activity_Status ===
                                                                          'Issue/Bug Found' ||
                                                                        activities.Activity_Status ===
                                                                          'Closed') &&
                                                                      userDesignation === 2 ? (
                                                                        <CIcon
                                                                          icon={cilDescription}
                                                                          className="me-2"
                                                                        />
                                                                      ) : (
                                                                        <CIcon
                                                                          icon={cilPen}
                                                                          className="me-2"
                                                                        />
                                                                      )}
                                                                      {/* Other content */}
                                                                    </div>
                                                                  </CButton>
                                                                  <CButton
                                                                    style={{
                                                                      position: 'relative',
                                                                      left: '20px',
                                                                      width: '40px',
                                                                    }}
                                                                    id="CK3"
                                                                    onClick={() =>
                                                                      handleWorkDetails(
                                                                        activities.id,
                                                                      )
                                                                    }
                                                                  >
                                                                    <CIcon
                                                                      icon={cilCalendarCheck}
                                                                      className="me-2"
                                                                    />
                                                                  </CButton>
                                                                </td>
                                                              </tr>
                                                            </React.Fragment>
                                                          ),
                                                      )}
                                                    </>
                                                  )}
                                                </React.Fragment>
                                              ),
                                            )}
                                          </>
                                        )}
                                      </React.Fragment>
                                    ))}
                                </>
                              )}
                              <br />
                            </React.Fragment>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible_assignTask(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
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
                    {`${Math.floor(timeSpent / 24)}d ${
                      time_Logged !== undefined && time_Logged !== null
                        ? (time_Logged % 24).toFixed(2)
                        : '0.00'
                    }h logged`}
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
                      // onChange={handleTimeSpentChange}
                      readOnly
                      style={{
                        width: userDesignation === 2 ? '436px' : '100%',
                      }} // Adjust width based on userDesignation
                    />
                    <CButton
                      id={userDesignation === 3 ? 'TimerButton' : 'TimerButton2'}
                      onClick={() => {
                        fetchTimerData(activityID2)
                      }}
                    >
                      <CIcon icon={cilAvTimer} />
                    </CButton>
                    {errors.timeSpent && userDesignation !== 2 && (
                      <p id="validPara" style={{ color: 'red' }}>
                        {errors.timeSpent}
                      </p>
                    )}
                  </div>
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

                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
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
                    handleSubmit()
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

          {/* ///////////////// CK MODAL////////////////////////////// */}

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
                      handleSubmit1(taskStatus, userDesignation)
                    }}
                  >
                    Submit
                  </CButton>
                </CForm>
              </CModalBody>
            </div>
          </CModal>

          {/* /////////////////////////////////////////////////////////////////Task modal//////////////////////////////////////////////////////////////////// */}

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
                                Time Remaining: {item.Time_remaining.toFixed(2)}hr
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
          <CModal
            fullscreen
            visible={visibleActivitiesDetails}
            onClose={() => setVisibleActivities(false)}
          >
            <CModalHeader>
              <CModalTitle>Project Activities Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {/* <div>
                <table style={{ width: '100%' }} className={styles.assignTask_projectDetails}>
                  <thead>
                    <tr>
                      <th>Name of Project</th>
                      <th>Client Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{projectData.project_name}</td>
                      <td>{projectData.purchaseOrder?.clientNameDetails?.clientName}</td>
                      <td>{projectData.purchaseOrder?.startDate}</td>
                      <td>{projectData.purchaseOrder?.endDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
              <CCard>
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
                  {' '}
                  <div className="time-log-report1">
                    <header className="header11">
                      <div className="filter-container1">
                        <div className="blocks1">
                          <div>
                            <div className="filter">
                              <input
                                type="text"
                                value={allSearchQuery}
                                onChange={handleAllSearchChange}
                                placeholder="Search all fields..."
                                style={{ width: '45vw' }}
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
                                          padding: '8px',
                                        }}
                                      >
                                        <option>Select a {`${field.field}`}</option>
                                        {getOptions(field.field, field.query, Project_ID).map(
                                          (option, i) =>
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
                                        style={{ left: '660px' }}
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
                              style={{
                                height: '40px',
                                padding: '5px',
                                width: '43vw',
                              }}
                              value={lastSelectedFilter} // Set the value to the last selected filter
                              onChange={(e) => addSearchField(e.target.value)}
                            >
                              <option value="">Add Filter</option>

                              <option value="Activity">Activity</option>
                              <option value="Status">Status</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </header>
                    {userDesignation !== 2 ? (
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
                    ) : (
                      <div className="timeDetails2">
                        <b className="newBold3">
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
                    )}
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
                  </div>
                </CCardBody>
              </CCard>
            </CModalBody>
          </CModal>
        </CCardBody>

        {/* ////////////////////////////////////////////////// New Bug Modal ///////////////////////////////////////////////////////// */}

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
                            Time Remaining: {item.Time_remaining.toFixed(2)}hr
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

        {/* ////////////////////////////////////////////////// New Bug Modal ///////////////////////////////////////////////////////// */}

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
                            Time Remaining: {item.Time_remaining.toFixed(2)}hr
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
    </>
  )
}

export default Project
