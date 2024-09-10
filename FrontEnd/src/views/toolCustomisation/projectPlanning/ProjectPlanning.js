/* eslint-disable react/jsx-key */
import {
  cilChevronBottom,
  cilChevronCircleDownAlt,
  cilChevronTop,
  cilPen,
  cilTask,
  cilX,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
import axios from 'axios'
import Swal from 'sweetalert2'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from 'src/constants'
import styles from './ProjectPlanning.module.css'
import './ProjectPlan.css'

const ProjectPlanning = () => {
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
  const [testEmployee, setTest] = useState([])

  const [assignedHrs, setAssignedHrs] = useState('')
  const [expandModule, setExpandModule] = useState([])
  const [expandTask, setExpandTask] = useState([])
  const [expandSubTask, setExpandSubTask] = useState([])
  const [EmployeeName, setEmployeeName] = useState('')

  let userDesignation
  let firstName
  let lastName
  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  firstName = ParsedData.firstName
  lastName = ParsedData.lastName
  userDesignation = ParsedData.designation_id
  // if (userDesignation != 1) {
  //   window.location.href = window.location.origin + '/#/toolCustomisation/project'
  // }

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
  const [isCollapsed, setIsCollapsed] = useState({})

  const collapseBtn = (index) => {
    setIsCollapsed((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  /////////////////// use effect for project planning data //////////////////////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}project_planning_data`).then((res) => {
      setProjectPlanning_data(res.data)
      setfilterData(res.data)
      console.log(res.data)
    })
  }, [visibleUpdate_projectPlanning])

  const fetchProjectPlanning = async () => {
    axios.get(`${USER_API_ENDPOINT}project_planning_data`).then((res) => {
      setProjectPlanning_data(res.data)
      setfilterData(res.data)
      console.log(res.data)
    })
  }
  /////////////////// filter data effect //////////////////

  useEffect(() => {
    const filterProjectPlanning_data = projectPlanning_data.filter((projectPlanning) => {
      return projectPlanning.purchaseOrder.clientNameDetails.clientName
        .toLowerCase()
        .match(search.toLowerCase())
    })
    setfilterData(filterProjectPlanning_data)
  }, [search])

  ///////////////////////////// Formate date function ///////////////////////////////////

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
  const [Project_ID, setProjectID] = useState('')
  const [Status, setStatus] = useState(' ')
  const [client_ID, setClientID] = useState('')

  const columns = [
    {
      name: 'Sr.No.',
      selector: (_, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Client Name',
      selector: (row) => row.purchaseOrder.clientNameDetails.clientName,
      sortable: true,
    },
    {
      name: 'Project Name',
      selector: (row) => row.project_name,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) =>
        row.project_planning_moduleDetails[0]?.module_planned_startDate?.trim() !== ''
          ? formatDate(row.project_planning_moduleDetails[0].module_planned_startDate)
          : 'Not Started',
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) =>
        row.project_planning_moduleDetails[0]?.module_planned_endDate?.trim() !== ''
          ? formatDate(row.project_planning_moduleDetails[0].module_planned_endDate)
          : 'Not Started',
      sortable: true,
    },
    {
      name: 'Actual Start Date',
      selector: (row) =>
        row.project_planning_moduleDetails[0]?.module_actual_startDate?.trim() !== ''
          ? formatDate(row.project_planning_moduleDetails[0].module_actual_startDate)
          : 'Not Started',
      sortable: true,
    },
    {
      name: 'Actual End Date',
      selector: (row) =>
        row.project_planning_moduleDetails[0]?.module_actual_endDate?.trim() !== ''
          ? formatDate(row.project_planning_moduleDetails[0].module_actual_endDate)
          : 'Not Started',
      sortable: true,
    },
    {
      name: 'Action',
      width: '80px',
      cell: (row) => (
        <>
          <CIcon
            className="ms-4"
            icon={cilTask}
            onClick={() => handleAssignTask(row.id)}
            style={{ cursor: 'pointer', color: 'blue' }}
          />
        </>
      ),
    },
  ]
  const isAllActivitiesAssignedToZero = (project) => {
    return project.project_planning_moduleDetails.every((module) =>
      module.projectPlanning_module_tasks_details.every((task) =>
        task.projectPlanning_task_subtasks_details.every((subTask) =>
          subTask.projectPlanning_subTasks_Activities_details.every(
            (activity) =>
              activity.assignedTo_employeeID === 0 || activity.assignedTo_employeeID === null,
          ),
        ),
      ),
    )
  }
  const isAnyActivityAssignedToNonZero = (row) => {
    return row.project_planning_moduleDetails.some((module) =>
      module.projectPlanning_module_tasks_details.some((task) =>
        task.projectPlanning_task_subtasks_details.some((subtask) =>
          subtask.projectPlanning_subTasks_Activities_details.some(
            (activity) =>
              activity.assignedTo_employeeID !== 0 && activity.assignedTo_employeeID !== null,
          ),
        ),
      ),
    )
  }

  const areAllActivitiesAssigned = (row) => {
    return row.project_planning_moduleDetails.every((module) =>
      module.projectPlanning_module_tasks_details.every((task) =>
        task.projectPlanning_task_subtasks_details.every((subtask) =>
          subtask.projectPlanning_subTasks_Activities_details.every(
            (activity) =>
              activity.assignedTo_employeeID !== 0 && activity.assignedTo_employeeID !== null,
          ),
        ),
      ),
    )
  }

  // Function to get row style based on the condition

  /////////////////////////////////////// handle edit function ////////////////////////////////////////////////

  const fetch_purchaseOrder_Data = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}project_planning_data/${id}`)
      setPurchaseOrder_ToUpdate(response.data)
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }

  console.log('purchase order ', purchaseOrder_ToUpdate)

  const handleEdit = (id) => {
    setSelected_purchaseOrder_Id(id)
    fetch_purchaseOrder_Data(id)
    setVisibleUpdate_projectPlanning(true)
  }

  //////////////////////////////// for removed files /////////////////////////////////////
  const handleRemoveAttachment = (index) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this attachment?')
    if (shouldRemove) {
      const updatedPurchaseOrderAttachments = [...purchaseOrder_ToUpdate.project_planning_files]
      const removedAttachment = updatedPurchaseOrderAttachments.splice(index, 1)[0] // Remove attachment from array and store removed attachment
      setPurchaseOrder_ToUpdate({
        ...purchaseOrder_ToUpdate,
        project_planning_files: updatedPurchaseOrderAttachments,
      })
      setRemovedAttachments([...removedAttachments, removedAttachment]) // Add removed attachment to removedAttachments state
    }
  }

  //////////////////////////// for file on change //////////////////////////////////////////
  const handleRemove_updateProject_file = (index) => {
    setPurchaseOrder_ToUpdate((prevPurchaseOrder) => {
      const updatedProjectPlanning_file = [...prevPurchaseOrder.project_file]
      updatedProjectPlanning_file.splice(index, 1)
      return {
        ...prevPurchaseOrder,
        project_file: updatedProjectPlanning_file,
      }
    })
  }
  //////////////////////////////////////// functionality for add more start /////////////////////////////////////
  console.log('module', modules)

  const handle_onupdate_Modules = () => {
    // Check if project_planning_moduleDetails is defined and initialize it as an empty array if it's undefined
    const projectPlanningModuleDetails = purchaseOrder_ToUpdate.project_planning_moduleDetails || []

    const newModule = {
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
    }

    // Update the project_planning_moduleDetails array in purchaseOrder_ToUpdate state
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: [...projectPlanningModuleDetails, newModule],
    }))
  }

  const handleRemove_Modules = async (index, id) => {
    console.log('Id value', id)

    const shouldRemove = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this Module? This will be removed permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    })

    if (shouldRemove.isConfirmed) {
      if (id) {
        try {
          await axios.delete(`${USER_API_ENDPOINT}delete_module/${id}`)
        } catch (error) {
          console.error('Error deleting module:', error)
        }
      }

      // Make a copy of project_planning_moduleDetails
      const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

      // Remove the module at the specified index
      updatedModules.splice(index, 1)

      // Update the state with the modified modules
      setPurchaseOrder_ToUpdate({
        ...purchaseOrder_ToUpdate,
        project_planning_moduleDetails: updatedModules,
      })
    } else if (shouldRemove.dismiss === Swal.DismissReason.cancel) {
      // User clicked cancel button
      // Do nothing or show a message
    }
  }

  const handleRemove_Tasks = async (moduleIndex, taskIndex, taskId) => {
    const shouldRemove = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this Task? This will be removed permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    })
    if (shouldRemove.isConfirmed) {
      axios.delete(`${USER_API_ENDPOINT}delete_task/${taskId}`)
      const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

      // Remove the task at the specified taskIndex from the module at the specified moduleIndex
      updatedModules[moduleIndex].projectPlanning_module_tasks_details.splice(taskIndex, 1)

      // Update the state with the modified modules
      setPurchaseOrder_ToUpdate({
        ...purchaseOrder_ToUpdate,
        project_planning_moduleDetails: updatedModules,
      })
    } else if (shouldRemove.dismiss === Swal.DismissReason.cancel) {
      // User clicked cancel button
      // Do nothing or show a message
    }
  }

  /////////////////// remove subtask ////////////////////

  const handleRemove_SubTasks = async (moduleIndex, taskIndex, subTaskIndex, subtaskId) => {
    const shouldRemove = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this SubTask? This will be removed permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    })

    if (shouldRemove.isConfirmed) {
      if (subtaskId) {
        try {
          await axios.delete(`${USER_API_ENDPOINT}delete_subtask/${subtaskId}`)
        } catch (error) {
          console.error('Error deleting subtask:', error)
        }
      }

      const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

      // Remove the subtask at the specified subTaskIndex from the task at the specified taskIndex within the module at the specified moduleIndex
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details.splice(subTaskIndex, 1)

      // Update the state with the modified modules
      setPurchaseOrder_ToUpdate({
        ...purchaseOrder_ToUpdate,
        project_planning_moduleDetails: updatedModules,
      })
    } else if (shouldRemove.dismiss === Swal.DismissReason.cancel) {
      // User clicked cancel button
      // Do nothing or show a message
    }
  }

  //////////////////////////////remove activities /////////////////////////

  const handleRemove_activities = async (
    moduleIndex,
    taskIndex,
    subTaskIndex,
    activityIndex,
    activityId,
  ) => {
    const shouldRemove = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this Activities? This will be removed permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    })
    if (shouldRemove.isConfirmed) {
      axios.delete(`${USER_API_ENDPOINT}delete_activity/${activityId}`)
      const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

      // Remove the activity at the specified activityIndex from the subtask at the specified subTaskIndex within the task at the specified taskIndex within the module at the specified moduleIndex
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details[
        subTaskIndex
      ].projectPlanning_subTasks_Activities_details.splice(activityIndex, 1)

      // Update the state with the modified modules
      setPurchaseOrder_ToUpdate({
        ...purchaseOrder_ToUpdate,
        project_planning_moduleDetails: updatedModules,
      })
    } else if (shouldRemove.dismiss === Swal.DismissReason.cancel) {
      // User clicked cancel button
      // Do nothing or show a message
    }
  }

  ///////////////////////// add more tasks //////////////////////////////

  const handleAddTasks_onupdate = (moduleIndex) => {
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

    // Ensure the projectPlanning_module_tasks_details array exists
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details = []
    }

    // Add a new task
    updatedModules[moduleIndex].projectPlanning_module_tasks_details.push({
      task: '',
      task_planned_startDate: '',
      task_planned_endDate: '',
      task_planned_Hrs: '0',
      task_actual_startDate: '',
      task_actual_endDate: '',
      task_actual_hrs: '0',
      subTasks: [
        {
          subTask: '',
          subTask_planned_startDate: '',
          subTask_planned_endDate: '',
          subTask_planned_Hrs: '0',
          subTask_actual_startDate: '',
          subTask_actual_endDate: '',
          subTask_actual_hrs: '0',
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
    })

    // Recalculate planned and actual hours for all tasks and subtasks
    const recalculatedModules = updatedModules.map((module) => {
      return {
        ...module,
        projectPlanning_module_tasks_details: (
          module.projectPlanning_module_tasks_details || []
        ).map((task) => {
          // Ensure subTasks is an array
          const subTasks = task.subTasks || []

          // Recalculate task hours
          const updatedTask = {
            ...task,
            task_planned_Hrs: calculateTaskPlannedHrs(task),
            task_actual_hrs: calculateTaskActualHrs(task),
            subTasks: subTasks.map((subTask) => ({
              ...subTask,
              subTask_planned_Hrs: calculateSubTaskPlannedHrs(subTask),
              subTask_actual_hrs: calculateSubTaskActualHrs(subTask),
            })),
          }

          return updatedTask
        }),
      }
    })

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: recalculatedModules,
    }))
  }

  const recalculateTaskHours = (modules) => {
    return modules.map((module) => {
      return {
        ...module,
        tasks: module.tasks.map((task) => {
          const updatedTask = {
            ...task,
            task_planned_Hrs: calculateTaskPlannedHrs(task),
            task_actual_hrs: calculateTaskActualHrs(task),
            subTasks: task.subTasks.map((subTask) => ({
              ...subTask,
              subTask_planned_Hrs: calculateSubTaskPlannedHrs(subTask),
              subTask_actual_hrs: calculateSubTaskActualHrs(subTask),
            })),
          }

          return updatedTask
        }),
      }
    })
  }

  ////////////////////////////// for subtask /////////////////////////////////

  const handleModule_subtask_onUpdate = (moduleIndex) => {
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]
    let pathDetail =
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
        .projectPlanning_task_subtasks_details
    if (!pathDetail) {
      pathDetail = []
    }
    pathDetail.push({
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
    })
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }

  const handleAddSubTasks_onUpdate = (moduleIndex, taskIndex) => {
    console.log(moduleIndex, taskIndex)
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

    // Ensure the task exists
    if (
      updatedModules[moduleIndex].projectPlanning_module_tasks_details.length > taskIndex &&
      !updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex]
        .projectPlanning_task_subtasks_details
    ) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details = []
    }

    // Add new subtask with default activity
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[
      taskIndex
    ].projectPlanning_task_subtasks_details.push({
      subTask: '',
      subTask_planned_startDate: '',
      subTask_planned_endDate: '',
      subTask_planned_Hrs: '',
      subTask_actual_startDate: '',
      subTask_actual_endDate: '',
      subTask_actual_hrs: '',
      projectPlanning_subTasks_Activities_details: [
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
    })

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }

  ////////////////////////////// for activities ////////////////////////////////////

  const handleModule_activities_onUpdate = (moduleIndex) => {
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

    // Check if projectPlanning_module_tasks_details exists
    if (
      updatedModules[moduleIndex] &&
      updatedModules[moduleIndex].projectPlanning_module_tasks_details &&
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
    ) {
      // Check if projectPlanning_task_subtasks_details exists
      if (
        updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
          .projectPlanning_task_subtasks_details &&
        updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
          .projectPlanning_task_subtasks_details[0]
      ) {
        let pathDetail =
          updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
            .projectPlanning_task_subtasks_details[0].projectPlanning_subTasks_Activities_details

        // Check if pathDetail is defined, if not initialize it as an array
        if (!pathDetail) {
          pathDetail = []
        }

        pathDetail.push({
          activities: '',
          activities_planned_startDate: '',
          activities_planned_endDate: '',
          activities_planned_Hrs: '',
          activities_actual_startDate: '',
          activities_actual_endDate: '',
          activities_actual_hrs: '',
        })
      }
    }

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }

  const handleModule_activities_for_subindex_onUpdate = (moduleIndex, subTaskIndex) => {
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]
    let pathDetails =
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
        .projectPlanning_task_subtasks_details[subTaskIndex + 1]

    if (!pathDetails) {
      pathDetails = {
        projectPlanning_subTasks_Activities_details: [],
      }
    } else if (!pathDetails.projectPlanning_subTasks_Activities_details) {
      pathDetails.projectPlanning_subTasks_Activities_details = []
    }

    pathDetails.projectPlanning_subTasks_Activities_details.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }

  const handleAdd_activities_forSubTask1_onUpdate = (moduleIndex, taskIndex, subTaskIndex) => {
    console.log('id', moduleIndex, taskIndex, subTaskIndex)
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]

    // Ensure projectPlanning_task_subtasks_details array exists
    if (
      !updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex]
        .projectPlanning_task_subtasks_details
    ) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details = []
    }

    // Ensure the specific subtask exists
    if (
      !updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex]
        .projectPlanning_task_subtasks_details[subTaskIndex]
    ) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details[subTaskIndex] = {
        projectPlanning_subTasks_Activities_details: [],
      }
    }

    // Ensure projectPlanning_subTasks_Activities_details array exists
    let pathDetail =
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex]
        .projectPlanning_task_subtasks_details[subTaskIndex]
        .projectPlanning_subTasks_Activities_details

    if (!pathDetail) {
      pathDetail = []
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex
      ].projectPlanning_task_subtasks_details[
        subTaskIndex
      ].projectPlanning_subTasks_Activities_details = pathDetail
    }

    // Add the new activity
    pathDetail.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }

  const handleAdd_activities_onUpdate = (moduleIndex, taskIndex, subTaskIndex) => {
    console.log(moduleIndex, taskIndex, subTaskIndex)
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails]
    if (
      !updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex + 1]
        .projectPlanning_task_subtasks_details[subTaskIndex + 1]
        .projectPlanning_subTasks_Activities_details
    ) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[
        taskIndex + 1
      ].projectPlanning_task_subtasks_details[
        subTaskIndex + 1
      ].projectPlanning_subTasks_Activities_details = []
    }

    updatedModules[moduleIndex].projectPlanning_module_tasks_details[
      taskIndex + 1
    ].projectPlanning_task_subtasks_details[
      subTaskIndex + 1
    ].projectPlanning_subTasks_Activities_details.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }
  //////////////////////////////// onchange function /////////////////////////////////

  const handleInputChange = (e, index, key) => {
    const { name, value } = e.target
    // console.log(name, value, key)

    // Ensure purchaseOrder_ToUpdate is not null or undefined
    if (!purchaseOrder_ToUpdate) {
      console.error('purchaseOrder_ToUpdate is null or undefined')
      return
    }

    // Ensure project_planning_moduleDetails is not null or undefined
    if (!purchaseOrder_ToUpdate.project_planning_moduleDetails) {
      console.error('project_planning_moduleDetails is null or undefined')
      return
    }

    const newPurchaseOrderToUpdate = purchaseOrder_ToUpdate.project_planning_moduleDetails.map(
      (module, i) => {
        if (i === index) {
          // Ensure module.projectPlanning_module_tasks_details is not null or undefined
          const projectPlanningModuleTasksDetails =
            module.projectPlanning_module_tasks_details || []
          return {
            ...module,
            projectPlanning_module_tasks_details: projectPlanningModuleTasksDetails,
            [key]: value,
          }
        }
        return module
      },
    )

    // Update the state with the modified purchase order
    setPurchaseOrder_ToUpdate({
      ...purchaseOrder_ToUpdate,
      project_planning_moduleDetails: newPurchaseOrderToUpdate,
    })
  }

  ///////////////// for tasks on change ////////////////////////////////

  const handleTaskInputChange = (e, moduleIndex, taskIndex, key) => {
    const { name, value } = e.target

    // Ensure purchaseOrder_ToUpdate is not null or undefined
    if (!purchaseOrder_ToUpdate) {
      console.error('purchaseOrder_ToUpdate is null or undefined')
      return
    }

    // Ensure project_planning_moduleDetails is not null or undefined
    if (!purchaseOrder_ToUpdate.project_planning_moduleDetails) {
      console.error('project_planning_moduleDetails is null or undefined')
      return
    }
    // Create a deep copy of the project_planning_moduleDetails array
    const updatedModules = purchaseOrder_ToUpdate.project_planning_moduleDetails.map((module) => ({
      ...module,
    }))

    // Update the specified task's property in the copied array
    if (
      updatedModules[moduleIndex] &&
      updatedModules[moduleIndex].projectPlanning_module_tasks_details
    ) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details = updatedModules[
        moduleIndex
      ].projectPlanning_module_tasks_details.map((task, i) => {
        if (i === taskIndex) {
          return {
            ...task,
            [key]: value,
          }
        }
        return task
      })
    }

    // Update the state with the modified purchase order
    setPurchaseOrder_ToUpdate({
      ...purchaseOrder_ToUpdate,
      project_planning_moduleDetails: updatedModules,
    })
  }

  //////////////////////////////// for subtask onchange ///////////////////////

  const handleSubTaskInputChange = (e, moduleIndex, taskIdx, subTaskIdx, key) => {
    const { name, value } = e.target

    // Ensure purchaseOrder_ToUpdate is not null or undefined
    if (!purchaseOrder_ToUpdate) {
      console.error('purchaseOrder_ToUpdate is null or undefined')
      return
    }

    // Ensure project_planning_moduleDetails is not null or undefined
    if (!purchaseOrder_ToUpdate.project_planning_moduleDetails) {
      console.error('project_planning_moduleDetails is null or undefined')
      return
    }

    // Create a deep copy of the modules array
    const updatedModules = purchaseOrder_ToUpdate.project_planning_moduleDetails.map((module) => ({
      ...module,
    }))

    // Extracting the keys from the name attribute
    const [field, i, taskIndex, s] = name.split('-')
    const fieldName = key.split('-').join('_') // Convert to snake_case if needed

    // Ensure projectPlanning_module_tasks_details and projectPlanning_task_subtasks_details arrays exist
    const module = updatedModules[moduleIndex]
    if (module) {
      if (!module.projectPlanning_module_tasks_details) {
        module.projectPlanning_module_tasks_details = []
      }

      const task = module.projectPlanning_module_tasks_details[taskIdx]
      if (task) {
        if (!task.projectPlanning_task_subtasks_details) {
          task.projectPlanning_task_subtasks_details = []
        }

        const subTask = task.projectPlanning_task_subtasks_details[subTaskIdx]
        if (subTask) {
          // Update the value in the subTask
          subTask[fieldName] = value

          // Recalculate the sum of activities' planned hours for the subtask
          const activities = subTask.activities || []
          const sumOfPlannedHrs = Array.isArray(activities)
            ? activities.reduce(
                (sum, activity) => sum + parseFloat(activity.activities_planned_Hrs || 0),
                0,
              )
            : 0

          // Update the subtask's planned hours
          subTask.subTask_planned_Hrs = sumOfPlannedHrs.toString()
        } else {
          // Initialize the subTask if it doesn't exist
          task.projectPlanning_task_subtasks_details[subTaskIdx] = {
            [fieldName]: value,
            activities: [], // Initialize activities array
          }
        }
      } else {
        // Initialize the task if it doesn't exist
        module.projectPlanning_module_tasks_details[taskIdx] = {
          projectPlanning_task_subtasks_details: [
            {
              [fieldName]: value,
              activities: [], // Initialize activities array
            },
          ],
        }
      }
    } else {
      // Initialize the module if it doesn't exist
      updatedModules[moduleIndex] = {
        projectPlanning_module_tasks_details: [
          {
            projectPlanning_task_subtasks_details: [
              {
                [fieldName]: value,
                activities: [], // Initialize activities array
              },
            ],
          },
        ],
      }
    }

    // Update the state with the modified modules
    setPurchaseOrder_ToUpdate({
      ...purchaseOrder_ToUpdate,
      project_planning_moduleDetails: updatedModules,
    })
  }

  /////////////////////////////////// for activities onchange //////////////////////////

  const handleActivitiesInputChange = (
    e,
    moduleIndex,
    taskIndex,
    subTaskIndex,
    activityIndex,
    key,
  ) => {
    const { name, value } = e.target

    if (!purchaseOrder_ToUpdate) {
      console.error('purchaseOrder_ToUpdate is null or undefined')
      return
    }

    if (!purchaseOrder_ToUpdate.project_planning_moduleDetails) {
      console.error('project_planning_moduleDetails is null or undefined')
      return
    }

    // Create a copy of the updatedModules
    const updatedModules = purchaseOrder_ToUpdate.project_planning_moduleDetails.map((module) => ({
      ...module,
      projectPlanning_module_tasks_details: module.projectPlanning_module_tasks_details || [],
    }))

    // Extracting the keys from the name attribute
    const [, i, taskIndexStr, s] = name.split('-')
    const fieldName = key.split('-').join('_')

    const module = updatedModules[moduleIndex]
    if (module) {
      const task = module.projectPlanning_module_tasks_details[taskIndex] || {}
      if (task) {
        task.projectPlanning_task_subtasks_details =
          task.projectPlanning_task_subtasks_details || []
        const subTask = task.projectPlanning_task_subtasks_details[subTaskIndex] || {}
        if (subTask) {
          subTask.projectPlanning_subTasks_Activities_details =
            subTask.projectPlanning_subTasks_Activities_details || []
          updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex] = {
            ...task,
            projectPlanning_task_subtasks_details: [
              ...task.projectPlanning_task_subtasks_details.map((subTask, index) => {
                if (index === subTaskIndex) {
                  subTask.projectPlanning_subTasks_Activities_details = [
                    ...subTask.projectPlanning_subTasks_Activities_details.map(
                      (activities, index) => {
                        if (index === activityIndex) {
                          return {
                            ...activities,
                            [fieldName]: value,
                          }
                        }
                        return activities
                      },
                    ),
                  ]
                  return subTask
                }
                return subTask
              }),
            ],
          }
        } else {
          // Initialize subTask and its activities if they don't exist
          updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex] = {
            ...task,
            projectPlanning_task_subtasks_details: [
              {
                ...subTask,
                projectPlanning_subTasks_Activities_details: [
                  {
                    [fieldName]: value,
                  },
                ],
              },
            ],
          }
        }
      } else {
        // Initialize task, subTask, and activities if they don't exist
        updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex] = {
          ...task,
          projectPlanning_task_subtasks_details: [
            {
              // eslint-disable-next-line no-undef
              ...subTask,
              projectPlanning_subTasks_Activities_details: [
                {
                  [fieldName]: value,
                },
              ],
            },
          ],
        }
      }
    } else {
      // Initialize module, task, subTask, and activities if they don't exist
      updatedModules[moduleIndex] = {
        ...module,
        projectPlanning_module_tasks_details: [
          {
            // eslint-disable-next-line no-undef
            ...task,
            projectPlanning_task_subtasks_details: [
              {
                // eslint-disable-next-line no-undef
                ...subTask,
                projectPlanning_subTasks_Activities_details: [
                  {
                    [fieldName]: value,
                  },
                ],
              },
            ],
          },
        ],
      }
    }

    // Update the state
    setPurchaseOrder_ToUpdate({
      ...purchaseOrder_ToUpdate,
      project_planning_moduleDetails: updatedModules,
    })
  }

  ////////////////////////////////////////////////////////////////////// on Update click  //////////////////////////////////////////////////

  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      formData.append('project_name', purchaseOrder_ToUpdate.project_name)
      formData.append(
        'modules',
        JSON.stringify(purchaseOrder_ToUpdate.project_planning_moduleDetails || []),
      )

      // Append other fields as needed

      // Append project files
      if (
        !purchaseOrder_ToUpdate.project_file ||
        typeof purchaseOrder_ToUpdate.project_file === 'string'
      ) {
        // Existing attachments are strings, append them directly
        formData.append('project_file', purchaseOrder_ToUpdate.project_file)
      } else if (Array.isArray(purchaseOrder_ToUpdate.project_file)) {
        // If new attachments are selected, append them
        purchaseOrder_ToUpdate.project_file.forEach((file) => {
          formData.append('project_file', file)
        })
      }
      if (removedAttachments.length > 0) {
        // Append removed attachment IDs to be deleted on the backend
        formData.append('removedAttachments', JSON.stringify(removedAttachments))
      }
      // const assignedTo_employeeID = 1;
      // formData.append('assignedTo_employeeID', JSON.stringify(assignedTo_employeeID));

      const response = await axios.put(
        `${USER_API_ENDPOINT}update_projectPlanning_withoutdeleting/${purchaseOrder_ToUpdate.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      setVisibleUpdate_projectPlanning(false)

      setUpdateToast(true)
      console.log('Update response:', response.data)
      // Handle success
    } catch (error) {
      console.error('Error updating project:', error)
      // Handle error
    }
  }

  /////////////////////////////////////////////////// Assign Task Functionality Start ////////////////////////////////////////////////

  /////////////// use effect to fetch all active employee  ////////////////////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveEmployee`).then((res) => {
      console.log('Active Data', res.data.data)
      const filterData = res.data.data.filter((employee) => employee.designation_id == 3)
      setActiveEmployee(filterData)
    })
  }, [])

  const fetch_projectPlanning_data_to_assign = async (id) => {
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}project_planning_data_for_AssignTask/${id}`,
      )
      setProjectPlanning_to_assign(response.data)
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }

  console.log('projectplanning data', projectPlanning_to_assign)
  const handleAssignTask = (id) => {
    setProjectID(id)
    setSelected_purchaseOrder_Id(id)
    fetch_projectPlanning_data_to_assign(id)
    setVisible_assignTask(true)
  }

  const updateAssignedEmployee = (activitiesId, assignedTo_employeeID, id) => {
    console.log('activities id', activitiesId)

    fetch(`${USER_API_ENDPOINT}updateAssignedEmployee2/${activitiesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignedTo_employeeID,
        Project_ID,
        Status,
        firstName,
        lastName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        fetch_projectPlanning_data_to_assign(id)
        // Handle success response
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
      })
  }

  // Example usage
  const handleAssignedEmployeeChange = (e, activitiesId, project_ID) => {
    const employeeID = e.target.value
    console.log('This is the required id', project_ID)
    console.log('activitiesValue', employeeID)
    console.log('activitiesId', activitiesId) // Check if activitiesId is correctly passed
    updateAssignedEmployee(activitiesId, employeeID, project_ID)
    // updateEmployeeId(employeeID, project_ID);
  }

  const updateEmployeeId = async (employeeID, project_ID) => {
    const data = await axios.put(`${USER_API_ENDPOINT}updateEmployeeID/${project_ID}`, {
      employee_ID: employeeID,
    })
    console.log('This is the required data', data)
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

  const handleAssignedHrs = (e, activitiesId) => {
    const newValue = e.target.value
    updateAssignedHrs(activitiesId, newValue)
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
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)

  const totalRows = filterData.length
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (newRowsPerPage, page) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(page)
  }

  const calculateSubTaskPlannedHrs = (subtask) => {
    if (
      !subtask.projectPlanning_subTasks_Activities_details ||
      subtask.projectPlanning_subTasks_Activities_details.length === 0
    ) {
      return ''
    }
    return subtask.projectPlanning_subTasks_Activities_details.reduce(
      (sum, activity) => sum + (parseFloat(activity.activities_planned_Hrs) || 0),
      0,
    )
  }

  const calculateSubTaskActualHrs = (subtask) => {
    if (
      !subtask.projectPlanning_subTasks_Activities_details ||
      subtask.projectPlanning_subTasks_Activities_details.length === 0
    ) {
      return ''
    }
    return subtask.projectPlanning_subTasks_Activities_details.reduce(
      (sum, activity) => sum + (parseFloat(activity.activities_actual_hrs) || 0),
      0,
    )
  }

  const calculateModulePlannedHrs = (module) => {
    if (
      !module.projectPlanning_module_tasks_details ||
      module.projectPlanning_module_tasks_details.length === 0
    ) {
      return ''
    }

    return module.projectPlanning_module_tasks_details.reduce((taskSum, task) => {
      if (
        !task.projectPlanning_task_subtasks_details ||
        task.projectPlanning_task_subtasks_details.length === 0
      ) {
        return taskSum
      }

      const subTaskSum = task.projectPlanning_task_subtasks_details.reduce(
        (subTaskSum, subtask) => {
          return subTaskSum + calculateSubTaskPlannedHrs(subtask)
        },
        0,
      )

      return taskSum + subTaskSum
    }, 0)
  }

  const calculateModuleActualHrs = (module) => {
    if (
      !module.projectPlanning_module_tasks_details ||
      module.projectPlanning_module_tasks_details.length === 0
    ) {
      return ''
    }

    return module.projectPlanning_module_tasks_details.reduce((taskSum, task) => {
      if (
        !task.projectPlanning_task_subtasks_details ||
        task.projectPlanning_task_subtasks_details.length === 0
      ) {
        return taskSum
      }

      const subTaskSum = task.projectPlanning_task_subtasks_details.reduce(
        (subTaskSum, subtask) => {
          return subTaskSum + calculateSubTaskActualHrs(subtask)
        },
        0,
      )

      return taskSum + subTaskSum
    }, 0)
  }

  const calculateTaskPlannedHrs = (task) => {
    if (
      !task.projectPlanning_task_subtasks_details ||
      task.projectPlanning_task_subtasks_details.length === 0
    ) {
      return 0
    }

    return task.projectPlanning_task_subtasks_details.reduce((sum, subtask) => {
      return sum + calculateSubTaskPlannedHrs(subtask)
    }, 0)
  }

  const calculateTaskActualHrs = (task) => {
    if (
      !task.projectPlanning_task_subtasks_details ||
      task.projectPlanning_task_subtasks_details.length === 0
    ) {
      return ''
    }

    return task.projectPlanning_task_subtasks_details.reduce((sum, subtask) => {
      return sum + calculateSubTaskActualHrs(subtask)
    }, 0)
  }

  const [disable, setDisable] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(' ')

  const handleStatusFilter2 = (status) => {
    setSelectedStatus(status)
    setDisable(false)
    let filtered = []
    if (status === 'Yet To Assign') {
      filtered = projectPlanning_data.filter((project) =>
        project.project_planning_moduleDetails.every((module) =>
          module.projectPlanning_module_tasks_details.every((task) =>
            task.projectPlanning_task_subtasks_details.every((subtask) =>
              subtask.projectPlanning_subTasks_Activities_details.every(
                (activity) =>
                  activity.assignedTo_employeeID === 0 || activity.assignedTo_employeeID === null,
              ),
            ),
          ),
        ),
      )
      setfilterData(filtered)
    } else if (status === 'Partially Assigned') {
      filtered = projectPlanning_data.filter((project) =>
        project.project_planning_moduleDetails.some((module) =>
          module.projectPlanning_module_tasks_details.some((task) =>
            task.projectPlanning_task_subtasks_details.some((subtask) => {
              const activities = subtask.projectPlanning_subTasks_Activities_details
              const hasNonZeroNonNull = activities.some(
                (activity) =>
                  activity.assignedTo_employeeID !== null && activity.assignedTo_employeeID !== 0,
              )
              const hasZeroOrNull = activities.some(
                (activity) =>
                  activity.assignedTo_employeeID === null || activity.assignedTo_employeeID === 0,
              )
              return hasNonZeroNonNull && hasZeroOrNull
            }),
          ),
        ),
      )
      setfilterData(filtered)
    } else if (status === 'Completely Assigned') {
      filtered = projectPlanning_data.filter((project) =>
        project.project_planning_moduleDetails.every((module) =>
          module.projectPlanning_module_tasks_details.every((task) =>
            task.projectPlanning_task_subtasks_details.every((subtask) =>
              subtask.projectPlanning_subTasks_Activities_details.every(
                (activity) =>
                  activity.assignedTo_employeeID !== 0 && activity.assignedTo_employeeID !== null,
              ),
            ),
          ),
        ),
      )
      setfilterData(filtered)
    }
    // setfilterData(filtered)
  }
  const handleReset = () => {
    setSelectedStatus('Select a Status')
    setfilterData(projectPlanning_data)
  }
  const handleCloseModal = async () => {
    setVisibleUpdate_projectPlanning(false)
  }
  const handleCloseModal2 = async () => {
    setVisible_assignTask(false)
    await fetchProjectPlanning()
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Project Assignment</strong>
          <CButton style={{ cursor: 'pointer' }} onClick={handleReset} disabled={disable}>
            Reset
          </CButton>
        </CCardHeader>
        <CCardBody>
          <div className="filterDiv">
            <CFormSelect
              onChange={(e) => {
                handleStatusFilter2(e.target.value)
              }}
              value={selectedStatus}
            >
              <option value=" ">Select a Status</option>
              <option value="Yet To Assign">Yet To Assign</option>
              <option value="Partially Assigned">Partially Assigned</option>
              <option value="Completely Assigned">Completely Assigned</option>
            </CFormSelect>
          </div>
          {/* ///////////////////////////Data Table Start/////////////////////////////////// */}
          <DataTable
            style={{ borderRadius: '3px' }}
            columns={columns}
            data={filterData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            fixedHeader
            responsive
            highlightOnHover
            subHeader
            striped
            subHeaderComponent={
              // <input
              //   type="text"
              //   placeholder="Search here"
              //   className="w-25 form-control"
              //   value={search}
              //   onChange={(e) => setSearch(e.target.value)}
              // />

              <>
                <div className="timeDetails">
                  <b className="newBold">
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleStatusFilter2('Yet To Assign')
                      }}
                      className="statusItem1"
                    >
                      Yet To Assign
                    </p>
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleStatusFilter2('Partially Assigned')
                      }}
                      className="statusItem2"
                    >
                      Partially Assigned
                    </p>
                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleStatusFilter2('Completely Assigned')
                      }}
                      className="statusItem3"
                    >
                      Completely Assigned
                    </p>
                  </b>
                </div>
              </>
            }
            conditionalRowStyles={[
              {
                when: (row) => isAllActivitiesAssignedToZero(row),
                style: {
                  backgroundColor: '#bdced7',
                  color: 'black',
                },
              },
              {
                when: (row) => isAnyActivityAssignedToNonZero(row),
                style: {
                  backgroundColor: '#d1fe24',
                  color: 'black',
                },
              },
              {
                when: (row) => areAllActivitiesAssigned(row),
                style: {
                  backgroundColor: '#1cfa20',
                  color: 'black',
                },
              },
            ]}
          />
        </CCardBody>

        {/* //////////////////////////////////////// update Model Start ////////////////////////////////////////////// */}
        {updateToast && (
          <>
            <CToaster placement="top-center">
              <CToast
                title="CoreUI for React.js"
                autohide={false}
                visible={true}
                onClose={() => setUpdateToast(false)}
              >
                <CToastHeader closeButton>
                  <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                  >
                    <rect width="100%" height="100%" fill="#007aff"></rect>
                  </svg>
                  <strong className="me-auto">Info</strong>
                </CToastHeader>
                <CToastBody style={{ color: 'green', textAlign: 'center' }}>
                  Project Planning updated successfully...
                </CToastBody>
              </CToast>
            </CToaster>
          </>
        )}
        {/* //////////////////////////////////////// update Model end ////////////////////////////////////////////// */}

        {/* ///////////////////////////////////////// Assign Task Model Start ////////////////////////////////////////*/}

        <CModal
          fullscreen
          visible={visible_assignTask}
          onClose={() => setVisible_assignTask(false)}
        >
          <CModalHeader>
            <CModalTitle>
              Assign Task for :-
              {projectPlanning_to_assign.purchaseOrder?.clientNameDetails !== undefined
                ? projectPlanning_to_assign.purchaseOrder.clientNameDetails.clientName
                : ''}
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
                <h6 className="mb-4">Modules DetailXs</h6>

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
                      <th colSpan={3}>Planned</th>
                      <th colSpan={6}>Actual</th>
                    </tr>
                    <tr>
                      <th style={{ width: '50px' }}>Sr.No.</th>
                      <th>Modules</th>

                      <th>Tasks</th>

                      <th> Sub Tasks</th>

                      <th>Activities</th>

                      <th style={{ width: '130px' }}> Start Date</th>
                      <th style={{ width: '130px' }}>End Date</th>
                      <th style={{ width: '50px' }}>Hrs</th>
                      <th style={{ width: '130px' }}>Start Date</th>
                      <th style={{ width: '130px' }}>End Date</th>
                      <th style={{ width: '50px' }}> Hrs</th>
                      <th>Assign To</th>
                      <th>Hrs</th>
                      <th></th>
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
                                <td>{formatDate(data.module_planned_startDate)}</td>
                                <td>{formatDate(data.module_planned_endDate)}</td>
                                <td>{data.module_planned_Hrs}</td>
                                <td>{formatDate(data.module_actual_startDate)}</td>
                                <td>{formatDate(data.module_actual_endDate)}</td>
                                <td>{data.module_actual_hrs}</td>
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
                                                    total + parseFloat(activity.assigned_hrs || 0),
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
                                <td>
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
                                          style={{
                                            background: ' antiquewhite',
                                          }}
                                        >
                                          <td colSpan={2}>{`${index + 1}.${taskIndex + 1}`}</td>

                                          <td colSpan={3}>{task.project_modules_tasks}</td>
                                          <td>{formatDate(task.tasks_planned_startDate)}</td>
                                          <td>{formatDate(task.tasks_planned_endDate)}</td>
                                          <td>{task.tasks_planned_Hrs}</td>
                                          <td>{formatDate(task.tasks_actual_startDate)}</td>
                                          <td>{formatDate(task.tasks_actual_endDate)}</td>
                                          <td>{task.tasks_actual_hrs}</td>
                                          <td></td>
                                          <td></td>
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
                                                    style={{
                                                      background: ' aquamarine',
                                                    }}
                                                  >
                                                    <td colSpan={3}>{`${index + 1}.${
                                                      taskIndex + 1
                                                    }.${subTaskIndex + 1}`}</td>
                                                    <td colSpan={2}>
                                                      {subTask.project_modules_subTasks}
                                                    </td>
                                                    <td>
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
                                                    <td>{subTask.subTasks_actual_hrs}</td>
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
                                                          // eslint-disable-next-line react/jsx-key
                                                          <React.Fragment>
                                                            <tr
                                                              key={`${index}-${taskIndex}-${subTaskIndex}-${activitiesIndex}`}
                                                              style={{
                                                                background:
                                                                  'rgba(0, 255, 255, 0.22)',
                                                              }}
                                                            >
                                                              <td colSpan={4}>{`${index + 1}.${
                                                                taskIndex + 1
                                                              }.${subTaskIndex + 1}.${
                                                                activitiesIndex + 1
                                                              }`}</td>
                                                              <td
                                                                colSpan={1}
                                                                style={{
                                                                  width: '250px',
                                                                }}
                                                              >
                                                                {
                                                                  activities.project_modules_activities
                                                                }
                                                              </td>
                                                              <td>
                                                                {formatDate(
                                                                  activities.activities_planned_startDate,
                                                                )}
                                                              </td>
                                                              <td>
                                                                {formatDate(
                                                                  activities.activities_planned_endDate,
                                                                )}
                                                              </td>
                                                              <td>
                                                                {activities.activities_planned_Hrs}
                                                              </td>
                                                              <td>
                                                                {formatDate(
                                                                  activities.activities_actual_startDate,
                                                                )}
                                                              </td>
                                                              <td>
                                                                {formatDate(
                                                                  activities.activities_actual_endDate,
                                                                )}
                                                              </td>
                                                              <td>
                                                                {activities.activities_actual_hrs}
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: '150px',
                                                                }}
                                                              >
                                                                <CFormSelect
                                                                  name="assignedTo_employeeID"
                                                                  value={
                                                                    activities.assignedTo_employeeID ||
                                                                    ''
                                                                  }
                                                                  onChange={(e) => {
                                                                    handleAssignedEmployeeChange(
                                                                      e,
                                                                      activities.id,
                                                                      projectPlanning_to_assign.id,
                                                                    )
                                                                  }}
                                                                >
                                                                  <option value="" disabled>
                                                                    Select an employee
                                                                  </option>
                                                                  {activeEmployee.map(
                                                                    (data, index) => (
                                                                      <option
                                                                        key={index}
                                                                        value={data.id}
                                                                      >
                                                                        {`${data.firstName} ${data.midName} ${data.lastName}`}
                                                                      </option>
                                                                    ),
                                                                  )}
                                                                </CFormSelect>
                                                              </td>
                                                              <td
                                                                style={{
                                                                  width: '50px',
                                                                }}
                                                              >
                                                                <CFormInput
                                                                  style={{
                                                                    width: '50px',
                                                                  }}
                                                                  placeholder="Hrs"
                                                                  name="assignedHrs"
                                                                  value={activities.assigned_hrs}
                                                                  onChange={(e) =>
                                                                    handleAssignedHrsChange(
                                                                      e,
                                                                      activities.id,
                                                                    )
                                                                  }
                                                                  onBlur={(e) => {
                                                                    handleAssignedHrs(
                                                                      e,
                                                                      activities.id,
                                                                    )
                                                                  }}
                                                                />
                                                              </td>
                                                              <td></td>
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
            <CButton color="secondary" onClick={() => handleCloseModal2()}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          fullscreen
          visible={visibleUpdate_projectPlanning}
          onClose={() => setVisibleUpdate_projectPlanning(false)}
        >
          <CModalHeader>
            <CModalTitle>
              Update Project Planning :-
              {purchaseOrder_ToUpdate.purchaseOrder?.clientNameDetails !== undefined
                ? purchaseOrder_ToUpdate.purchaseOrder.clientNameDetails.clientName
                : ''}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" validated={validated}>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="projectName"
                  name="project_name"
                  label={
                    <span>
                      Name of Project
                      <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  value={purchaseOrder_ToUpdate.project_name || ''}
                  onChange={(e) => {
                    setPurchaseOrder_ToUpdate({
                      ...purchaseOrder_ToUpdate,
                      project_name: e.target.value,
                    })
                  }}
                  placeholder="Name of Project"
                  feedbackInvalid="Please provide Name of Project."
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  id="customFile"
                  type="file"
                  name="project_file"
                  label="File"
                  custom
                  multiple
                  onChange={(event) => {
                    const files = event.target.files
                    const newProjectFiles = Array.from(files)

                    setPurchaseOrder_ToUpdate((prevPurchaseOrder) => ({
                      ...prevPurchaseOrder,
                      project_file: prevPurchaseOrder.project_file
                        ? [...prevPurchaseOrder.project_file, ...newProjectFiles]
                        : newProjectFiles,
                    }))
                  }}
                />

                {purchaseOrder_ToUpdate.project_file && (
                  <ol>
                    {purchaseOrder_ToUpdate.project_file.map((file, i) => (
                      <li key={i}>
                        {file.name}
                        <CIcon
                          icon={cilX}
                          className={styles.crossBtn}
                          onClick={() => {
                            handleRemove_updateProject_file(i)
                          }}
                        ></CIcon>
                      </li>
                    ))}
                  </ol>
                )}

                {purchaseOrder_ToUpdate.project_planning_files ? (
                  <ol>
                    {purchaseOrder_ToUpdate.project_planning_files.map((data, index) => (
                      <li key={index}>
                        <a
                          style={{ width: '106px' }}
                          href={`${USER_API_ENDPOINT}uploads/${data.project_file}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                        <CIcon
                          icon={cilX}
                          className={styles.crossBtn}
                          onClick={() => handleRemoveAttachment(index)}
                        ></CIcon>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No purchase order details available.</p>
                )}
              </CCol>

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

                <table className="newTable">
                  <thead id="header">
                    <tr>
                      <th colSpan={9}></th>
                      <th colSpan={3}>Planned</th>
                      <th colSpan={5}>Actual</th>
                    </tr>
                    <tr>
                      <th>Modules</th>

                      <th>Tasks</th>
                      <th></th>
                      <th>Sub Tasks</th>
                      <th></th>
                      <th>Activities</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Hrs</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Hrs</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>

                  {purchaseOrder_ToUpdate.project_planning_moduleDetails ? (
                    purchaseOrder_ToUpdate.project_planning_moduleDetails.map((val, i) => (
                      <>
                        {console.log('data', val)}
                        <tbody id="tbody">
                          <React.Fragment key={i}>
                            {console.log('Iteration:', i, 'Value:', val)}
                            <tr>
                              <td colSpan={6}>
                                <CFormInput
                                  name="modules"
                                  placeholder="Modules"
                                  value={val?.project_modules || ''}
                                  onChange={(e) => handleInputChange(e, i, 'project_modules')}
                                  style={{
                                    width: '590px',
                                    background: 'floralwhite',
                                  }}
                                />
                              </td>

                              <td colSpan={3} className="dropdown" onClick={() => collapseBtn(i)}>
                                {' '}
                                <CIcon
                                  icon={isCollapsed[i] ? cilChevronCircleDownAlt : cilChevronTop}
                                  style={{
                                    position: 'relative',
                                    left: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '30px',
                                    cursor: 'pointer',
                                  }}
                                  className="dropdownC"
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name="planned_startDate"
                                  onChange={(e) =>
                                    handleInputChange(e, i, 'module_planned_startDate')
                                  }
                                  value={val?.module_planned_startDate || ''}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name="planned_endDate"
                                  onChange={(e) =>
                                    handleInputChange(e, i, 'module_planned_endDate')
                                  }
                                  value={val?.module_planned_endDate || ''}
                                />
                              </td>

                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name="planned_Hrs"
                                  // onChange={(e) => handleInputChange(e, i, 'module_planned_Hrs')}
                                  value={
                                    val.projectPlanning_module_tasks_details &&
                                    val.projectPlanning_module_tasks_details.length > 0
                                      ? calculateModulePlannedHrs(val)
                                      : ''
                                  }
                                  readOnly
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  value={val?.module_actual_startDate || ''}
                                  onChange={(e) =>
                                    handleInputChange(e, i, 'module_actual_startDate')
                                  }
                                  name="actual_startDate"
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  value={val?.module_actual_endDate || ''}
                                  onChange={(e) => handleInputChange(e, i, 'module_actual_endDate')}
                                  name="actual_endDate"
                                />
                              </td>

                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name="actual_hrs"
                                  // onChange={(e) => handleInputChange(e, i, 'module_actual_hrs')}
                                  value={
                                    val.projectPlanning_module_tasks_details &&
                                    val.projectPlanning_module_tasks_details.length > 0
                                      ? calculateModuleActualHrs(val)
                                      : ''
                                  }
                                  readOnly
                                />
                              </td>
                              <td>
                                <CButton onClick={handle_onupdate_Modules}>+</CButton>
                              </td>
                              <td>
                                <CButton
                                  onClick={() => {
                                    handleRemove_Modules(i, val?.id)
                                  }}
                                  style={{
                                    backgroundColor: 'red',
                                    border: 'none',
                                  }}
                                  disabled={val.length === 1}
                                >
                                  -
                                </CButton>
                              </td>
                            </tr>
                            {!isCollapsed[i] && (
                              <>
                                <tr>
                                  <td></td>
                                  <td colSpan={6}>
                                    <CFormInput
                                      style={{
                                        width: '488px',
                                        background: ' antiquewhite',
                                      }}
                                      placeholder="Tasks"
                                      name={`task-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .project_modules_tasks
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'project_modules_tasks')
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleAddTasks_onupdate(i)
                                      }}
                                    >
                                      +
                                    </CButton>
                                  </td>
                                  <td>
                                    <CButton
                                      disabled={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length === 1
                                      }
                                      onClick={() => {
                                        handleRemove_Tasks(
                                          i,
                                          0,
                                          val.projectPlanning_module_tasks_details &&
                                            val.projectPlanning_module_tasks_details.length > 0
                                            ? val.projectPlanning_module_tasks_details[0].id
                                            : '',
                                        )
                                      }}
                                      style={{
                                        backgroundColor: 'red',
                                        border: 'none',
                                      }}
                                    >
                                      -
                                    </CButton>
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`task_planned_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .tasks_planned_startDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_planned_startDate')
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`task_planned_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .tasks_planned_endDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_planned_endDate')
                                      }
                                    />
                                  </td>

                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`task_planned_Hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? calculateTaskPlannedHrs(
                                              val.projectPlanning_module_tasks_details[0],
                                            )
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_planned_Hrs')
                                      }
                                      readOnly
                                    />
                                  </td>

                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`task_actual_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .tasks_actual_startDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_actual_startDate')
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`task_actual_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .tasks_actual_endDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_actual_endDate')
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`task_actual_hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0
                                          ? calculateTaskActualHrs(
                                              val.projectPlanning_module_tasks_details[0],
                                            )
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange(e, i, 0, 'tasks_actual_hrs')
                                      }
                                      readOnly
                                    />
                                  </td>

                                  <td colSpan={2}></td>
                                </tr>
                                <tr>
                                  <td></td>

                                  <td></td>
                                  <td colSpan={5}>
                                    <CFormInput
                                      placeholder="Sub Tasks"
                                      name={`subTask-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .project_modules_subTasks
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .project_modules_subTasks
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'project_modules_subTasks',
                                        )
                                      }
                                      style={{ background: ' aquamarine' }}
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleModule_subtask_onUpdate(i)
                                      }}
                                    >
                                      +
                                    </CButton>
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() =>
                                        // eslint-disable-next-line no-undef
                                        handleRemove_SubTasks(i, 0, 0, subtaskId || '')
                                      }
                                      style={{
                                        backgroundColor: 'red',
                                        border: 'none',
                                      }}
                                      disabled={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length === 1
                                      }
                                    >
                                      -
                                    </CButton>
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`subTask_planned_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .subTasks_planned_startDate
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_startDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'subTasks_planned_startDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`subTask_planned_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .subTasks_planned_endDate
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_endDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'subTasks_planned_endDate',
                                        )
                                      }
                                    />
                                  </td>
                                  {/* <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`subTask_planned_Hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .subTasks_planned_Hrs
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_Hrs
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(e, i, 0, 0, 'subTasks_planned_Hrs')
                                      }
                                    />
                                  </td> */}
                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`subTask_planned_Hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0
                                          ? calculateSubTaskPlannedHrs(
                                              val.projectPlanning_module_tasks_details[0]
                                                .projectPlanning_task_subtasks_details[0],
                                            )
                                          : ''
                                      }
                                      readOnly
                                      onChange={(e) =>
                                        handleSubTaskInputChange(e, i, 0, 0, 'subTasks_planned_Hrs')
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`subTask_actual_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .subTasks_actual_startDate
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_startDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'subTasks_actual_startDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`subTask_actual_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details[0]
                                          .subTasks_actual_endDate
                                          ? val.projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_endDate
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'subTasks_actual_endDate',
                                        )
                                      }
                                    />
                                  </td>
                                  {/* <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`subTask_actual_hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                          val.projectPlanning_module_tasks_details.length > 0 &&
                                          val.projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details &&
                                          val.projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details.length > 0 &&
                                          val.projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details[0]
                                            .subTasks_actual_hrs
                                          ? val.projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details[0]
                                            .subTasks_actual_hrs
                                          : ''
                                      }
                                      onChange={(e) =>
                                        handleSubTaskInputChange(e, i, 0, 0, 'subTasks_actual_hrs')
                                      }
                                    />
                                  </td> */}
                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`subTask_actual_hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details.length > 0 &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details &&
                                        val.projectPlanning_module_tasks_details[0]
                                          .projectPlanning_task_subtasks_details.length > 0
                                          ? calculateSubTaskActualHrs(
                                              val.projectPlanning_module_tasks_details[0]
                                                .projectPlanning_task_subtasks_details[0],
                                            )
                                          : ''
                                      }
                                      readOnly
                                      onChange={(e) =>
                                        handleSubTaskInputChange(e, i, 0, 0, 'subTasks_actual_hrs')
                                      }
                                    />
                                  </td>

                                  <td colSpan={2}></td>
                                </tr>
                                <tr>
                                  <td></td>

                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td colSpan={3}>
                                    <CFormInput
                                      placeholder="Activities"
                                      name={`activities-${i}`}
                                      style={{ background: '#00ffff38' }}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.project_modules_activities || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'project_modules_activities',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleModule_activities_onUpdate(i)
                                      }}
                                    >
                                      +
                                    </CButton>
                                  </td>
                                  <td>
                                    <CButton
                                      style={{
                                        backgroundColor: 'red',
                                        border: 'none',
                                      }}
                                      onClick={() =>
                                        handleRemove_activities(
                                          i,
                                          0,
                                          0,
                                          0,
                                          val.projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.id || '',
                                        )
                                      }
                                    >
                                      -
                                    </CButton>
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`activities_planned_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_planned_startDate || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_planned_startDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`activities_planned_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_planned_endDate || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_planned_endDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`activities_planned_Hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_planned_Hrs || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_planned_Hrs',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`activities_actual_startDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_actual_startDate || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_actual_startDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      type="date"
                                      name={`activities_actual_endDate-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_actual_endDate || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_actual_endDate',
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <CFormInput
                                      style={{ width: '50px' }}
                                      placeholder="Hrs"
                                      name={`activities_actual_hrs-${i}`}
                                      value={
                                        val.projectPlanning_module_tasks_details?.[0]
                                          ?.projectPlanning_task_subtasks_details?.[0]
                                          ?.projectPlanning_subTasks_Activities_details?.[0]
                                          ?.activities_actual_hrs || ''
                                      }
                                      onChange={(e) =>
                                        handleActivitiesInputChange(
                                          e,
                                          i,
                                          0,
                                          0,
                                          0,
                                          'activities_actual_hrs',
                                        )
                                      }
                                    />
                                  </td>
                                  <td colSpan={2}></td>
                                </tr>
                              </>
                            )}

                            {/* ////////////////////////////////////////////////// for activies start ///////////////////////////////// */}

                            {val.projectPlanning_module_tasks_details &&
                              val.projectPlanning_module_tasks_details[0]
                                ?.projectPlanning_task_subtasks_details &&
                              val.projectPlanning_module_tasks_details[0]?.projectPlanning_task_subtasks_details[0]?.projectPlanning_subTasks_Activities_details
                                ?.slice(1)
                                ?.map((activity, activityIndex) => (
                                  <React.Fragment key={`${i}-${activityIndex}`}>
                                    <tr>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td colSpan={3}>
                                        <CFormInput
                                          placeholder="Activities"
                                          name={`activities-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'project_modules_activities',
                                            )
                                          }
                                          value={activity?.project_modules_activities || ''}
                                          style={{ background: '#00ffff38' }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleModule_activities_onUpdate(i)
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_activities(
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              activity?.id,
                                            )
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_startDate-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_planned_startDate',
                                            )
                                          }
                                          value={activity?.activities_planned_startDate || ''}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_endDate-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_planned_endDate',
                                            )
                                          }
                                          value={activity?.activities_planned_endDate || ''}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_planned_Hrs-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_planned_Hrs',
                                            )
                                          }
                                          value={activity?.activities_planned_Hrs || ''}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_startDate-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_actual_startDate',
                                            )
                                          }
                                          value={activity?.activities_actual_startDate || ''}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_endDate-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_actual_endDate',
                                            )
                                          }
                                          value={activity?.activities_actual_endDate || ''}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_actual_Hrs-${i}-${activityIndex}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              0,
                                              activityIndex + 1,
                                              'activities_actual_hrs',
                                            )
                                          }
                                          value={activity?.activities_actual_hrs || ''}
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  </React.Fragment>
                                ))}

                            {/* ////////////////////////////////////////////////////////////// for activies end ////////////////////////////////////////////////////// */}

                            {/* ///////////////////////////////// task[0] subtask //////////////// */}

                            {val.projectPlanning_module_tasks_details &&
                              val.projectPlanning_module_tasks_details[0]
                                ?.projectPlanning_task_subtasks_details &&
                              val.projectPlanning_module_tasks_details[0]?.projectPlanning_task_subtasks_details
                                .slice(1)
                                .map((subtask, j) => (
                                  <React.Fragment key={`${i}-${j}`}>
                                    {console.log(subtask)}
                                    <tr>
                                      <td></td>

                                      <td></td>
                                      <td colSpan={5}>
                                        <CFormInput
                                          placeholder="Sub Tasks"
                                          name={`subTask-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'project_modules_subTasks',
                                            )
                                          }
                                          value={subtask.project_modules_subTasks}
                                          style={{
                                            background: ' aquamarine',
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleModule_subtask_onUpdate(i)
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_SubTasks(i, 0, j + 1, subtask.id)
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_planned_startDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTasks_planned_startDate',
                                            )
                                          }
                                          value={subtask.subTasks_planned_startDate}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_planned_endDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTasks_planned_endDate',
                                            )
                                          }
                                          value={subtask.subTasks_planned_endDate}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`subTask_planned_Hrs-${i}-${j}`}
                                          value={
                                            subtask.projectPlanning_task_subtasks_details &&
                                            subtask.projectPlanning_task_subtasks_details.length > 0
                                              ? subtask.projectPlanning_task_subtasks_details
                                                  .reduce(
                                                    (sum, subtask) =>
                                                      sum +
                                                      parseFloat(subtask.subTask_planned_Hrs || 0),
                                                    0,
                                                  )
                                                  .toString()
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTask_planned_Hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_actual_startDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTasks_actual_startDate',
                                            )
                                          }
                                          value={subtask.subTasks_actual_startDate}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_actual_endDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTasks_actual_endDate',
                                            )
                                          }
                                          value={subtask.subTasks_actual_endDate}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`subTask_actual_hrs-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTasks_actual_hrs',
                                            )
                                          }
                                          value={subtask.subTasks_actual_hrs}
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td></td>

                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td colSpan={3}>
                                        <CFormInput
                                          placeholder="Activities"
                                          name={`activities-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'project_modules_activities',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.project_modules_activities
                                          }
                                          style={{ background: '#00ffff38' }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleModule_activities_for_subindex_onUpdate(i, j)
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_activities(
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
                                                ?.id,
                                            )
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_startDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_planned_startDate',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_planned_startDate
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_endDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_planned_endDate',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_planned_endDate
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_planned_Hrs-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_planned_Hrs',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_planned_Hrs
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_startDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_actual_startDate',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_actual_startDate
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_endDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_actual_endDate',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_actual_endDate
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_actual_hrs-${i}-${j}`}
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              0,
                                              'activities_actual_hrs',
                                            )
                                          }
                                          value={
                                            subtask.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.activities_actual_hrs
                                          }
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    {/* /////////////////////////////////////////////// for task[0] sub+1 activities///////////////////////////// */}
                                    {val.projectPlanning_module_tasks_details[0]?.projectPlanning_task_subtasks_details[
                                      j + 1
                                    ]?.projectPlanning_subTasks_Activities_details
                                      ?.slice(1)
                                      .map((activie, aindex) => (
                                        <React.Fragment key={`${i}-${j}-${aindex}`}>
                                          <tr>
                                            <td></td>

                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td colSpan={3}>
                                              <CFormInput
                                                placeholder="Activities"
                                                name={`activities-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'project_modules_activities',
                                                  )
                                                }
                                                value={activie.project_modules_activities}
                                                style={{
                                                  background: '#00ffff38',
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <CButton
                                                onClick={() => {
                                                  handleModule_activities_for_subindex_onUpdate(
                                                    i,
                                                    j,
                                                  )
                                                }}
                                              >
                                                +
                                              </CButton>
                                            </td>
                                            <td>
                                              <CButton
                                                style={{
                                                  backgroundColor: 'red',
                                                  border: 'none',
                                                }}
                                                onClick={() => {
                                                  handleRemove_activities(
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    activie.id,
                                                  )
                                                }}
                                              >
                                                -
                                              </CButton>
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_planned_startDate-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_planned_startDate',
                                                  )
                                                }
                                                value={activie.activities_planned_startDate}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_planned_endDate-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_planned_endDate',
                                                  )
                                                }
                                                value={activie.activities_planned_endDate}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                style={{ width: '50px' }}
                                                placeholder="Hrs"
                                                name={`activities_planned_Hrs-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_planned_Hrs',
                                                  )
                                                }
                                                value={activie.activities_planned_Hrs}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_actual_startDate-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_actual_startDate',
                                                  )
                                                }
                                                value={activie.activities_actual_startDate}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_actual_endDate-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_actual_endDate',
                                                  )
                                                }
                                                value={activie.activities_actual_endDate}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                style={{ width: '50px' }}
                                                placeholder="Hrs"
                                                name={`activities_actual_hrs-${i}-${j}-${aindex}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    0,
                                                    j + 1,
                                                    aindex + 1,
                                                    'activities_actual_hrs',
                                                  )
                                                }
                                                value={activie.activities_actual_hrs}
                                              />
                                            </td>
                                            <td></td>
                                            <td></td>
                                          </tr>
                                        </React.Fragment>
                                      ))}
                                  </React.Fragment>
                                ))}

                            {/* ////////////////////////////////////////////////////////// for adding tasks //////////////////////////////////////////////////////////////////////////////////  */}

                            {val.projectPlanning_module_tasks_details &&
                              val.projectPlanning_module_tasks_details
                                .slice(1)
                                .map((task, taskindex) => (
                                  <React.Fragment key={`${i}-${taskindex}`}>
                                    {console.log('tasks', task)}
                                    <tr>
                                      <td></td>
                                      <td colSpan={6}>
                                        <CFormInput
                                          style={{
                                            width: '488px',
                                            background: ' antiquewhite',
                                          }}
                                          placeholder="Tasks"
                                          name={`task-${i}-${taskindex}`}
                                          value={task.project_modules_tasks}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'project_modules_tasks',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleAddTasks_onupdate(i)
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_Tasks(i, taskindex + 1, task.id)
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`task_planned_startDate-${i}-${taskindex}`}
                                          value={task.tasks_planned_startDate}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_planned_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`task_planned_endDate-${i}-${taskindex}`}
                                          value={task.tasks_planned_endDate}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_planned_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`task_planned_Hrs-${i}-${taskindex}`}
                                          value={task.tasks_planned_Hrs}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_planned_Hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`task_actual_startDate-${i}-${taskindex}`}
                                          value={task.tasks_actual_startDate}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_actual_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`task_actual_endDate-${i}-${taskindex}`}
                                          value={task.tasks_actual_endDate}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_actual_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`task_actual_hrs-${i}-${taskindex}`}
                                          value={task.tasks_actual_hrs}
                                          onChange={(e) =>
                                            handleTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              'tasks_actual_hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td></td>

                                      <td></td>
                                      <td colSpan={5}>
                                        <CFormInput
                                          placeholder="Sub Tasks"
                                          name={`subTask-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .project_modules_subTasks
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'project_modules_subTasks',
                                            )
                                          }
                                          style={{
                                            background: ' aquamarine',
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleAddSubTasks_onUpdate(i, taskindex)
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_SubTasks(
                                              i,
                                              taskindex + 1,
                                              0,
                                              task.projectPlanning_task_subtasks_details &&
                                                task.projectPlanning_task_subtasks_details.length >
                                                  0
                                                ? task.projectPlanning_task_subtasks_details[0].id
                                                : '',
                                            )
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_planned_startDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_startDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_planned_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_planned_endDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_endDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_planned_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`subTask_planned_Hrs-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_Hrs
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_planned_Hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_actual_startDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_startDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_actual_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_actual_endDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_endDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_actual_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`subTask_actual_hrs-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_hrs
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              'subTasks_actual_hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td></td>

                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td colSpan={3}>
                                        <CFormInput
                                          placeholder="Activities"
                                          name={`activities-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .project_modules_activities
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'project_modules_activities',
                                            )
                                          }
                                          style={{ background: '#00ffff38' }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleAdd_activities_forSubTask1_onUpdate(
                                              i,
                                              taskindex + 1,
                                              0,
                                            )
                                          }}
                                        >
                                          +
                                        </CButton>
                                      </td>
                                      <td>
                                        <CButton
                                          style={{
                                            backgroundColor: 'red',
                                            border: 'none',
                                          }}
                                          onClick={() => {
                                            handleRemove_activities(
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              task.projectPlanning_task_subtasks_details &&
                                                task.projectPlanning_task_subtasks_details.length >
                                                  0 &&
                                                task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task.projectPlanning_task_subtasks_details[0]
                                                    .projectPlanning_subTasks_Activities_details[0]
                                                    .id
                                                : '',
                                            )
                                          }}
                                        >
                                          -
                                        </CButton>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_startDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_startDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_planned_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_planned_endDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_endDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_planned_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_planned_Hrs-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_Hrs
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_planned_Hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_startDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_startDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_actual_startDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`activities_actual_endDate-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_endDate
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_actual_endDate',
                                            )
                                          }
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          style={{ width: '50px' }}
                                          placeholder="Hrs"
                                          name={`activities_actual_hrs-${i}-${taskindex}`}
                                          value={
                                            task.projectPlanning_task_subtasks_details &&
                                            task.projectPlanning_task_subtasks_details.length > 0 &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details &&
                                            task.projectPlanning_task_subtasks_details[0]
                                              .projectPlanning_subTasks_Activities_details.length >
                                              0
                                              ? task.projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_hrs
                                              : ''
                                          }
                                          onChange={(e) =>
                                            handleActivitiesInputChange(
                                              e,
                                              i,
                                              taskindex + 1,
                                              0,
                                              0,
                                              'activities_actual_hrs',
                                            )
                                          }
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                    {/* ///////////////////////////////////////////// for activities task+1 sub=0 /////////////////////////////////////////////////////// */}
                                    {val.projectPlanning_module_tasks_details[
                                      taskindex + 1
                                    ]?.projectPlanning_task_subtasks_details?.[0]?.projectPlanning_subTasks_Activities_details
                                      ?.slice(1)
                                      ?.map((activity, asi) => (
                                        <React.Fragment key={`${i}-${taskindex}-${asi}`}>
                                          <tr>
                                            <td></td>

                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td colSpan={3}>
                                              <CFormInput
                                                placeholder="Activities"
                                                name={`activities-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'project_modules_activities',
                                                  )
                                                }
                                                value={activity?.project_modules_activities || ''}
                                                style={{
                                                  background: '#00ffff38',
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <CButton
                                                onClick={() => {
                                                  handleAdd_activities_forSubTask1_onUpdate(
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                  )
                                                }}
                                              >
                                                +
                                              </CButton>
                                            </td>
                                            <td>
                                              <CButton
                                                style={{
                                                  backgroundColor: 'red',
                                                  border: 'none',
                                                }}
                                                onClick={() => {
                                                  handleRemove_activities(
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    activity?.id,
                                                  )
                                                }}
                                              >
                                                -
                                              </CButton>
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_planned_startDate-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_planned_startDate',
                                                  )
                                                }
                                                value={activity?.activities_planned_startDate || ''}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_planned_endDate-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_planned_endDate',
                                                  )
                                                }
                                                value={activity?.activities_planned_endDate || ''}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                style={{ width: '50px' }}
                                                placeholder="Hrs"
                                                name={`activities_planned_Hrs-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_planned_Hrs',
                                                  )
                                                }
                                                value={activity?.activities_planned_Hrs || ''}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_actual_startDate-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_actual_startDate',
                                                  )
                                                }
                                                value={activity?.activities_actual_startDate || ''}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                type="date"
                                                name={`activities_actual_endDate-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_actual_endDate',
                                                  )
                                                }
                                                value={activity?.activities_actual_endDate || ''}
                                              />
                                            </td>
                                            <td>
                                              <CFormInput
                                                style={{ width: '50px' }}
                                                placeholder="Hrs"
                                                name={`activities_actual_hrs-${i}-${taskindex}-${asi}`}
                                                onChange={(e) =>
                                                  handleActivitiesInputChange(
                                                    e,
                                                    i,
                                                    taskindex + 1,
                                                    0,
                                                    asi + 1,
                                                    'activities_actual_hrs',
                                                  )
                                                }
                                                value={activity?.activities_actual_hrs || ''}
                                              />
                                            </td>
                                            <td></td>
                                            <td></td>
                                          </tr>
                                        </React.Fragment>
                                      ))}

                                    {/* ///////////////////////////////////////////// for task +1 subtask  //////////////////////////////////////////////// */}
                                    {val.projectPlanning_module_tasks_details[taskindex + 1]
                                      .projectPlanning_task_subtasks_details &&
                                      val.projectPlanning_module_tasks_details[taskindex + 1]
                                        .projectPlanning_task_subtasks_details.length > 1 &&
                                      val.projectPlanning_module_tasks_details[
                                        taskindex + 1
                                      ].projectPlanning_task_subtasks_details
                                        .slice(1)
                                        .map((subTask, s) => (
                                          <React.Fragment key={`${i}-${taskindex}-${s}`}>
                                            {console.log('subtask', subTask)}
                                            <tr>
                                              <td></td>

                                              <td></td>
                                              <td colSpan={5}>
                                                <CFormInput
                                                  placeholder="Sub Tasks"
                                                  name={`subTask-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'project_modules_subTasks',
                                                    )
                                                  }
                                                  value={subTask.project_modules_subTasks}
                                                  style={{
                                                    background: ' aquamarine',
                                                  }}
                                                />
                                              </td>
                                              <td>
                                                <CButton
                                                  onClick={() => {
                                                    handleAddSubTasks_onUpdate(i, taskindex)
                                                  }}
                                                >
                                                  +
                                                </CButton>
                                              </td>
                                              <td>
                                                <CButton
                                                  style={{
                                                    backgroundColor: 'red',
                                                    border: 'none',
                                                  }}
                                                  onClick={() => {
                                                    handleRemove_SubTasks(
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      subTask.id,
                                                    )
                                                  }}
                                                >
                                                  -
                                                </CButton>
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`subTask_planned_startDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_planned_startDate',
                                                    )
                                                  }
                                                  value={subTask.subTasks_planned_startDate}
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`subTask_planned_endDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_planned_endDate',
                                                    )
                                                  }
                                                  value={subTask.subTasks_planned_endDate}
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: '50px' }}
                                                  placeholder="Hrs"
                                                  name={`subTask_planned_Hrs-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_planned_Hrs',
                                                    )
                                                  }
                                                  value={subTask.subTasks_planned_Hrs}
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`subTask_actual_startDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_actual_startDate',
                                                    )
                                                  }
                                                  value={subTask.subTasks_actual_startDate}
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`subTask_actual_endDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_actual_endDate',
                                                    )
                                                  }
                                                  value={subTask.subTasks_actual_endDate}
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: '50px' }}
                                                  placeholder="Hrs"
                                                  name={`subTask_actual_hrs-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleSubTaskInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      'subTasks_actual_hrs',
                                                    )
                                                  }
                                                  value={subTask.subTasks_actual_hrs}
                                                />
                                              </td>
                                              <td></td>
                                              <td></td>
                                            </tr>
                                            <tr>
                                              <td></td>

                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td colSpan={3}>
                                                <CFormInput
                                                  placeholder="Activities"
                                                  name={`activities-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'project_modules_activities',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .project_modules_activities
                                                  }
                                                  style={{
                                                    background: '#00ffff38',
                                                  }}
                                                />
                                              </td>
                                              <td>
                                                <CButton
                                                  onClick={() => {
                                                    handleAdd_activities_onUpdate(i, taskindex, s)
                                                  }}
                                                >
                                                  +
                                                </CButton>
                                              </td>
                                              <td>
                                                <CButton
                                                  style={{
                                                    backgroundColor: 'red',
                                                    border: 'none',
                                                  }}
                                                  onClick={() => {
                                                    handleRemove_activities(
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      subTask &&
                                                        subTask.projectPlanning_subTasks_Activities_details &&
                                                        subTask
                                                          .projectPlanning_subTasks_Activities_details[0] &&
                                                        subTask
                                                          .projectPlanning_subTasks_Activities_details[0]
                                                          .id,
                                                    )
                                                  }}
                                                >
                                                  -
                                                </CButton>
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`activities_planned_startDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_planned_startDate',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_planned_startDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`activities_planned_endDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_planned_endDate',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_planned_endDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: '50px' }}
                                                  placeholder="Hrs"
                                                  name={`activities_planned_Hrs-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_planned_Hrs',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_planned_Hrs
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`activities_actual_startDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_actual_startDate',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_actual_startDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  type="date"
                                                  name={`activities_actual_endDate-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_actual_endDate',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_actual_endDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: '50px' }}
                                                  placeholder="Hrs"
                                                  name={`activities_actual_Hrs-${i}-${taskindex}-${s}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      s + 1,
                                                      0,
                                                      'activities_actual_hrs',
                                                    )
                                                  }
                                                  value={
                                                    subTask &&
                                                    subTask.projectPlanning_subTasks_Activities_details &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0] &&
                                                    subTask
                                                      .projectPlanning_subTasks_Activities_details[0]
                                                      .activities_actual_hrs
                                                  }
                                                />
                                              </td>
                                              <td></td>
                                              <td></td>
                                            </tr>

                                            {/* ///////////////////////////////////////////////////for subtask +1 activities ///////////////////////// */}
                                            {val.projectPlanning_module_tasks_details[
                                              taskindex + 1
                                            ]?.projectPlanning_task_subtasks_details[
                                              s + 1
                                            ]?.projectPlanning_subTasks_Activities_details
                                              ?.slice(1)
                                              .map((activity, ai) => (
                                                <tr key={`${i}-${taskindex}-${s}-${ai}`}>
                                                  <td></td>

                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                  <td colSpan={3}>
                                                    <CFormInput
                                                      placeholder="Activities"
                                                      name={`activities-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'project_modules_activities',
                                                        )
                                                      }
                                                      value={activity.project_modules_activities}
                                                      style={{
                                                        background: '#00ffff38',
                                                      }}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CButton
                                                      onClick={() => {
                                                        handleAdd_activities_onUpdate(
                                                          i,
                                                          taskindex,
                                                          s,
                                                        )
                                                      }}
                                                    >
                                                      +
                                                    </CButton>
                                                  </td>
                                                  <td>
                                                    <CButton
                                                      style={{
                                                        backgroundColor: 'red',
                                                        border: 'none',
                                                      }}
                                                      onClick={() => {
                                                        handleRemove_activities(
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          activity.id,
                                                        ) // Assuming you want to remove the first activity
                                                      }}
                                                    >
                                                      -
                                                    </CButton>
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      type="date"
                                                      name={`activities_planned_startDate-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_planned_startDate',
                                                        )
                                                      }
                                                      value={activity.activities_planned_startDate}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      type="date"
                                                      name={`activities_planned_endDate-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_planned_endDate',
                                                        )
                                                      }
                                                      value={activity.activities_planned_endDate}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      style={{
                                                        width: '50px',
                                                      }}
                                                      placeholder="Hrs"
                                                      name={`activities_planned_Hrs-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_planned_Hrs',
                                                        )
                                                      }
                                                      value={activity.activities_planned_Hrs}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      type="date"
                                                      name={`activities_actual_startDate-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_actual_startDate',
                                                        )
                                                      }
                                                      value={activity.activities_actual_startDate}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      type="date"
                                                      name={`activities_actual_endDate-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_actual_endDate',
                                                        )
                                                      }
                                                      value={activity.activities_actual_endDate}
                                                    />
                                                  </td>
                                                  <td>
                                                    <CFormInput
                                                      style={{
                                                        width: '50px',
                                                      }}
                                                      placeholder="Hrs"
                                                      name={`activities_actual_hrs-${i}-${taskindex}-${s}-${ai}`}
                                                      onChange={(e) =>
                                                        handleActivitiesInputChange(
                                                          e,
                                                          i,
                                                          taskindex + 1,
                                                          s + 1,
                                                          ai + 1,
                                                          'activities_actual_hrs',
                                                        )
                                                      }
                                                      value={activity.activities_actual_hrs}
                                                    />
                                                  </td>
                                                  <td></td>
                                                  <td></td>
                                                </tr>
                                              ))}
                                          </React.Fragment>
                                        ))}
                                  </React.Fragment>
                                ))}
                          </React.Fragment>
                        </tbody>
                        <br></br>
                      </>
                    ))
                  ) : (
                    <p>No purchase order details available.</p>
                  )}
                </table>
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => handleCloseModal}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleUpdate}>
              Update Project Planning
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Add Project Planning Modal */}

        {/* ///////////////////////////////////////// Assign Task Model ends ////////////////////////////////////////*/}
      </CCard>
    </>
  )
}

export default ProjectPlanning
