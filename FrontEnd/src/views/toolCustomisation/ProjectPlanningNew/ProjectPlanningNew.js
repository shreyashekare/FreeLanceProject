/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import {
  cilCash,
  cilChevronCircleDownAlt,
  cilChevronTop,
  cilX,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from 'src/constants'

import styles from '../projectPlanning/ProjectPlanning.module.css'
import './ProjectPlanNew.css'
import Swal from 'sweetalert2'

const ProjectPlanningNew = () => {
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleProjectPlanning, setVisibleProjectPlanning] = useState(false)
  const [visibleUpdate_projectPlanning, setVisibleUpdate_projectPlanning] = useState(false)
  const [validatedUpdate, setValidatedUpdate] = useState(false)
  const [validated, setValidated] = useState(false)
  const [validatedAdd, setValidatedAdd] = useState(false)
  const [clientName, setClientName] = useState('')
  const [client, setClient] = useState('')
  const [purchaseOrderNo, setPurchaseOrderNo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [attachment, setAttachment] = useState([])
  const [availableClient, setAvailabelClient] = useState([])
  const [purchaseOrderList, setPurchaseOrderList] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [filterData, setfilterData] = useState([])
  const [selected_Purchase_OrderId, setSelected_Purchase_OrderId] = useState('')
  const [purchase_orderToUpdate, setPurchase_orderToUpdate] = useState({})
  const [removedAttachments, setRemovedAttachments] = useState([])
  const [updateToast, setUpdateToast] = useState(false)
  const [add_projectPlanning_Toast, setAdd_projectPlanning_Toast] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectPlanning_file, setProjectPlanning_file] = useState([])
  const [purchaseOrder_ToUpdate, setPurchaseOrder_ToUpdate] = useState({})
  const [milestones, setMilestones] = useState([{ milestone: '', milestoneValue: '' }])
  const [Status, setStatus] = useState('')

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

  ////////////////// useeffect for clientName /////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getclientName`).then((res) => {
      setAvailabelClient(res.data.data)
      console.log(res.data.data)
    })
  }, [visibleAdd])

  /////////////////// useEffect to get all purchse order data //////////////////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getpurchase_order`).then((res) => {
      setPurchaseOrderList(res.data.data)
      setfilterData(res.data.data)
      // console.log(res.data.data)
    })
  }, [visible, visibleUpdate])

  const fetchPurchaseOrderData = async () => {
    axios.get(`${USER_API_ENDPOINT}getpurchase_order`).then((res) => {
      setPurchaseOrderList(res.data.data)
      setfilterData(res.data.data)
      // console.log(res.data.data)
    })
  }
  /////////////////// filter data effect //////////////////

  useEffect(() => {
    const filterPurchase_Order = purchaseOrderList.filter((purchaseOrder) => {
      return purchaseOrder.clientNameDetails.clientName.toLowerCase().match(search.toLowerCase())
    })
    setfilterData(filterPurchase_Order)
  }, [search, purchaseOrderList])

  ////////// on change event for file /////////////////////

  const handleFileChange = (event) => {
    const files = event.target.files
    const newAttachments = Array.from(files)
    setAttachment([...attachment, ...newAttachments])
  }

  const handle_projectPlanning_FileChange = (event) => {
    const files = event.target.files
    const newProjectPlanning_file = Array.from(files)
    setProjectPlanning_file([...projectPlanning_file, ...newProjectPlanning_file])
  }

  /////////////////////////////// add more start /////////////////
  const handleChange = (e, i) => {
    const { name, value } = e.target
    const onchangeVal = [...milestones]
    onchangeVal[i][name] = value
    // setMilestones(onchangeVal)
    console.log('data', name, value, i, onchangeVal)
    setMilestones(onchangeVal)
  }

  const handleAdd = () => {
    setMilestones([...milestones, { milestone: '', milestoneValue: '' }])
    console.log(milestones)
  }
  const handleRemove = (i) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this field?')
    if (shouldRemove) {
      const deleteVal = [...milestones]
      deleteVal.splice(i, 1)
      setMilestones(deleteVal)
    }
  }

  /////////////////////////////// add more end /////////////////

  //////////////////////// add client start  ////////////////////////////
  const handleAddClient = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    setValidatedAdd(true)

    try {
      // Send a POST request to add a new designation
      const response = await axios.post(`${USER_API_ENDPOINT}addClient`, {
        clientName: clientName,
      })

      console.log('Data saved:', response.data)
      setClientName('')
      setVisibleAdd(false)
      setValidatedAdd(false)
    } catch (error) {
      console.log('Error saving clientName:', error)

      if (error.response.data.message == 'clientName already exists') {
      } else {
        console.error('Error saving clientName')
      }
    }
  }
  /////////////// handel Submit /////////////////////////

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    setValidated(true)
    try {
      const formData = new FormData()
      formData.append('clientName_id', client)
      formData.append('purchaseOrderNo', purchaseOrderNo)
      formData.append('startDate', startDate)
      formData.append('endDate', endDate)
      formData.append('milestones', JSON.stringify(milestones))
      attachment.forEach((file) => {
        formData.append('file', file)
      })

      const response = await fetch(`${USER_API_ENDPOINT}addPurchaseOrder`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // Handle success
        console.log('Purchase order added successfully')
        setValidated(false)
        setVisible(false)
        setMilestones([{ milestone: '', milestoneValue: '' }])
      } else {
        // Handle error
        console.error('Error adding purchase order')
      }
    } catch (error) {
      console.error(error)
    }
  }

  ///////////////////////////// column start for data table/////////////////////////////
  /////// date formate ////
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
  }
  const paginatedData = filterData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1) // Reset to first page
  }
  const columns = [
    {
      name: 'Sr.No.',
      selector: (_, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name of Client / Project',
      selector: (row) => row.clientNameDetails.clientName,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => formatDate(row.startDate),
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row) => (row.endDate ? formatDate(row.endDate) : 'NA'),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) =>
        row.purchase_order_details.length > 0 && row.purchase_order_details[0].status
          ? row.purchase_order_details[0].status.trim() !== ''
            ? row.purchase_order_details[0].status
            : 'Yet To Start'
          : 'Yet To Start',
      sortable: true,
      sortFunction: (a, b) => {
        const statusA =
          a.purchase_order_details.length > 0 && a.purchase_order_details[0].status
            ? a.purchase_order_details[0].status.trim() !== ''
              ? a.purchase_order_details[0].status
              : 'Yet To Start'
            : 'Yet To Start'
        const statusB =
          b.purchase_order_details.length > 0 && b.purchase_order_details[0].status
            ? b.purchase_order_details[0].status.trim() !== ''
              ? b.purchase_order_details[0].status
              : 'Yet To Start'
            : 'Yet To Start'
        // eslint-disable-next-line prettier/prettier
        return statusOrder[statusA] - statusOrder[statusB]
      },
    },
    {
      name: 'Action',
      width: '80px',
      cell: (row) => (
        <>
          <CIcon
            className="ms-4"
            icon={cilCash}
            onClick={() => handleProjectPlanning(row.id)}
            style={{ cursor: 'pointer', color: 'blue' }}
          />
        </>
      ),
    },
  ]
  const statusOrder = {
    'Final Approval': 1,
    'Updated By Team Lead': 2,
    'Updated By Manager': 3,
    'Yet To Start': 4,
  }
  const conditionalRowStyles = [
    {
      when: (row) =>
        !row.purchase_order_details.length ||
        !row.purchase_order_details[0].status ||
        row.purchase_order_details[0].status.trim() === '',
      style: {
        backgroundColor: '#bdced7',
      },
    },
    {
      when: (row) =>
        row.purchase_order_details.length > 0 &&
        row.purchase_order_details[0].status === 'Updated By Manager',
      style: {
        backgroundColor: '#0dcaf0',
      },
    },
    {
      when: (row) =>
        row.purchase_order_details.length > 0 &&
        row.purchase_order_details[0].status === 'Updated By Team Lead',
      style: {
        backgroundColor: '#d1fe24',
      },
    },
    {
      when: (row) =>
        row.purchase_order_details.length > 0 &&
        row.purchase_order_details[0].status === 'Final Approval',
      style: {
        backgroundColor: '#1cfa20',
      },
    },
  ]
  const handleProjectPlanning = async (id) => {
    setSelected_Purchase_OrderId(id)
    const data = await axios.get(`${USER_API_ENDPOINT}findProjectByPurchaseOrder/${id}`)
    const response = data.data.Status

    if (response === 'true') {
      await fetch_Project_Data(id)
      setVisibleUpdate_projectPlanning(true)
    } else {
      fetchpurchase_order_Data(id)
      setVisibleProjectPlanning(true)
    }
  }
  const [Employee_ID, setEmployee_ID] = useState(null)
  const [client_ID, setClientID] = useState(' ')
  console.log('purchase order id', selected_Purchase_OrderId)

  const fetchpurchase_order_Data = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getPurchaseOrder/${id}`)
      setPurchase_orderToUpdate(response.data.data)
      setClientID(response.data.data.clientNameDetails.id)
      console.log('Client ki ID', response.data.data.clientNameDetails.id)
    } catch (error) {
      console.error('Error fetching PurchaseOrder data:', error)
    }
  }
  const fetch_Project_Data = async (id) => {
    try {
      const response = await axios.get(
        `${USER_API_ENDPOINT}project_planning_data_by_purchaseOrder/${id}`,
      )
      setPurchaseOrder_ToUpdate(response.data)
    } catch (error) {
      console.error('Error fetching Purchase Order data:', error)
    }
  }
  console.log(purchase_orderToUpdate)

  console.log(selected_Purchase_OrderId)

  /////////////////////////////////// Update Api //////////////////////////////////////////////

  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      formData.append('project_name', purchaseOrder_ToUpdate.project_name)
      formData.append('Status', purchaseOrder_ToUpdate.Status)
      formData.append(
        'modules',
        JSON.stringify(purchaseOrder_ToUpdate.project_planning_moduleDetails || []),
      )
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
      fetchPurchaseOrderData();
      setVisibleUpdate_projectPlanning(false)

      setUpdateToast(true)
      console.log('Update response:', response.data)

      // Handle success
    } catch (error) {
      console.error('Error updating project:', error)
      // Handle error
    }
  }

  ////////////////////////////// removing milestone and attachment while updating ////////////////////////

  const handleRemoveAttachment = (index) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this attachment?')
    if (shouldRemove) {
      const updatedPurchaseOrderAttachments = [
        ...purchase_orderToUpdate.purchase_order_attachment_detail,
      ]
      const removedAttachment = updatedPurchaseOrderAttachments.splice(index, 1)[0] // Remove attachment from array and store removed attachment
      setPurchase_orderToUpdate({
        ...purchase_orderToUpdate,
        purchase_order_attachment_detail: updatedPurchaseOrderAttachments,
      })
      setRemovedAttachments([...removedAttachments, removedAttachment]) // Add removed attachment to removedAttachments state
    }
  }
  //////////////////////////////////////////////////////handle remove file no. /////////////////////////////////////////////////////////////////

  const handleRemove_projectPlanning_file = (index) => {
    const updatedProjectPlanning_file = [...projectPlanning_file]
    updatedProjectPlanning_file.splice(index, 1)
    setProjectPlanning_file(updatedProjectPlanning_file)
  }

  const handleRemove_updateAttachment = (index) => {
    setPurchase_orderToUpdate((prevPurchaseOrder) => {
      const updatedAttachments = [...prevPurchaseOrder.attachment]
      updatedAttachments.splice(index, 1) // Remove the attachment at the specified index
      return {
        ...prevPurchaseOrder,
        attachment: updatedAttachments,
      }
    })
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handle_onupdate_Modules = () => {
    alert("Add Modules");

    // Check if project_planning_moduleDetails is defined and initialize it as an empty array if it's undefined
    const projectPlanningModuleDetails = purchaseOrder_ToUpdate.project_planning_moduleDetails || [];

    const newModule = {
      modules: '',
      tasks: [
        {
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
        },
      ],
      planned_startDate: '',
      planned_endDate: '',
      planned_Hrs: '0',
      actual_startDate: '',
      actual_endDate: '',
      actual_hrs: '0',
    };

    // Update the project_planning_moduleDetails array in purchaseOrder_ToUpdate state
    setPurchaseOrder_ToUpdate((prevState) => {
      const updatedProjectPlanningModuleDetails = [...projectPlanningModuleDetails, newModule];

      return {
        ...prevState,
        project_planning_moduleDetails: updatedProjectPlanningModuleDetails,
      };
    });

    handleAdd_activities_forSubTask1_onUpdate1(1, 0, 0);

  };


  const handleAddModules = () => {
    setModules([
      ...modules,
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
  }

  const handleRemove_Modules = (i) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this field?')
    if (shouldRemove) {
      const deleteVal = [...modules]
      deleteVal.splice(i, 1)
      setModules(deleteVal)
    }
  }

  const handleRemove_Modules2 = async (index, id) => {
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

  const handleRemove_Tasks = (moduleIndex, taskIndex) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this task?')
    Swal.fire({
      title: 'Good job!',
      text: 'You clicked the button!',
      icon: 'success',
    })
    if (shouldRemove) {
      const updatedModules = [...modules]
      updatedModules[moduleIndex].tasks.splice(taskIndex, 1)
      setModules(updatedModules)
    }
  }

  /////////////////// remove subtask ////////////////////

  const handleRemove_SubTasks = (moduleIndex, taskIndex, subtaskIndex) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this SubTask?')
    if (shouldRemove) {
      const updatedModules = [...modules]
      updatedModules[moduleIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1)
      setModules(updatedModules)
    }
  }

  //////////////////////////////remove activities /////////////////////////
  const handleRemove_activities = (moduleIndex, taskIndex, subtaskIndex, activityIndex) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this SubTask?')
    if (shouldRemove) {
      const updatedModules = [...modules]
      updatedModules[moduleIndex].tasks[taskIndex].subTasks[subtaskIndex].activities.splice(
        activityIndex,
        1,
      )
      setModules(updatedModules)
    }
  }
  const handleRemove_activities2 = async (
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
  //////////////// add more tasks ////////////////////////////

  const handleAddTasks = (moduleIndex) => {
    const updatedModules = [...modules]

    updatedModules[moduleIndex].tasks.push({
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

    // Recalculate both planned and actual hours
    let recalculatedModules = recalculateTaskPlannedHrs(updatedModules)
    recalculatedModules = recalculateTaskActualHrs(recalculatedModules)

    setModules(recalculatedModules)
    // console.log(updatedModules)
  }

  const handleModule_subtask = (moduleIndex) => {
    const updatedModules = [...modules]

    // Add new subtask with default values
    updatedModules[moduleIndex].tasks[0].subTasks.push({
      subTask: '',
      subTask_planned_startDate: '',
      subTask_planned_endDate: '',
      subTask_planned_Hrs: '0', // Initialize with 0, this will be recalculated
      subTask_actual_startDate: '',
      subTask_actual_endDate: '',
      subTask_actual_hrs: '0', // Initialize with 0, this will be recalculated
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

    // Recalculate subTask_planned_Hrs and subTask_actual_hrs for all subtasks
    const recalculatedModules = recalculateSubTaskPlannedHrsAndActualHrs(updatedModules)

    setModules(recalculatedModules)
  }

  const handleAdd_activities_forSubTask1_onUpdate1 = (moduleIndex, taskIndex, subTaskIndex) => {
    alert(moduleIndex + ' ' + taskIndex + ' ' + subTaskIndex);
    console.log('id', moduleIndex, taskIndex, subTaskIndex);

    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails];

    // Ensure projectPlanning_module_tasks_details array exists
    if (!updatedModules[moduleIndex]) {
      updatedModules[moduleIndex] = {
        projectPlanning_module_tasks_details: []
      };
    }
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details = [];
    }

    // Ensure the task exists
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex]) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex] = {
        projectPlanning_task_subtasks_details: []
      };
    }

    // Ensure projectPlanning_task_subtasks_details array exists
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details = [];
    }

    // Ensure the specific subtask exists
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex]) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex] = {
        projectPlanning_subTasks_Activities_details: [],
        subTask_planned_hrs: 0,
        subTask_actual_hrs: 0,
      };
    }

    // Ensure projectPlanning_subTasks_Activities_details array exists
    let pathDetail = updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex].projectPlanning_subTasks_Activities_details;
    if (!pathDetail) {
      pathDetail = [];
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex].projectPlanning_subTasks_Activities_details = pathDetail;
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
    });

    // Calculate the sum of planned and actual hours for activities
    let plannedHrsSum = 0;
    let actualHrsSum = 0;
    pathDetail.forEach((activity) => {
      plannedHrsSum += parseFloat(activity.activities_planned_Hrs) || 0;
      actualHrsSum += parseFloat(activity.activities_actual_hrs) || 0;
    });

    // Update the subtask's planned and actual hours with the calculated sums
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex].subTask_planned_hrs = plannedHrsSum;
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[taskIndex].projectPlanning_task_subtasks_details[subTaskIndex].subTask_actual_hrs = actualHrsSum;

    // Update the state with the modified modules
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }));
  };


  const handleAdd_activities_forSubTask1_onUpdate = (moduleIndex, taskIndex, subTaskIndex) => {
    alert(moduleIndex + ' ' + taskIndex + ' ' + subTaskIndex)
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
        subTask_planned_hrs: 0,
        subTask_actual_hrs: 0,
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

    // Calculate the sum of planned and actual hours for activities
    let plannedHrsSum = 0
    let actualHrsSum = 0
    pathDetail.forEach((activity) => {
      plannedHrsSum += parseFloat(activity.activities_planned_Hrs) || 0
      actualHrsSum += parseFloat(activity.activities_actual_hrs) || 0
    })

    // Update the subtask's planned and actual hours with the calculated sums
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[
      taskIndex
    ].projectPlanning_task_subtasks_details[subTaskIndex].subTask_planned_hrs = plannedHrsSum
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[
      taskIndex
    ].projectPlanning_task_subtasks_details[subTaskIndex].subTask_actual_hrs = actualHrsSum

    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }))
  }


  let subTaskIndex = 0; // Initialize the subTaskIndex

  const handleModule_subtask_onUpdate = (moduleIndex) => {
    alert('subtask')
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails];

    // Get the current subtasks array
    let pathDetails =
      updatedModules[moduleIndex].projectPlanning_module_tasks_details[0]
        .projectPlanning_task_subtasks_details;

    if (!pathDetails) {
      pathDetails = [];
    }

    // Add a new subtask
    pathDetails.push({
      subTask: '',
      subTask_planned_startDate: '',
      subTask_planned_endDate: '',
      subTask_planned_Hrs: '0',
      subTask_actual_startDate: '',
      subTask_actual_endDate: '',
      subTask_actual_hrs: '0',
      activities: [],
    });

    // Update the modules array with the new subtask
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[0].projectPlanning_task_subtasks_details = pathDetails;

    // Set the updated modules array to the state
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }));

    // Calculate the subTaskIndex based on the new length of the subtasks array
    const newSubTaskIndex = pathDetails.length - 2

    // Pass the calculated subTaskIndex to add an activity
    handleModule_activities_for_subindex_onUpdate(moduleIndex, newSubTaskIndex);
  };


  const handleAddTasks_onupdate = (moduleIndex) => {
    alert('s');
    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails];

    // Ensure the projectPlanning_module_tasks_details array exists
    if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details) {
      updatedModules[moduleIndex].projectPlanning_module_tasks_details = [];
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
    });

    // Recalculate planned and actual hours for all tasks and subtasks
    const recalculatedModules = updatedModules.map((module) => {
      return {
        ...module,
        projectPlanning_module_tasks_details: (
          module.projectPlanning_module_tasks_details || []
        ).map((task) => {
          // Ensure subTasks is an array
          const subTasks = task.subTasks || [];

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
          };

          return updatedTask;
        }),
      };
    });

    // Update the purchase order state
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: recalculatedModules,
    }));

    // Get the index of the newly added task and subtask
    const taskIndex = updatedModules[moduleIndex].projectPlanning_module_tasks_details.length - 1;
    const subTaskIndex = 0; // Assuming you want to add activities for the first subtask of the newly added task

    // Call handleAdd_activities_forSubTask1_onUpdate for the new task and subtask
    handleAdd_activities_forSubTask1_onUpdate(moduleIndex, taskIndex, subTaskIndex);
  };


  const handleModule_activities_onUpdate = (moduleIndex) => {
    alert("act")
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

  const handleAddSubTasks = (moduleIndex, taskIndex) => {
    console.log(moduleIndex, taskIndex)
    const updatedModules = [...modules]
    updatedModules[moduleIndex].tasks[taskIndex + 1].subTasks.push({
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
    })
    setModules(updatedModules)
  }

  ////////////////////////////// for activities ////////////////////////////////////

  const handleModule_activities = (moduleIndex) => {
    const updatedModules = [...modules]

    updatedModules[moduleIndex].tasks[0].subTasks[0].activities.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })
    setModules(updatedModules)
  }

  const handleModule_activities_for_subindex = (moduleIndex, subTaskIndex) => {
    const updatedModules = [...modules]

    updatedModules[moduleIndex].tasks[0].subTasks[subTaskIndex + 1].activities.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })
    setModules(updatedModules)
  }

  const handleAdd_activities_forSubTask1 = (moduleIndex, taskIndex, subTasks) => {
    alert('subtask')
    console.log('id', moduleIndex, taskIndex, subTasks)

    const updatedModules = [...modules]
    console.log('details', updatedModules[moduleIndex].tasks[taskIndex])
    updatedModules[moduleIndex].tasks[taskIndex].subTasks[0].activities.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })
    setModules(updatedModules)
    console.log('data for activities', updatedModules)
  }

  const handleAdd_activities = (moduleIndex, taskIndex, subTaskIndex) => {
    console.log(moduleIndex, taskIndex, subTaskIndex)
    const updatedModules = [...modules]
    updatedModules[moduleIndex].tasks[taskIndex + 1].subTasks[subTaskIndex + 1].activities.push({
      activities: '',
      activities_planned_startDate: '',
      activities_planned_endDate: '',
      activities_planned_Hrs: '',
      activities_actual_startDate: '',
      activities_actual_endDate: '',
      activities_actual_hrs: '',
    })
    setModules(updatedModules)
  }

  const handleInputChange = (e, index, key) => {
    const { name, value } = e.target
    const updatedModules = [...modules]
    updatedModules[index][name] = value
    setModules(updatedModules)
  }

  const handleInputChange2 = (e, index, key) => {
    const { value } = e.target
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
  const [isCollapsed, setIsCollapsed] = useState({})

  const collapseBtn = (index) => {
    setIsCollapsed((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }
  const handleTaskInputChange = (e, moduleIndex, taskIndex) => {
    const { name, value } = e.target
    const updatedModules = [...modules]

    const fieldName = name.split('-')[0]
    // Update the specific task's planned hours
    updatedModules[moduleIndex].tasks[taskIndex][fieldName] = value

    // Calculate the sum of planned hours for tasks in this module
    const totalPlannedHrs = updatedModules[moduleIndex].tasks.reduce((total, task) => {
      return total + (Number(task.task_planned_Hrs) || 0)
    }, 0)

    // Optionally, store this sum if needed elsewhere in the state
    updatedModules[moduleIndex].toy = totalPlannedHrs

    setModules(updatedModules)
  }

  const handleTaskInputChange2 = (e, moduleIndex, taskIndex, key) => {
    const { value } = e.target

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
    const updatedModules = [...modules]

    // Extracting the keys from the name attribute
    const [field, i, taskIndex, s] = name.split('-')
    const fieldName = key.split('-').join('_') // Convert to snake_case if needed

    // Update the value in the modules state
    updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx][fieldName] = value

    // Calculate the sum of activities_planned_Hrs
    const activities = updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx].activities
    const totalPlannedHrs = activities.reduce(
      (sum, activity) => sum + parseFloat(activity.activities_planned_Hrs || 0),
      0,
    )

    // Update subTask_planned_Hrs with the calculated sum
    updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx].subTask_planned_Hrs =
      totalPlannedHrs

    setModules(updatedModules)
  }

  const handleSubTaskInputChange2 = (e, moduleIndex, taskIdx, subTaskIdx, key) => {
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

  const recalculateSubTaskPlannedHrsAndActualHrs = (modules) => {
    return modules.map((module) => {
      const updatedTasks = module.tasks.map((task) => {
        const updatedSubTasks = task.subTasks.map((subTask) => {
          const subTaskPlannedHrs = subTask.activities.reduce((total, activity) => {
            return total + (Number(activity.activities_planned_Hrs) || 0)
          }, 0)

          const subTaskActualHrs = subTask.activities.reduce((total, activity) => {
            return total + (Number(activity.activities_actual_hrs) || 0)
          }, 0)

          return {
            ...subTask,
            subTask_planned_Hrs: subTaskPlannedHrs.toString(),
            subTask_actual_hrs: subTaskActualHrs.toString(),
          }
        })
        return { ...task, subTasks: updatedSubTasks }
      })
      return { ...module, tasks: updatedTasks }
    })
  }

  const calculateSubTaskActualHours = (subTask) => {
    return subTask.activities.reduce((sum, activity) => {
      return sum + (Number(activity.activities_actual_hrs) || 0)
    }, 0)
  }

  const calculateSubTaskPlannedHours = (subTask) => {
    return subTask.activities.reduce((sum, activity) => {
      return sum + (Number(activity.activities_planned_Hrs) || 0)
    }, 0)
  }

  const calculateTaskPlannedHours = (task) => {
    return task.subTasks.reduce((total, subTask) => {
      return total + calculateSubTaskPlannedHours(subTask)
    }, 0)
  }

  const recalculateTaskPlannedHrs = (modules) => {
    return modules.map((module) => {
      const updatedTasks = module.tasks.map((task) => {
        const taskPlannedHrs = task.subTasks.reduce((total, subTask) => {
          return total + (Number(subTask.subTask_planned_Hrs) || 0)
        }, 0)
        return { ...task, task_planned_Hrs: taskPlannedHrs.toString() }
      })
      return { ...module, tasks: updatedTasks }
    })
  }

  const handleActivitiesInputChange2 = (
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

  const handleActivitiesInputChange = (
    e,
    moduleIndex,
    taskIndex,
    subTaskIndex,
    activityIndex,
    key,
  ) => {
    const { name, value } = e.target
    const updatedModules = [...modules]

    // Update the value in the modules state
    updatedModules[moduleIndex].tasks[taskIndex].subTasks[subTaskIndex].activities[activityIndex][
      key
    ] = value

    // Recalculate the subTask_planned_Hrs and subTask_actual_hrs
    const modulesWithUpdatedSubTaskHrs = recalculateSubTaskPlannedHrsAndActualHrs(updatedModules)

    // Recalculate the task_planned_Hrs
    const modulesWithUpdatedTaskPlannedHrs = recalculateTaskPlannedHrs(modulesWithUpdatedSubTaskHrs)

    // Recalculate the task_actual_hrs
    const modulesWithUpdatedTaskActualHrs = recalculateTaskActualHrs(
      modulesWithUpdatedTaskPlannedHrs,
    )

    setModules(modulesWithUpdatedTaskActualHrs)
  }

  const recalculateTaskActualHrs = (modules) => {
    return modules.map((module) => {
      const updatedTasks = module.tasks.map((task) => {
        const taskActualHrs = task.subTasks.reduce((total, subTask) => {
          return total + (Number(subTask.subTask_actual_hrs) || 0)
        }, 0)
        return { ...task, task_actual_hrs: taskActualHrs.toString() }
      })
      return { ...module, tasks: updatedTasks }
    })
  }

  ////////////////////////////////////////////////////////// adding Project Planning Details in Data Base //////////////////////////

  const handle_add_ProjectPlanning = async () => {
    try {
      const formData = new FormData()
      formData.append('project_name', projectName)
      formData.append('purchaseOrder_id', selected_Purchase_OrderId)
      formData.append('modules', JSON.stringify(modules))
      formData.append('employee_ID', JSON.stringify(Employee_ID))
      formData.append('client_ID', JSON.stringify(client_ID))
      formData.append('Status', (Status))
      projectPlanning_file.forEach((file) => {
        formData.append('project_file', file)
      })

      const response = await fetch(`${USER_API_ENDPOINT}add_project_planning`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        // Handle success
        console.log('Purchase order added successfully')
        fetchPurchaseOrderData()
        setAdd_projectPlanning_Toast(true)
        setVisibleProjectPlanning(false)
        setProjectName('')
        setProjectPlanning_file([])
        setModules([
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
                        assignedTo_employeeID: '',
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
      } else {
        // Handle error
        console.error('Error adding purchase order')
      }
    } catch (error) {
      console.error(error)
    }
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
  const handleModule_activities_for_subindex_onUpdate = (moduleIndex, subTaskIndex) => {
    alert("task")

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

  const handleAddSubTasks_onUpdate = (moduleIndex) => {
    alert("taskSub");
    console.log(moduleIndex);

    const updatedModules = [...purchaseOrder_ToUpdate.project_planning_moduleDetails];

    // Get the index of the most recently added task
    const lastTaskIndex = updatedModules[moduleIndex].projectPlanning_module_tasks_details.length - 1;

    // Ensure the last task exists and has a subtask array initialized
    if (lastTaskIndex >= 0) {
      if (!updatedModules[moduleIndex].projectPlanning_module_tasks_details[lastTaskIndex].projectPlanning_task_subtasks_details) {
        updatedModules[moduleIndex].projectPlanning_module_tasks_details[lastTaskIndex].projectPlanning_task_subtasks_details = [];
      }
    } else {
      // If no tasks exist, log an error or handle it accordingly
      console.error("No tasks available to add a subtask.");
      return;
    }

    // Add new subtask with default activity to the last task
    updatedModules[moduleIndex].projectPlanning_module_tasks_details[lastTaskIndex].projectPlanning_task_subtasks_details.push({
      subTask: '',
      subTask_planned_startDate: '',
      subTask_planned_endDate: '',
      subTask_planned_Hrs: '0', // Initialize with '0'
      subTask_actual_startDate: '',
      subTask_actual_endDate: '',
      subTask_actual_hrs: '',
      projectPlanning_subTasks_Activities_details: [
        {
          activities: '',
          activities_planned_startDate: '',
          activities_planned_endDate: '',
          activities_planned_Hrs: '', // Initialize with '0'
          activities_actual_startDate: '',
          activities_actual_endDate: '',
          activities_actual_hrs: '',
        },
      ],
    });

    // Calculate the sum of activities' planned hours for the newly added subtask
    const newSubtaskIndex = updatedModules[moduleIndex].projectPlanning_module_tasks_details[lastTaskIndex].projectPlanning_task_subtasks_details.length - 1;

    const newSubtask = updatedModules[moduleIndex].projectPlanning_module_tasks_details[lastTaskIndex].projectPlanning_task_subtasks_details[newSubtaskIndex];

    const totalPlannedHrs = newSubtask.projectPlanning_subTasks_Activities_details.reduce(
      (sum, activity) => sum + parseFloat(activity.activities_planned_Hrs || 0),
      0
    );

    newSubtask.subTask_planned_Hrs = totalPlannedHrs.toString();

    // Update the state with the new subtask and calculated hours
    setPurchaseOrder_ToUpdate((prevState) => ({
      ...prevState,
      project_planning_moduleDetails: updatedModules,
    }));
  };




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
  const [selectedStatus, setSelectedStatus] = useState(' ');

  const handleStatusFilter2 = (status) => {
    setSelectedStatus(status);
    setDisable(false);
    const statusFilter = purchaseOrderList.filter((item) => {
      // Check if purchase_order_details is empty
      if (item.purchase_order_details.length === 0) {
        return status === 'Yet To Start';
      }
      // Check the status of the first index of purchase_order_details
      const firstDetail = item.purchase_order_details[0];
      const detailStatus = firstDetail.status ? firstDetail.status.trim() : 'Yet To Start';
      return detailStatus === status;
    });
    setfilterData(statusFilter);
  };
  const [disable, setDisable] = useState(true);

  const handleReset = () => {
    setfilterData(purchaseOrderList)
    setSelectedStatus("Select a Status")
    setDisable(true)

  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Project Planning</strong>
          <CButton disabled={disable} onClick={handleReset}>Reset</CButton>
        </CCardHeader>
        <CCardBody>
          <div className='filterDiv'>
            <CFormSelect
              value={selectedStatus}
              onChange={(e) => handleStatusFilter2(e.target.value)}
            >
              <option value=" ">Select a Status</option>
              <option value="Yet To Start">Yet To Start</option>
              <option value="Updated By Manager">Updated By Manager</option>
              <option value="Updated By Team Lead">Updated By Team Lead</option>
              <option value="Final Approval">Final Approval</option>
            </CFormSelect>
          </div>
          <DataTable
            className="custom-data-table"
            columns={columns}
            data={paginatedData}
            pagination
            fixedHeader
            conditionalRowStyles={conditionalRowStyles}
            responsive
            highlightOnHover
            subHeader
            striped
            subHeaderComponent={
              <>

                <div className="timeDetails">
                  <b className="newBold2">
                    <p
                      className="statusItem11"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Yet To Start")}
                    >
                      Yet To Start
                    </p>
                    <p
                      className="statusItem21"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Updated By Manager")}
                    >
                      Updated By Manager
                    </p>
                    <p
                      className="statusItem31"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Updated By Team Lead")}
                    >
                      Updated By Team Lead
                    </p>
                    <p
                      className="statusItem41"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Final Approval")}
                    >
                      Final Approval
                    </p>
                  </b>
                </div>
              </>
            }
            paginationServer
            paginationTotalRows={filterData.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
          />
        </CCardBody>

        {/* ///////////////Update Toaster////////// */}

        {add_projectPlanning_Toast && (
          <>
            <CToaster placement="top-center">
              <CToast
                title="CoreUI for React.js"
                autohide={false}
                visible={true}
                onClose={() => setAdd_projectPlanning_Toast(false)}
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
                  Project Planning added successfully...
                </CToastBody>
              </CToast>
            </CToaster>
          </>
        )}

        {/* /////////////////////////////// Project Planning Model Start ////////////////////////// */}
        <CModal
          // size="xl"
          fullscreen
          visible={visibleProjectPlanning}
          onClose={() => setVisibleProjectPlanning(false)}
        >
          <CModalHeader>
            <CModalTitle>
              {`Project Planning :- ${purchase_orderToUpdate.clientNameDetails?.clientName !== undefined
                ? purchase_orderToUpdate.clientNameDetails?.clientName
                : ''
                }`}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" validated={validated}>
              <CCol md={4}>
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
                  onChange={(e) => {
                    setProjectName(e.target.value)
                  }}
                  placeholder="Name of Project"
                  feedbackInvalid="Please provide Name of Project."
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  id="customFile"
                  type="file"
                  name="project_file"
                  label="File"
                  custom
                  multiple
                  onChange={handle_projectPlanning_FileChange}
                />
                <ol>
                  {projectPlanning_file.map((file, i) => (
                    <li key={i}>
                      {file.name}
                      <CIcon
                        icon={cilX}
                        className={styles.crossBtn}
                        onClick={() => {
                          handleRemove_projectPlanning_file(i)
                        }}
                      ></CIcon>
                    </li>
                  ))}
                </ol>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label={
                    <span>
                      Status
                      <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                  required
                >
                  <option value="">Select a status</option>
                  <option value="Updated By Manager">Updated By Manager</option>
                  <option value="Updated By Team Lead">Updated By Team Lead</option>
                  <option value="Final Approval">Final Approval</option>
                </CFormSelect>
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

                <table>
                  <thead>
                    <tr>
                      <th colSpan={9}></th>
                      <th colSpan={3}>Planned</th>
                      <th>Actual</th>
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
                    </tr>
                  </thead>

                  {modules.map((val, i) => (
                    <>
                      <tbody
                        style={{
                          border: '1px solid ',
                          backgroundColor: 'lightgray',
                        }}
                      >
                        <React.Fragment key={i}>
                          {console.log(val)}
                          <tr>
                            <td colSpan={6}>
                              <CFormInput
                                name="modules"
                                placeholder="Modules"
                                value={val.modules}
                                onChange={(e) => handleInputChange(e, i)}
                                style={{
                                  width: '590px',
                                  background: 'floralwhite',
                                }}
                              />
                            </td>
                            <td></td>
                            <td></td> <td></td>
                            <td>
                              <CFormInput
                                type="date"
                                name="planned_startDate"
                                onChange={(e) => handleInputChange(e, i)}
                                value={val.planned_startDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name="planned_endDate"
                                onChange={(e) => handleInputChange(e, i)}
                                value={val.planned_endDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name="planned_Hrs"
                                onChange={(e) => handleInputChange(e, i)}
                                value={val.tasks.reduce((total, task) => {
                                  let task_planned_Hrs = Number(task.task_planned_Hrs) || 0
                                  return total + task_planned_Hrs
                                }, 0)}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                value={val.actual_startDate}
                                onChange={(e) => handleInputChange(e, i)}
                                name="actual_startDate"
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                value={val.actual_endDate}
                                onChange={(e) => handleInputChange(e, i)}
                                name="actual_endDate"
                              />
                            </td>
                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name="actual_hrs"
                                onChange={(e) => handleInputChange(e, i)}
                                value={val.tasks.reduce((total, task) => {
                                  let task_actual_hrs = Number(task.task_actual_hrs) || 0
                                  return total + task_actual_hrs
                                }, 0)}
                              />
                            </td>
                            <td>
                              <CButton onClick={handleAddModules}>+</CButton>
                            </td>
                            <td>
                              <CButton
                                onClick={() => {
                                  handleRemove_Modules(i)
                                }}
                                style={{
                                  backgroundColor: 'red',
                                  border: 'none',
                                }}
                                disabled={modules.length === 1}
                              >
                                -
                              </CButton>
                            </td>
                          </tr>
                          <tr>
                            <td></td>

                            <td colSpan={6}>
                              <CFormInput
                                style={{
                                  width: '488px',
                                  background: 'antiquewhite',
                                }}
                                placeholder="Tasks"
                                name="task" // The key in the task object you want to update
                                onChange={(e) => handleTaskInputChange(e, i, 0, 'task')}
                                value={val.tasks[0].task}
                              />
                            </td>
                            <td>
                              <CButton
                                onClick={() => {
                                  handleAddTasks(i)
                                }}
                              >
                                +
                              </CButton>
                            </td>
                            <td>
                              <CButton
                                disabled={val.tasks.length === 1}
                                onClick={() => {
                                  handleRemove_Tasks(i, 0)
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
                                onChange={(e) =>
                                  handleTaskInputChange(e, i, 0, 'task_planned_startDate')
                                }
                                value={val.tasks[0].task_planned_startDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`task_planned_endDate-${i}`}
                                onChange={(e) =>
                                  handleTaskInputChange(e, i, 0, 'task_planned_endDate')
                                }
                                value={val.tasks[0].task_planned_endDate}
                              />
                            </td>

                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`task_planned_Hrs`}
                                onChange={(e) => handleTaskInputChange(e, i, 0, 'task_planned_Hrs')}
                                value={
                                  val.tasks[0]
                                    ? val.tasks[0].subTasks.reduce((subTotal, subTask) => {
                                      let activitiesHrsSum = subTask.activities.reduce(
                                        (activityTotal, activity) => {
                                          let activities_planned_Hrs =
                                            Number(activity.activities_planned_Hrs) || 0
                                          console.log(
                                            `Activity planned hours: ${activities_planned_Hrs}`,
                                          ) // Log each activity's hours
                                          return activityTotal + activities_planned_Hrs
                                        },
                                        0,
                                      )
                                      console.log(`Sub-task total hours: ${activitiesHrsSum}`) // Log sub-task total hours
                                      return subTotal + activitiesHrsSum
                                    }, 0)
                                    : 0 // Default to 0 if val.tasks[i] is not defined
                                }
                              />
                            </td>

                            <td>
                              <CFormInput
                                type="date"
                                name={`task_actual_startDate-${i}`}
                                onChange={(e) =>
                                  handleTaskInputChange(e, i, 0, 'task_actual_startDate')
                                }
                                value={val.tasks[0].task_actual_startDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`task_actual_endDate-${i}`}
                                onChange={(e) =>
                                  handleTaskInputChange(e, i, 0, 'task_actual_endDate')
                                }
                                value={val.tasks[0].task_actual_endDate}
                              />
                            </td>

                            <td>
                              {console.log('Current Task:', val.tasks[i])}
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`task_actual_hrs`}
                                onChange={(e) => handleTaskInputChange(e, i, 0, 'task_actual_hrs')}
                                value={
                                  val.tasks[0]
                                    ? val.tasks[0].subTasks.reduce((subTotal, subTask) => {
                                      let activitiesHrsSum = subTask.activities.reduce(
                                        (activityTotal, activity) => {
                                          let activities_actual_hrs =
                                            Number(activity.activities_actual_hrs) || 0
                                          return activityTotal + activities_actual_hrs
                                        },
                                        0,
                                      )
                                      return subTotal + activitiesHrsSum
                                    }, 0)
                                    : 0 // Default to 0 if val.tasks[i] is not defined
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
                                name={`subTask-${i}`}
                                value={val.tasks[0].subTasks[0].subTask}
                                onChange={(e) => handleSubTaskInputChange(e, i, 0, 0, 'subTask')}
                                style={{ background: ' aquamarine' }}
                              />
                            </td>
                            <td>
                              <CButton
                                onClick={() => {
                                  handleModule_subtask(i)
                                }}
                              >
                                +
                              </CButton>
                            </td>
                            <td>
                              <CButton
                                disabled={val.tasks[0].subTasks.length === 1}
                                style={{
                                  backgroundColor: 'red',
                                  border: 'none',
                                }}
                                onClick={() => {
                                  handleRemove_SubTasks(i, 0, 0)
                                }}
                              >
                                -
                              </CButton>
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`subTask_planned_startDate-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_planned_startDate')
                                }
                                value={val.tasks[0].subTasks[0].subTask_planned_startDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`subTask_planned_endDate-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_planned_endDate')
                                }
                                value={val.tasks[0].subTasks[0].subTask_planned_endDate}
                              />
                            </td>

                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`subTask_planned_Hrs-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_planned_Hrs')
                                }
                                value={calculateSubTaskPlannedHours(val.tasks[0].subTasks[0])} // Adjust if you need to calculate for a specific task
                              />
                            </td>

                            <td>
                              <CFormInput
                                type="date"
                                name={`subTask_actual_startDate-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_actual_startDate')
                                }
                                value={val.tasks[0].subTasks[0].subTask_actual_startDate}
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`subTask_actual_endDate-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_actual_endDate')
                                }
                                value={val.tasks[0].subTasks[0].subTask_actual_endDate}
                              />
                            </td>

                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`subTask_actual_hrs-${i}`}
                                onChange={(e) =>
                                  handleSubTaskInputChange(e, i, 0, 0, 'subTask_actual_hrs')
                                }
                                value={calculateSubTaskActualHours(val.tasks[0].subTasks[0])} // Adjust if you need to calculate for a specific task
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
                                name={`activities-${i}`}
                                onChange={(e) =>
                                  handleActivitiesInputChange(e, i, 0, 0, 0, 'activities')
                                }
                                value={val.tasks[0].subTasks[0].activities[0].activities}
                                style={{ background: '#00ffff38' }}
                              />
                            </td>
                            <td>
                              <CButton
                                onClick={() => {
                                  handleModule_activities(i)
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
                                onClick={() => handleRemove_activities(i, 0, 0, 0)}
                                disabled={val.tasks[0].subTasks[0].activities.length === 1}
                              >
                                -
                              </CButton>
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`activities_planned_startDate-${i}`}
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
                                value={
                                  val.tasks[0].subTasks[0].activities[0]
                                    .activities_planned_startDate
                                }
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`activities_planned_endDate-${i}`}
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
                                value={
                                  val.tasks[0].subTasks[0].activities[0].activities_planned_endDate
                                }
                              />
                            </td>
                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`activities_planned_Hrs-${i}`}
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
                                value={
                                  val.tasks[0].subTasks[0].activities[0].activities_planned_Hrs
                                }
                              />
                            </td>

                            <td>
                              <CFormInput
                                type="date"
                                name={`activities_actual_startDate-${i}`}
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
                                value={
                                  val.tasks[0].subTasks[0].activities[0].activities_actual_startDate
                                }
                              />
                            </td>
                            <td>
                              <CFormInput
                                type="date"
                                name={`activities_actual_endDate-${i}`}
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
                                value={
                                  val.tasks[0].subTasks[0].activities[0].activities_actual_endDate
                                }
                              />
                            </td>
                            <td>
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`activities_actual_hrs-${i}`}
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
                                value={val.tasks[0].subTasks[0].activities[0].activities_actual_hrs}
                              />
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                          {/* ///////////////////////////for activities start ////////////////////////////// */}
                          {val.tasks[0].subTasks[0].activities
                            .slice(1)
                            .map((activity, activityIndex) => (
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
                                          'activities',
                                        )
                                      }
                                      value={activity.activities}
                                      style={{ background: '#00ffff38' }}
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleModule_activities(i)
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
                                        handleRemove_activities(i, 0, 0, activityIndex + 1)
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
                                      value={activity.activities_planned_startDate}
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
                                      value={activity.activities_planned_endDate}
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
                                      value={activity.activities_planned_Hrs}
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
                                      value={activity.activities_actual_startDate}
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
                                      value={activity.activities_actual_endDate}
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
                                      value={activity.activities_actual_hrs}
                                    />
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              </React.Fragment>
                            ))}

                          {/* ///////////////////////////for activities end ////////////////////////////// */}

                          {val.tasks[0].subTasks.slice(1).map((subtask, j) => (
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
                                      handleSubTaskInputChange(e, i, 0, j + 1, 'subTask')
                                    }
                                    value={subtask.subTask}
                                    style={{ background: ' aquamarine' }}
                                  />
                                </td>
                                <td>
                                  <CButton
                                    onClick={() => {
                                      handleModule_subtask(i)
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
                                      handleRemove_SubTasks(i, 0, j + 1)
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
                                        'subTask_planned_startDate',
                                      )
                                    }
                                    value={subtask.subTask_planned_startDate}
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
                                        'subTask_planned_endDate',
                                      )
                                    }
                                    value={subtask.subTask_planned_endDate}
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    style={{ width: '50px' }}
                                    placeholder="Hrs"
                                    name={`subTask_planned_Hrs-${i}-${j}`}
                                    onChange={(e) =>
                                      handleSubTaskInputChange(
                                        e,
                                        i,
                                        0,
                                        j + 1,
                                        'subTask_planned_Hrs',
                                      )
                                    }
                                    value={subtask.subTask_planned_Hrs}
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
                                        'subTask_actual_startDate',
                                      )
                                    }
                                    value={subtask.subTask_actual_startDate}
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
                                        'subTask_actual_endDate',
                                      )
                                    }
                                    value={subtask.subTask_actual_endDate}
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    style={{ width: '50px' }}
                                    placeholder="Hrs"
                                    name={`subTask_actual_hrs-${i}-${j}`}
                                    onChange={(e) =>
                                      handleSubTaskInputChange(e, i, 0, j + 1, 'subTask_actual_hrs')
                                    }
                                    value={subtask.subTask_actual_hrs}
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
                                      handleActivitiesInputChange(e, i, 0, j + 1, 0, 'activities')
                                    }
                                    value={subtask.activities[0].activities}
                                    style={{ background: '#00ffff38' }}
                                  />
                                </td>
                                <td>
                                  <CButton
                                    onClick={() => {
                                      handleModule_activities_for_subindex(i, j)
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
                                      handleRemove_activities(i, 0, j + 1, 0)
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
                                    value={subtask.activities[0].activities_planned_startDate}
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
                                    value={subtask.activities[0].activities_planned_endDate}
                                  />
                                </td>

                                <td>
                                  {subtask &&
                                    subtask.activities &&
                                    subtask.activities.length > 0 && (
                                      <CFormInput
                                        style={{ width: '50px' }}
                                        placeholder="Hrs"
                                        name={`activities_planned_Hrs-${i}-${j}`}
                                        onChange={(e) =>
                                          handleActivitiesInputChange(
                                            e,
                                            i,
                                            0, // Assuming you want to handle the first sub-task or task index
                                            j + 1, // Assuming j is the index of activities
                                            0,
                                            'activities_planned_Hrs',
                                          )
                                        }
                                        value={subtask.activities[0].activities_planned_Hrs || ''}
                                      />
                                    )}
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
                                    value={subtask.activities[0].activities_actual_startDate}
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
                                    value={subtask.activities[0].activities_actual_endDate}
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
                                    value={subtask.activities[0].activities_actual_hrs}
                                  />
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              {val.tasks[0].subTasks[j + 1].activities
                                .slice(1)
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
                                              'activities',
                                            )
                                          }
                                          value={activie.activities}
                                          style={{ background: '#00ffff38' }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleModule_activities_for_subindex(i, j)
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
                                            handleRemove_activities(i, 0, j + 1, aindex + 1)
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
                        </React.Fragment>
                        {val.tasks.slice(1).map((task, taskindex) => (
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
                                  name={'task'}
                                  onChange={(e) =>
                                    handleTaskInputChange(e, i, taskindex + 1, 'task')
                                  }
                                  value={task.task}
                                />
                              </td>
                              <td>
                                <CButton
                                  onClick={() => {
                                    handleAddTasks(i)
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
                                    handleRemove_Tasks(i, taskindex + 1)
                                  }}
                                >
                                  -
                                </CButton>
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={'task_planned_startDate'}
                                  onChange={(e) =>
                                    handleTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      'task_planned_startDate',
                                    )
                                  }
                                  value={task.task_planned_startDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={'task_planned_endDate'}
                                  onChange={(e) =>
                                    handleTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      'task_planned_endDate',
                                    )
                                  }
                                  value={task.task_planned_endDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={'task_planned_Hrs'}
                                  onChange={(e) =>
                                    handleTaskInputChange(e, i, taskindex + 1, 'task_planned_Hrs')
                                  }
                                  value={task.task_planned_Hrs}
                                />
                              </td>

                              <td>
                                <CFormInput
                                  type="date"
                                  name={`task_actual_startDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      'task_actual_startDate',
                                    )
                                  }
                                  value={task.task_actual_startDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`task_actual_endDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      'task_actual_endDate',
                                    )
                                  }
                                  value={task.task_actual_endDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={`task_actual_hrs`}
                                  onChange={(e) =>
                                    handleTaskInputChange(e, i, taskindex + 1, 'task_actual_hrs')
                                  }
                                  value={task.task_actual_hrs}
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
                                  onChange={(e) =>
                                    handleSubTaskInputChange(e, i, taskindex + 1, 0, 'subTask')
                                  }
                                  value={task.subTasks[0].subTask}
                                  style={{ background: ' aquamarine' }}
                                />
                              </td>
                              <td>
                                <CButton
                                  onClick={() => {
                                    handleAddSubTasks(i, taskindex)
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
                                    handleRemove_SubTasks(i, taskindex + 1, 0)
                                  }}
                                >
                                  -
                                </CButton>
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`subTask_planned_startDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_planned_startDate',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_planned_startDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`subTask_planned_endDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_planned_endDate',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_planned_endDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={`subTask_planned_Hrs-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_planned_Hrs',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_planned_Hrs}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`subTask_actual_startDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_actual_startDate',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_actual_startDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`subTask_actual_endDate-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_actual_endDate',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_actual_endDate}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={`subTask_actual_hrs-${i}-${taskindex}`}
                                  onChange={(e) =>
                                    handleSubTaskInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      'subTask_actual_hrs',
                                    )
                                  }
                                  value={task.subTasks[0].subTask_actual_hrs}
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
                                  onChange={(e) =>
                                    handleActivitiesInputChange(
                                      e,
                                      i,
                                      taskindex + 1,
                                      0,
                                      0,
                                      'activities',
                                    )
                                  }
                                  value={task.subTasks[0].activities[0].activities}
                                  style={{ background: '#00ffff38' }}
                                />
                              </td>
                              <td>
                                <CButton
                                  onClick={() => {
                                    handleAdd_activities_forSubTask1(i, taskindex + 1)
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
                                    handleRemove_activities(i, taskindex + 1, 0, 0)
                                  }}
                                >
                                  -
                                </CButton>
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`activities_planned_startDate-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities
                                      .activities_planned_startDate
                                  }
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`activities_planned_endDate-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities
                                      .activities_planned_endDate
                                  }
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={`activities_planned_Hrs-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities.activities_planned_Hrs
                                  }
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`activities_actual_startDate-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities
                                      .activities_actual_startDate
                                  }
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name={`activities_actual_endDate-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities
                                      .activities_actual_endDate
                                  }
                                />
                              </td>
                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name={`activities_actual_hrs-${i}-${taskindex}`}
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
                                  value={
                                    task.subTasks[0].activities[0].activities.activities_actual_hrs
                                  }
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>

                            {val.tasks[taskindex + 1].subTasks[0].activities
                              .slice(1)

                              .map((activity, asi) => (
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
                                            'activities',
                                          )
                                        }
                                        value={activity.activities}
                                        style={{ background: '#00ffff38' }}
                                      />
                                    </td>
                                    <td>
                                      <CButton
                                        onClick={() => {
                                          handleAdd_activities_forSubTask1(
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
                                          handleRemove_activities(i, taskindex + 1, 0, asi + 1)
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
                                        value={activity.activities_planned_startDate}
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
                                        value={activity.activities_planned_endDate}
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
                                        value={activity.activities_planned_Hrs}
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
                                        value={activity.activities_actual_startDate}
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
                                        value={activity.activities_actual_endDate}
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
                                        value={activity.activities_actual_hrs}
                                      />
                                    </td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </React.Fragment>
                              ))}

                            {val.tasks[taskindex + 1].subTasks.slice(1).map((subTask, s) => (
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
                                          'subTask',
                                        )
                                      }
                                      value={subTask.subTask}
                                      style={{ background: ' aquamarine' }}
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleAddSubTasks(i, taskindex)
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
                                        handleRemove_SubTasks(i, taskindex + 1, s + 1)
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
                                          'subTask_planned_startDate',
                                        )
                                      }
                                      value={subTask.subTask_planned_startDate}
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
                                          'subTask_planned_endDate',
                                        )
                                      }
                                      value={subTask.subTask_planned_endDate}
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
                                          'subTask_planned_Hrs',
                                        )
                                      }
                                      value={subTask.subTask_planned_Hrs}
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
                                          'subTask_actual_startDate',
                                        )
                                      }
                                      value={subTask.subTask_actual_startDate}
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
                                          'subTask_actual_endDate',
                                        )
                                      }
                                      value={subTask.subTask_actual_endDate}
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
                                          'subTask_actual_hrs',
                                        )
                                      }
                                      value={subTask.subTask_actual_hrs}
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
                                          'activities',
                                        )
                                      }
                                      value={subTask.activities[0].activities}
                                      style={{ background: '#00ffff38' }}
                                    />
                                  </td>
                                  <td>
                                    <CButton
                                      onClick={() => {
                                        handleAdd_activities(i, taskindex, s)
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
                                        handleRemove_activities(i, taskindex + 1, s + 1, 0)
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
                                      value={subTask.activities[0].activities_planned_startDate}
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
                                      value={subTask.activities[0].activities_planned_endDate}
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
                                      value={subTask.activities[0].activities_planned_Hrs}
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
                                      value={subTask.activities[0].activities_actual_startDate}
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
                                      value={subTask.activities[0].activities_actual_endDate}
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
                                      value={subTask.activities[0].activities_actual_hrs}
                                    />
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                {val.tasks[taskindex + 1].subTasks[s + 1].activities
                                  .slice(1)
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
                                              'activities',
                                            )
                                          }
                                          value={activity.activities}
                                          style={{ background: '#00ffff38' }}
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          onClick={() => {
                                            handleAdd_activities(i, taskindex, s)
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
                                            handleRemove_activities(i, taskindex + 1, s + 1, ai + 1)
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
                                          style={{ width: '50px' }}
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
                                          style={{ width: '50px' }}
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
                      </tbody>
                      <br></br>
                    </>
                  ))}
                </table>
              </div>
              <div></div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisibleProjectPlanning(false)
                setValidated(false)
              }}
            >
              Close
            </CButton>
            <CButton color="primary" onClick={handle_add_ProjectPlanning}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Update Project Planning Modal  */}

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
              <CCol md={4}>
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
              <CCol md={4}>
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
              <CCol md={4}>
                <CFormSelect
                  label={
                    <span>
                      Status
                      <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  onChange={(e) => {
                    setPurchaseOrder_ToUpdate({
                      ...purchaseOrder_ToUpdate,
                      Status: e.target.value,
                    })
                  }}
                  value={purchaseOrder_ToUpdate.Status || ''}
                  required
                >
                  <option value="">Select a status</option>
                  <option value="Updated By Manager">Updated By Manager</option>
                  <option value="Updated By Team Lead">Updated By Team Lead</option>
                  <option value="Final Approval">Final Approval</option>
                </CFormSelect>
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
                                  onChange={(e) => handleInputChange2(e, i, 'project_modules')}
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
                                    handleInputChange2(e, i, 'module_planned_startDate')
                                  }
                                  value={val?.module_planned_startDate || ''}
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  name="planned_endDate"
                                  onChange={(e) =>
                                    handleInputChange2(e, i, 'module_planned_endDate')
                                  }
                                  value={val?.module_planned_endDate || ''}
                                />
                              </td>

                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name="planned_Hrs"
                                  // onChange={(e) => handleInputChange2(e, i, 'module_planned_Hrs')}
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
                                    handleInputChange2(e, i, 'module_actual_startDate')
                                  }
                                  name="actual_startDate"
                                />
                              </td>
                              <td>
                                <CFormInput
                                  type="date"
                                  value={val?.module_actual_endDate || ''}
                                  onChange={(e) =>
                                    handleInputChange2(e, i, 'module_actual_endDate')
                                  }
                                  name="actual_endDate"
                                />
                              </td>

                              <td>
                                <CFormInput
                                  style={{ width: '50px' }}
                                  placeholder="Hrs"
                                  name="actual_hrs"
                                  // onChange={(e) => handleInputChange2(e, i, 'module_actual_hrs')}
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
                                    handleRemove_Modules2(i, val?.id)
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
                                        handleTaskInputChange2(e, i, 0, 'project_modules_tasks')
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
                                        handleTaskInputChange2(e, i, 0, 'tasks_planned_startDate')
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
                                        handleTaskInputChange2(e, i, 0, 'tasks_planned_endDate')
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
                                        handleTaskInputChange2(e, i, 0, 'tasks_planned_Hrs')
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
                                        handleTaskInputChange2(e, i, 0, 'tasks_actual_startDate')
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
                                        handleTaskInputChange2(e, i, 0, 'tasks_actual_endDate')
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
                                          : 0
                                      }
                                      onChange={(e) =>
                                        handleTaskInputChange2(e, i, 0, 'tasks_actual_hrs')
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
                                        handleSubTaskInputChange2(
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
                                        handleSubTaskInputChange2(
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
                                        handleSubTaskInputChange2(
                                          e,
                                          i,
                                          0,
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
                                        handleSubTaskInputChange2(
                                          e,
                                          i,
                                          0,
                                          0,
                                          'subTasks_planned_Hrs',
                                        )
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
                                        handleSubTaskInputChange2(
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
                                        handleSubTaskInputChange2(
                                          e,
                                          i,
                                          0,
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
                                        handleSubTaskInputChange2(e, i, 0, 0, 'subTasks_actual_hrs')
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
                                        handleActivitiesInputChange2(
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
                                        handleRemove_activities2(
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
                                        handleActivitiesInputChange2(
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
                                        handleActivitiesInputChange2(
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
                                        handleActivitiesInputChange2(
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
                                        handleActivitiesInputChange2(
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
                                        handleActivitiesInputChange2(
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
                                        handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleRemove_activities2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            subtask.projectPlanning_task_subtasks_details && subtask.projectPlanning_task_subtasks_details.length > 0
                                              ? subtask.projectPlanning_task_subtasks_details.reduce(
                                                (sum, subtask) =>
                                                  sum + parseFloat(subtask.subTask_planned_Hrs || 0),
                                                0
                                              ).toString()
                                              : '0'
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange2(
                                              e,
                                              i,
                                              0,
                                              j + 1,
                                              'subTask_planned_Hrs'
                                            )
                                          }
                                        />
                                      </td>

                                      <td>
                                        <CFormInput
                                          type="date"
                                          name={`subTask_actual_startDate-${i}-${j}`}
                                          onChange={(e) =>
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleRemove_activities2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleRemove_activities2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleAddSubTasks_onUpdate(i)
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                              : '0'
                                          }
                                          onChange={(e) =>
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleSubTaskInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleRemove_activities2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                            handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleRemove_activities2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                  handleActivitiesInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleAddSubTasks_onUpdate(i)
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
                                                    handleSubTaskInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleSubTaskInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleRemove_activities2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                    handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleRemove_activities2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
                                                        handleActivitiesInputChange2(
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
            <CButton color="secondary" onClick={() => setVisibleUpdate_projectPlanning(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={handleUpdate}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>

        <CCardBody></CCardBody>
      </CCard>
    </div>
  )
}

export default ProjectPlanningNew
