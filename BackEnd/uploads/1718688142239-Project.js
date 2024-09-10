import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CProgress,
  CProgressStacked,
} from '@coreui/react'
import { cilChevronBottom, cilChevronTop, cilPen, cilTask, cilX } from '@coreui/icons'
import React from 'react'
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
const Project = () => {
  const [timeSpent, setTimeSpent] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const totalTime = 2 * 24 // assuming the original estimate is 2 days (in hours)
  let time

  const handleTimeSpentChange = (e) => {
    setTimeSpent(e.target.value)
  }

  const handleTimeRemainingChange = (e) => {
    setTimeRemaining(e.target.value)
  }

  const spent = parseFloat(timeSpent) || 0
  const remaining = parseFloat(timeRemaining) || 0
  const loggedTime = Math.min(spent, totalTime)
  const remainingTime = Math.max(0, totalTime - spent)

  const progressLogged = (loggedTime / totalTime) * 100
  const progressRemaining = (remainingTime / totalTime) * 100

  const [status, setStatus] = useState('')
  const [dateTime, setDateTime] = useState('2021-11-25T21:17')
  const [Data, setData] = useState([])
  let Name;
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
  const [workDetails, setWorkDetails] = useState("");
  const [newActivityID, setNewID] = useState();
  const timelineData1 = [
    { date: '2023-01-01', event: 'Event 1' },
    { date: '2023-02-15', event: 'Event 2' },
    { date: '2023-03-10', event: 'Event 3' },
    { date: '2023-02-15', event: 'Event 4' },
    { date: '2023-03-10', event: 'Event 5' },
    // Add more events as needed
  ]

  ////////////////////////////////// CK Modal ////////////////////
  const [editorContent, setEditorContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [assignedTime, setTime] = useState("");
  // useEffect(() => {
  //   // Load data from localStorage when component mounts
  //   const savedData = JSON.parse(localStorage.getItem('timelineData')) || []
  //   setTimelineData(savedData)
  // }, [])

  const handleCloseModal = () => {
    setCKvisible(false)
  }
  let userID
  let activityID
  let activityID2

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setEditorContent(data)
  }

  // const handleTimeSpentChange = (e) => {
  //   setTimeSpent(e.target.value);
  // };

  // const handleClear = () => {
  //   setDateTime('');
  // };

  const handleSubmit1 = async () => {
    if (editorContent.split(/\s+/).filter(Boolean).length >= 100) {
      const newEvent = {
        date: new Date().toLocaleDateString(),
        event: editorContent,
        timeSpent,
        timeRemaining: time - timeSpent,
        dateTime: new Date().toLocaleTimeString(),
      }
      console.log("This is editor data", editorContent)
      const updatedTimelineData = [...timelineData, newEvent]

      setEditorContent('')
      setTimeSpent('')
      setDateTime('')
      setSuccessMessage('Work description saved successfully!')
      setErrorMessage('')
      // localStorage.setItem('timelineData', JSON.stringify(updatedTimelineData)) // Save to localStorage

      const data = await axios.post(`${USER_API_ENDPOINT}addWorkDetails`,
        {
          Name: Naam,
          Task_Date: newEvent.date,
          Task_Time: newEvent.dateTime,
          Work_Description: newEvent.event,
          activity_ID: activityID2,
        }
      )

      console.log(data)
      Swal.fire({
        title: `${data.data.message}`,
        icon: 'success',
      })
      handleCloseModal()
    } else {
      setErrorMessage('Work description must be at least 100 words.')
      setSuccessMessage('')
    }
  }


  // Function to toggle the expanded state of an item
  const toggleReadMore = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  };


  const handleDelete = (index) => {
    const updatedTimelineData = timelineData.filter((_, i) => i !== index)
    setTimelineData(updatedTimelineData)

  }


  const handleClear = () => {
    setDateTime('')
  }

  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  let fName = ParsedData.firstName;
  let lName = ParsedData.lastName;
  let Naam = fName + " " + lName;
  console.log('EmployeeID', ParsedData.id)
  userID = ParsedData.id

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

  let proName = ' '
  const [projectID, setProjectID] = useState('')

  useEffect(() => {
    const Project = async (id) => {
      const projectData = await axios.get(`${USER_API_ENDPOINT}project_planning_data2/${id}`)
      setData(projectData.data)
      console.log(projectData)
      console.log('Length of data is:', projectData.data.length)
      // console.log("This is the required ID", projectData.data.id[0])
    }
    Project(userID)
  }, [userID])

  const fetch_projectPlanning_data_to_assign = async (id) => {
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}project_planning_data_for_AssignTask/${id}}`,
      )
      setProjectPlanning_to_assign(response.data)
      console.log(
        'ACTIVITY KI ID',
        response.data.project_planning_moduleDetails.projectPlanning_subTasks_Activities_details.id,
      )
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }
  const hadnleAssignTask = (id) => {
    // setSelected_purchaseOrder_Id(id)
    fetch_projectPlanning_data_to_assign(id)
    setVisible_assignTask(true)
  }
  const formatDate = (dateString) => {
    if (!dateString) {
      return '' // Return empty string if dateString is empty or undefined
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '' // Return empty string if date is invalid
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
      const response = await axios.get(`${USER_API_ENDPOINT}getEmployeeName/${id}`);
      const { firstName, lastName } = response.data.empName;

      setFirstName(firstName);
      setLastName(lastName);

      console.log("EmployeeName", response);
    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };


  const handleAssignedHrsChange = (e, activityId) => {
    const newValue = e.target.value
    // Assuming projectPlanning_to_assign is a state variable
    const updatedProjectPlanning = { ...projectPlanning_to_assign }
    updatedProjectPlanning.project_planning_moduleDetails =
      updatedProjectPlanning.project_planning_moduleDetails.map((module) => {
        return {
          ...module,
          projectPlanning_module_tasks_details: module.projectPlanning_module_tasks_details.map(
            (task) => {
              return {
                ...task,
                projectPlanning_task_subtasks_details:
                  task.projectPlanning_task_subtasks_details.map((subTask) => {
                    return {
                      ...subTask,
                      projectPlanning_subTasks_Activities_details:
                        subTask.projectPlanning_subTasks_Activities_details.map((activity) => {
                          if (activity.id === activityId) {
                            return { ...activity, assigned_hrs: newValue }
                          }
                          return activity
                        }),
                    }
                  }),
              }
            },
          ),
        }
      })

    // Assuming setProjectPlanningToAssign is a function to update the state
    setProjectPlanning_to_assign(updatedProjectPlanning)
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
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveEmployee/3`).then((res) => {
      console.log('EMPLOYEEE DATA', res.data.data)
      setActiveEmployee(res.data.data)
      setFirstName(res.data.data.firstName)
      setMiddleName(res.data.data.midName)
      setLastName(res.data.data.lastName)
    })
  }, [])
  const [Work_Description, setWorkDescription] = useState('')

  const handleSubmit = async () => {
    try {
      const data = await axios.post(`${USER_API_ENDPOINT}addTimeTracking`, {
        Allotted_time: assignedTime,
        Time_spent: timeSpent,
        Time_remaining: time - timeSpent,
        Start_Date: dateTime,
        Work_Description: Work_Description,
        Status: status,
        activity_ID: activityID,
      })
      console.log(data)
      Swal.fire({
        title: `${data.data.message}`,
        icon: 'success',
      })
      setVisibleEdit(false)
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
      })

      console.error('ERROR SUBMITTING DATA', error)
    }
  }



  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveEmployee`).then((res) => {
      console.log("Active Data", res.data.data)
      setActiveEmployee(res.data.data)
    })
  }, [])
  const [workDescription, setworkDescription] = useState([""]);
  const handleWorkDetails = async (id) => {
    settasKvisible(true);
    const data = await axios.get(`${USER_API_ENDPOINT}getWorkDescription/${id}`);
    setworkDescription(data.data.data);
    console.log("This is your work", data.data);
  }
  const [expandedItems, setExpandedItems] = useState(Array(workDescription.length).fill(false));

  const handleClick = (id) => {
    setCKvisible(true);
    setNewID(id);
  };
  const handleClick2 = (TIME) => {
    setVisibleEdit(true);
    setTime(TIME);
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Project</strong>
        </CCardHeader>
        <CCardBody className={styles.cardBody}>
          {/* ////////////////////////////////////// project cards //////////////////////////// */}
          <CRow>
            {Data.map((module, index) => (
              <CCol key={index} xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
                <div key={index} className={styles.projectBox}>
                  <Card style={{ width: '18rem' }} className={styles.projectCards}>
                    <Card.Body>
                      <Card.Title className={styles.projectName}>{module.project_name}</Card.Title>
                      <br />
                      <Card.Text>
                        Start Date : {module.project_planning_moduleDetails[0].module_planned_startDate}
                      </Card.Text>
                      <Card.Text>
                        End Date : {module.project_planning_moduleDetails[0].module_planned_endDate}
                      </Card.Text>
                      <button
                        onClick={() => hadnleAssignTask(module.id)}
                        style={{ borderRadius: '10px', padding: '5px', width: '90px', border: 'none' }}
                      >
                        Click
                      </button>

                    </Card.Body>
                  </Card>

                </div>
              </CCol>
            ))}
          </CRow>

          <CModal
            fullscreen
            visible={visible_assignTask}
            onClose={() => setVisible_assignTask(false)}
          >
            <CModalHeader>
              <CModalTitle>
                Assign Task for :-
                {fName + " " + lName}
              </CModalTitle>
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

                        {/* <th style={{ width: '130px' }}> Start Date</th>
                              <th style={{ width: '130px' }}>End Date</th>
                              <th style={{ width: '50px' }}>Hrs</th>
                              <th style={{ width: '130px' }}>Start Date</th>
                              <th style={{ width: '130px' }}>End Date</th>
                              <th style={{ width: '50px' }}> Hrs</th> */}
                        <th>Assign To</th>
                        <th>Hrs</th>
                        <th colSpan={2}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectPlanning_to_assign.project_planning_moduleDetails
                        ? projectPlanning_to_assign.project_planning_moduleDetails.map(
                          (data, index) => (
                            <React.Fragment>
                              {console.log('modules Data', data)}
                              <tr key={index} style={{ background: 'floralwhite' }}>
                                <td>{index + 1}</td>
                                <td colSpan={4}>{data.project_modules}</td>
                                {/* <td>{formatDate(data.module_planned_startDate)}</td>
                                      <td>{formatDate(data.module_planned_endDate)}</td>
                                      <td>{data.module_planned_Hrs}</td>
                                      <td>{formatDate(data.module_actual_startDate)}</td>
                                      <td>{formatDate(data.module_actual_endDate)}</td>
                                      <td>{data.module_actual_hrs}</td> */}
                                <td>
                                  <b>Total Hrs</b>
                                </td>
                                <td>
                                  <b>
                                    {
                                      Number(
                                        data.projectPlanning_module_tasks_details
                                          .flatMap((taskDetail) =>
                                            taskDetail.projectPlanning_task_subtasks_details.flatMap(
                                              (subtaskDetail) =>
                                                subtaskDetail.projectPlanning_subTasks_Activities_details.reduce(
                                                  (total, activity) =>
                                                    total +
                                                    parseFloat(activity.assigned_hrs || 0),
                                                  0,
                                                ),
                                            ),
                                          )
                                          .reduce((total, taskTotal) => total + taskTotal, 0)
                                          .toFixed(2),
                                      ) // Format the output to two decimal places
                                    }
                                  </b>
                                </td>
                                <td colSpan={2}>
                                  {!expandModule[index] && (
                                    <CIcon
                                      className={styles.upDownBtn}
                                      icon={cilChevronBottom}
                                      onClick={() => {
                                        HandleModuleExpand(index)
                                      }}
                                    ></CIcon>
                                  )}

                                  {expandModule[index] && (
                                    <CIcon
                                      className={styles.upDownBtn}
                                      icon={cilChevronTop}
                                      onClick={() => {
                                        HandleModuleExpand(index)
                                      }}
                                    ></CIcon>
                                  )}
                                </td>
                              </tr>
                              {expandModule[index] && (
                                <>
                                  {data.projectPlanning_module_tasks_details.map(
                                    (task, taskIndex) => (
                                      <React.Fragment>
                                        <tr
                                          key={`${index}-${taskIndex}`}
                                          style={{ background: ' antiquewhite' }}
                                        >
                                          <td colSpan={2}>{`${index + 1}.${taskIndex + 1}`}</td>

                                          <td colSpan={6}>{task.project_modules_tasks}</td>
                                          {/* <td>{formatDate(task.tasks_planned_startDate)}</td>
                                                <td>{formatDate(task.tasks_planned_endDate)}</td>
                                                <td>{task.tasks_planned_Hrs}</td>
                                                <td>{formatDate(task.tasks_actual_startDate)}</td>
                                                <td>{formatDate(task.tasks_actual_endDate)}</td>
                                                <td>{task.tasks_actual_hrs}</td>
                                                <td></td>
                                                <td></td> */}
                                          <td>
                                            {!expandTask[taskIndex] && (
                                              <CIcon
                                                className={styles.upDownBtn}
                                                icon={cilChevronBottom}
                                                onClick={() => {
                                                  HandleTaskExpand(taskIndex)
                                                }}
                                              ></CIcon>
                                            )}

                                            {expandTask[taskIndex] && (
                                              <CIcon
                                                className={styles.upDownBtn}
                                                icon={cilChevronTop}
                                                onClick={() => {
                                                  HandleTaskExpand(taskIndex)
                                                }}
                                              ></CIcon>
                                            )}
                                          </td>
                                        </tr>
                                        {expandTask[taskIndex] && (
                                          <>
                                            {task.projectPlanning_task_subtasks_details.map(
                                              (subTask, subTaskIndex) => (
                                                <React.Fragment>
                                                  <tr
                                                    key={`${index}-${taskIndex}-${subTaskIndex}`}
                                                    id="row2"
                                                  >
                                                    <td colSpan={3}>{`${index + 1}.${taskIndex + 1
                                                      }.${subTaskIndex + 1}`}</td>
                                                    <td colSpan={3}>
                                                      {subTask.project_modules_subTasks}
                                                    </td>
                                                    {/* <td>
                                                            {formatDate(
                                                              subTask.subTasks_planned_startDate,
                                                            )}
                                                          </td>
                                                          <td>
                                                            {formatDate(subTask.subTasks_planned_endDate)}
                                                          </td>
                                                          <td>{subTask.subTasks_planned_Hrs}</td>
                                                          <td>
                                                            {formatDate(
                                                              subTask.subTasks_actual_startDate,
                                                            )}
                                                          </td>
                                                          <td>
                                                            {formatDate(subTask.subTasks_actual_endDate)}
                                                          </td>
                                                          <td>{subTask.subTasks_actual_hrs}</td> */}
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                      {!expandSubTask[subTaskIndex] && (
                                                        <CIcon
                                                          className={styles.upDownBtn}
                                                          icon={cilChevronBottom}
                                                          onClick={() => {
                                                            HandleSubTaskExpand(subTaskIndex)
                                                          }}
                                                        ></CIcon>
                                                      )}

                                                      {expandSubTask[subTaskIndex] && (
                                                        <CIcon
                                                          className={styles.upDownBtn}
                                                          icon={cilChevronTop}
                                                          onClick={() => {
                                                            HandleSubTaskExpand(subTaskIndex)
                                                          }}
                                                        ></CIcon>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {expandSubTask[subTaskIndex] && (
                                                    <>
                                                      {subTask.projectPlanning_subTasks_Activities_details.map(
                                                        (activities, activitiesIndex) => (
                                                          <React.Fragment>
                                                            <tr
                                                              id="row3"
                                                              key={`${index}-${taskIndex}-${subTaskIndex}-${activitiesIndex}`}
                                                            >
                                                              <td colSpan={4}>{`${index + 1}.${taskIndex + 1
                                                                }.${subTaskIndex + 1}.${activitiesIndex + 1
                                                                }`}</td>
                                                              <td
                                                                colSpan={2}
                                                                style={{ width: '250px' }}
                                                              >
                                                                {/* {activities.project_modules_activities} */}
                                                                {
                                                                  activities.project_modules_activities
                                                                }
                                                                <span style={{ display: 'none' }}>
                                                                  {(activityID = activities.id)}
                                                                </span>

                                                              </td>


                                                              <td style={{ width: '150px' }}>
                                                                <p
                                                                  name="assignedEmployee"
                                                                  value={
                                                                    activities.assignedTo_employeeID
                                                                  }

                                                                >
                                                                  {activeEmployee
                                                                    .filter((data) => data.id === activities.assignedTo_employeeID)
                                                                    .map((data, index) => {
                                                                      // Assign the Name variable
                                                                      Name = `${data.firstName} ${data.lastName}`;
                                                                      return (
                                                                        <option key={index} value={data.id}>
                                                                          {`${data.firstName} ${data.midName} ${data.lastName}`}
                                                                        </option>
                                                                      );
                                                                    })}
                                                                </p>
                                                              </td>

                                                              <td style={{ width: '50px' }}>
                                                                {activities.assigned_hrs}
                                                              </td>

                                                              <td id="btnRow">
                                                                {userID === activities.assignedTo_employeeID && (
                                                                  <>
                                                                    <CButton onClick={() => handleClick2(activities.assigned_hrs)} id="CK1">
                                                                      +
                                                                    </CButton>

                                                                  </>
                                                                )}
                                                                <span style={{ display: 'none' }}>{activityID2 = activities.id}</span>
                                                                <CButton
                                                                  style={{ position: 'relative', left: '10px', width: '40px' }}
                                                                  onClick={() => handleClick(activities.id)}
                                                                  id="CK2"

                                                                >
                                                                  <CIcon icon={cilPen} className="me-2" />
                                                                </CButton>
                                                                <CButton
                                                                  style={{ position: 'relative', left: '20px', width: '40px' }}
                                                                  id="CK3"
                                                                  // onClick={() => settasKvisible(true)}
                                                                  onClick={() => handleWorkDetails(activities.id)}
                                                                >
                                                                  <CIcon icon={cilTask} className="me-2" />
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
                                    ),
                                  )}
                                </>
                              )}
                              <br></br>
                            </React.Fragment>
                          ),
                        )
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
              <CProgressStacked style={{ height: '10px' }}>
                <CProgress value={assignedTime} />
                <CProgress color="warning" value={timeSpent} />
              </CProgressStacked>
              <h6 style={{ color: 'gray', fontSize: '15px' }}>2d 2h logged</h6>
              <div id="CP">
                <h6>The original estimate for this issue was:-</h6>
                <span>{assignedTime} hours</span>
              </div>
              <CForm>
                <div id="input">
                  <div className="div1">
                    <label className="lable">Time spent</label>
                    <input
                      type="text"
                      placeholder="Enter Time in hours"
                      value={timeSpent}
                      onChange={handleTimeSpentChange}
                    ></input>
                  </div>
                  <div className="div2">
                    <label className="lable">Time remaining</label>
                    <input
                      type="text"
                      placeholder="Enter Time in hours"
                      value={assignedTime - timeSpent}
                      // onChange={handleTimeRemainingChange}
                      style={{ cursor: 'not-allowed' }}
                      readOnly
                    ></input>
                  </div>
                </div>
                <div className="container">
                  <label htmlFor="date-started" className="lable">
                    Date started *
                  </label>
                  <div className="input-container">
                    <input
                      type="date"
                      id="date-started"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                    />
                    <button className="clear-btn" onClick={handleClear}>
                      &#x2716;
                    </button>
                  </div>
                </div>
                <div id="CKeditor">
                  <h2 style={{ marginRight: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                    Work description
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
                        uploadUrl: 'https://example.com/your-upload-endpoint', // Replace with your upload URL
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
              </CForm>
            </CModalBody>
            <CModalFooter>
              <label
                htmlFor="status-dropdown"
                style={{ marginRight: '4px', fontSize: '17px', color: 'red', fontWeight: 'bold' }}
              >
                Status:
              </label>
              <select
                id="status-dropdown"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginRight: 'auto', padding: '5px', borderRadius: '4px', color: 'gray' }}
              >
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
              </select>

              <CButton
                color="primary"
                onClick={() => {
                  handleSubmit()
                }}
              >
                Save
              </CButton>
              <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ///////////////// CK MODAL////////////////////////////// */}

          <CModal visible={cKvisible} onClose={handleCloseModal} id="ckeditor" size="xl">
            <div id="CKwork">
              <CModalHeader>
                <CModalTitle style={{ color: 'gray', font: 'bold' }}>
                  Write Your Today's Work
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div id="CKeditor1">
                    <h2 id="h2">Work description</h2>
                    <CKEditor
                      onChange={handleEditorChange}
                      editor={ClassicEditor}
                      config={{
                        ckfinder: {
                          uploadUrl: 'https://example.com/your-upload-endpoint', // Replace with your upload URL
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
                  <CButton id="btnn" onClick={() => { handleSubmit1() }}>
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
            <h1 id="headTask">
              History of Task
              <button className="cancel-button" onClick={() => settasKvisible(false)}>
                Cancel
              </button>
            </h1>

            <CModalBody>
              <div className="timeline">
                {workDescription.map((item, index) => (
                  <div
                    key={index}
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  >
                    <div className="timeline-content">
                      <h3>
                        Name: <span>{item.Name}</span>
                      </h3>
                      <span className="timeline-date">{item.dateTime}</span>
                      <p>Date: {item.Task_Date}</p>
                      <p>Time: {item.Task_Time}</p>
                      <p>
                        Work Done: {
                          item.Work_Description
                            ? (expandedItems[index] ? item.Work_Description : `${item.Work_Description.substring(0, 100)}...`)
                            : 'No description available'
                        }
                      </p>
                      {item.Work_Description && (
                        <CButton onClick={() => toggleReadMore(index)}>
                          {expandedItems[index] ? 'Read Less' : 'Read More'}
                        </CButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CModalBody>
          </CModal>
        </CCardBody>

        {/* ////////////////////////////////////////////////// New Modal ///////////////////////////////////////////////////////// */}
      </CCard>
    </>
  )
}

export default Project
