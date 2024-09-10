import { cilCash, cilEducation, cilPen, cilPlus, cilUser, cilX } from '@coreui/icons'
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
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from 'src/constants'
import styles from './purchaseOrder.module.css'
import './purchase.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const PurchaseOrder = () => {
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleProjectPlanning, setVisibleProjectPlanning] = useState(false)
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
  const [filterData, setfilterData] = useState([])
  const [selected_Purchase_OrderId, setSelected_Purchase_OrderId] = useState('')
  const [purchase_orderToUpdate, setPurchase_orderToUpdate] = useState({})
  const [removedAttachments, setRemovedAttachments] = useState([])
  const [updateToast, setUpdateToast] = useState(false)
  const [add_projectPlanning_Toast, setAdd_projectPlanning_Toast] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectPlanning_file, setProjectPlanning_file] = useState([])
  const [plannedHrsValue, setPlannedHrsValue] = useState(0)
  const [actualHrsValue, setActualHrsValue] = useState(0)

  const [milestones, setMilestones] = useState([{ milestone: '', milestoneValue: '' }])

  let userDesignation

  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  userDesignation = ParsedData.designation_id

  if (userDesignation != 1) {
    // nav('/toolCustomisation/project');
    window.location.href = window.location.origin + '/#/toolCustomisation/project'
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
      setPurchaseOrderList(res.data.data.reverse())
      setfilterData(res.data.data.reverse())
      // console.log(res.data.data)
    })
  }, [visible, visibleUpdate])

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

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (newRowsPerPage, page) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(page)
  }

  const totalRows = filterData.length
  const columns = [
    {
      name: 'Sr.No.',
      selector: (_, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name of Client',
      selector: (row) => row.clientNameDetails.clientName,
      sortable: true,
    },
    {
      name: (
        <div>
          Value (<i className="bi bi-currency-rupee" style={{ display: 'inline-block' }}></i>)
        </div>
      ),
      selector: (row) =>
        row.purchase_order_detail.reduce(
          (total, data) => total + parseFloat(data.milestoneValue),
          0,
        ),
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
      name: 'Action',
      width: '80px',
      cell: (row) => (
        <>
          <CIcon
            icon={cilPen}
            onClick={() => handleEdit(row.id)}
            style={{ cursor: 'pointer', color: 'blue' }}
          />
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

  const handleProjectPlanning = (id) => {
    setSelected_Purchase_OrderId(id)
    fetchpurchase_order_Data(id)
    setVisibleProjectPlanning(true)
  }
  const [Employee_ID, setEmployee_ID] = useState(null)
  const [client_ID, setClientID] = useState(' ')
  console.log('purchase order id', selected_Purchase_OrderId)
  ///////////////////////////// column end for data table/////////////////////////////
  ///////////// Update start ////////////////////////////////
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
  console.log(purchase_orderToUpdate)

  const handleEdit = (id) => {
    setSelected_Purchase_OrderId(id)
    fetchpurchase_order_Data(id)
    setVisibleUpdate(true)
  }
  console.log(selected_Purchase_OrderId)

  /////////////////////////////////// Update Api //////////////////////////////////////////////

  const handleUpdate = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault() // Prevent form submission
      event.stopPropagation()
      setValidatedUpdate(true) // Set validation to true to show validation feedback
      return
    }

    try {
      const formData = new FormData()
      formData.append('clientName_id', purchase_orderToUpdate.clientNameDetails?.id)
      formData.append('purchaseOrderNo', purchase_orderToUpdate.purchaseOrderNo)
      formData.append('startDate', purchase_orderToUpdate.startDate)
      formData.append('endDate', purchase_orderToUpdate.endDate)
      formData.append(
        'milestones',
        JSON.stringify(purchase_orderToUpdate.purchase_order_detail || []),
      )

      // Append existing attachments if no new attachments are selected
      if (
        !purchase_orderToUpdate.attachment ||
        typeof purchase_orderToUpdate.attachment === 'string'
      ) {
        // Existing attachments are strings, append them directly
        formData.append('file', purchase_orderToUpdate.attachment)
      } else if (Array.isArray(purchase_orderToUpdate.attachment)) {
        // If new attachments are selected, append them
        purchase_orderToUpdate.attachment.forEach((file) => {
          formData.append('file', file)
        })
      }

      // Handle removed attachments
      if (removedAttachments.length > 0) {
        // Append removed attachment IDs to be deleted on the backend
        formData.append('removedAttachments', JSON.stringify(removedAttachments))
      }

      const response = await fetch(
        `${USER_API_ENDPOINT}updatePurchaseOrder/${purchase_orderToUpdate.id}`,
        {
          method: 'PUT',
          body: formData,
        },
      )

      if (response.ok) {
        // Handle success
        console.log('Purchase order updated successfully')
        setVisibleUpdate(false)
        setUpdateToast(true)
        setValidatedUpdate(false)
        setPurchase_orderToUpdate({
          clientNameDetails: {},
          purchaseOrderNo: '',
          startDate: '',
          endDate: '',
          purchase_order_detail: [],
          purchase_order_attachment_detail: [],
          attachment: null,
          id: null,
        })

        setRemovedAttachments([]) // Clear removed attachments after successful update
      } else {
        // Handle error
        console.error('Error updating purchase order')
      }
    } catch (error) {
      console.error(error)
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
  const handleRemove_file = (indexToRemove) => {
    const updatedAttachment = [...attachment]
    updatedAttachment.splice(indexToRemove, 1)
    setAttachment(updatedAttachment)
  }

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
  const handleAdd_onUpdate = () => {
    const updatedMilestones = [
      ...purchase_orderToUpdate.purchase_order_detail,
      { milestone: '', milestoneValue: '' },
    ]
    setPurchase_orderToUpdate({
      ...purchase_orderToUpdate,
      purchase_order_detail: updatedMilestones,
    })
  }

  const handleUpdateRemove = (index) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this field?')
    if (shouldRemove) {
      // Create a copy of the purchase_order_detail array
      const updatedPurchaseOrderDetail = [...purchase_orderToUpdate.purchase_order_detail]

      // Remove the milestone at the specified index
      updatedPurchaseOrderDetail.splice(index, 1)

      // Update the state with the modified purchase_order_detail array
      setPurchase_orderToUpdate({
        ...purchase_orderToUpdate,
        purchase_order_detail: updatedPurchaseOrderDetail,
      })
    }
  }

  const handleChange_onUpdate = (e, i) => {
    const { name, value } = e.target
    const updatedMilestones = purchase_orderToUpdate.purchase_order_detail.map(
      (milestones, index) => {
        if (index === i) {
          return {
            ...milestones,
            [name]: value,
          }
        }
        return milestones
      },
    )
    setPurchase_orderToUpdate({
      ...purchase_orderToUpdate,
      purchase_order_detail: updatedMilestones,
    })
  }

  //////////////////////////////////////// Project Planning //////////////////////////

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

  //////////////// add more tasks ////////////////////////////
  const handleAddTasks = (moduleIndex) => {
    const updatedModules = [...modules]

    updatedModules[moduleIndex].tasks.push({
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
    })
    setModules(updatedModules)
    // console.log(updatedModules)
  }

  ////////////////////////////// for subtask /////////////////////////////////

  const handleModule_subtask = (moduleIndex) => {
    const updatedModules = [...modules]

    updatedModules[moduleIndex].tasks[0].subTasks.push({
      subTask: '',
      subTask_planned_startDate: '',
      subTask_planned_endDate: '',
      subTask_planned_Hrs: '', // Initialize to 0
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

    setModules(updatedModules)
  }
  const renderSubTasks = (tasks, moduleIndex) => {
    return tasks.map((task, taskIndex) => {
      return task.subTasks.map((subTask, subTaskIndex) => (
        <tr key={`module-${moduleIndex}-task-${taskIndex}-subTask-${subTaskIndex}`}>
          <td>
            <CFormInput
              style={{ width: '50px' }}
              placeholder="Hrs"
              name={`subTask_planned_Hrs-${subTaskIndex}`}
              onChange={(e) =>
                handleSubTaskInputChange(
                  e,
                  moduleIndex,
                  taskIndex,
                  subTaskIndex,
                  'subTask_planned_Hrs',
                )
              }
              value={subTask.activities.reduce((total, activity) => {
                return total + (Number(activity.activities_planned_Hrs) || 0)
              }, 0)}
            />
          </td>
          <td>
            <CButton onClick={() => handleModule_subtask(moduleIndex)}>+</CButton>
          </td>
        </tr>
      ))
    })
  }

  // const handleModule_subtask = (moduleIndex) => {

  //   const updatedModules = [...modules]

  //   updatedModules[moduleIndex].tasks[0].subTasks.push({
  //     subTask: '',
  //     subTask_planned_startDate: '',
  //     subTask_planned_endDate: '',
  //     subTask_planned_Hrs: '',
  //     subTask_actual_startDate: '',
  //     subTask_actual_endDate: '',
  //     subTask_actual_hrs: '',
  //     activities: [
  //       {
  //         activities: '',
  //         activities_planned_startDate: '',
  //         activities_planned_endDate: '',
  //         activities_planned_Hrs: '',
  //         activities_actual_startDate: '',
  //         activities_actual_endDate: '',
  //         activities_actual_hrs: '',
  //       },
  //     ],
  //   })
  //   setModules(updatedModules)
  // }

  const handleAddSubTasks = (moduleIndex, taskIndex) => {
    console.log(moduleIndex, taskIndex)
    const existingSubTasks = updatedModules[moduleIndex].tasks[taskIndex].subTasks
    const lastSubTask = existingSubTasks[existingSubTasks.length - 1]
    const lastSubTaskValue = Number(lastSubTask.actual_hrs) || 0

    // Calculate the new divided value
    const dividedValue = lastSubTaskValue / 2

    // Update the existing subtask with the new divided value
    lastSubTask.actual_hrs = dividedValue

    // Create a new subtask with the same divided value
    const newSubTask = {
      ...lastSubTask,
      actual_hrs: dividedValue,
    }
    const updatedModules = [...modules]
    updatedModules[moduleIndex].tasks[taskIndex + 1].subTasks.push({
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
    console.log('>>>>id', moduleIndex, taskIndex, subTasks)
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
  //////////////////////////////// onchange function /////////////////////////////////
  const handleInputChange = (e, index, key) => {
    const { name, value } = e.target
    const updatedModules = [...modules]
    updatedModules[index][name] = value
    setModules(updatedModules)
  }

  ///////////////// for tasks on change ////////////////////////////////

  const handleTaskInputChange = (e, moduleIndex, taskIndex, key) => {
    const { name, value } = e.target
    const updatedModules = [...modules]
    // Extracting the key from the name attribute
    const fieldName = name.split('-')[0] // Extract the field name from the name attribute
    // Update the value in the modules state
    updatedModules[moduleIndex].tasks[taskIndex][fieldName] = value
    setModules(updatedModules)
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
    setModules(updatedModules)
  }

  // const handleSubTaskInputChange = (e, moduleIndex, taskIdx, subTaskIdx, activityIdx, key) => {
  //   const { name, value } = e.target;
  //   const updatedModules = [...modules];

  //   // Extracting the keys from the name attribute
  //   const [field, i, taskIndex, s] = name.split('-');
  //   const fieldName = key.split('-').join('_'); // Convert to snake_case if needed

  //   // Update the value in the modules state
  //   updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx][fieldName] = value;

  //   // If the key indicates an activity field, update the activities and recalculate the subTask_planned_Hrs
  //   if (fieldName.startsWith('activities_')) {
  //     // Update the specific activity's field
  //     updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx].activities[activityIdx][fieldName] = value;

  //     // Recalculate the subTask_planned_Hrs based on the updated activities
  //     updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx].subTask_planned_Hrs =
  //       updatedModules[moduleIndex].tasks[taskIdx].subTasks[subTaskIdx].activities.reduce((activityTotal, activity) => {
  //         return activityTotal + (Number(activity.activities_planned_Hrs) || 0);
  //       }, 0);
  //   }

  //   setModules(updatedModules);
  // };

  /////////////////////////////////// for activities onchange //////////////////////////

  const handleActivitiesInputChange = (
    e,
    moduleIndex,
    taskIndex,
    subTaskIndex,
    activityIndex,
    key,
  ) => {
    console.log('aa', moduleIndex, taskIndex, subTaskIndex, activityIndex, key)
    const { name, value } = e.target
    const updatedModules = [...modules]

    // Extracting the keys from the name attribute
    const [, i, taskIndexStr, s] = name.split('-')

    const fieldName = key.split('-').join('_')
    // Update the value in the modules state
    updatedModules[moduleIndex].tasks[taskIndex].subTasks[subTaskIndex].activities[activityIndex][
      fieldName
    ] = value

    setModules(updatedModules)
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
  const handleSubTaskInputChange1 = (e, taskIndex, subTaskIndex, activityIndex, type) => {
    const { value, name } = e.target
    const newData = { ...data }

    // Update the specific field
    if (type === 'subTask_planned_Hrs') {
      newData.tasks[taskIndex].subTasks[subTaskIndex][name] = Number(value)
    }

    // Recalculate sums
    newData.tasks[taskIndex].subTasks[subTaskIndex].subTask_actual_hrs = newData.tasks[
      taskIndex
    ].subTasks[subTaskIndex].activities.reduce(
      (total, activity) => total + Number(activity.activities_actual_hrs),
      0,
    )

    newData.tasks[taskIndex].task_actual_hrs = newData.tasks[taskIndex].subTasks.reduce(
      (total, subTask) => total + subTask.subTask_actual_hrs,
      0,
    )

    newData.module_planned_hrs = newData.tasks.reduce(
      (total, task) => total + task.task_actual_hrs,
      0,
    )

    // Update state
    setModules(newData)
  }
  const calculateModulePlannedHours = (val) => {
    val.tasks.forEach((task) => {
      task.subTasks.forEach((subTask) => {
        subTask.subTask_planned_hrs = subTask.activities.reduce((total, activity) => {
          return total + (Number(activity.activities_planned_hrs) || 0)
        }, 0)
      })
    })

    // Sum sub-tasks planned hours in tasks
    val.tasks.forEach((task) => {
      task.task_planned_hrs = task.subTasks.reduce((total, subTask) => {
        return total + (Number(subTask.subTask_planned_hrs) || 0)
      }, 0)
    })

    // Sum tasks planned hours in module
    const module_planned_hrs = val.tasks.reduce((total, task) => {
      return total + (Number(task.task_planned_hrs) || 0)
    }, 0)

    return module_planned_hrs
  }
  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Purchase Order</strong>
          <CButton onClick={() => setVisible(!visible)}>Add Purchase Order</CButton>
          <CModal
            size="lg"
            visible={visible}
            onClose={() => {
              setVisible(false), setValidated(false)
            }}
          >
            <CModalHeader>
              <CModalTitle>Purchase Order</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" validated={validated}>
                <CCol md={5}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select Client Name"
                    id="validationCustom04"
                    name="clientName_id"
                    label={
                      <span>
                        Client Name<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required
                    onChange={(e) => {
                      setClient(e.target.value)
                    }}
                  >
                    <option>Choose...</option>
                    {availableClient.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.clientName}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={1}>
                  <br />
                  <CIcon
                    icon={cilPlus}
                    style={{ marginTop: '17px', cursor: 'pointer' }}
                    onClick={() => {
                      setVisibleAdd(true)
                    }}
                  ></CIcon>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="purchaseOrderNo"
                    name="purchaseOrderNo"
                    label={
                      <span>
                        Purchase Order No.<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Purchase Order No"
                    feedbackInvalid="Please provide Purchase Order No."
                    required
                    onChange={(e) => {
                      setPurchaseOrderNo(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    name="startDate"
                    id="inputStartDate"
                    label={
                      <span>
                        Start Date<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide Start Date"
                    required
                    onChange={(e) => {
                      setStartDate(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    name="endDate"
                    id="inputEndDate"
                    label={
                      <span>
                        End Date<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide End Date"
                    required
                    onChange={(e) => {
                      setEndDate(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    id="customFile"
                    type="file"
                    name="file"
                    label="File"
                    custom
                    multiple
                    onChange={handleFileChange}
                  />
                  <ol>
                    {attachment.map((file, i) => (
                      <li key={i}>
                        {file.name}{' '}
                        <CIcon
                          icon={cilX}
                          className={styles.crossBtn}
                          onClick={() => {
                            handleRemove_file(i)
                          }}
                        ></CIcon>
                      </li>
                    ))}
                  </ol>
                </CCol>
                <div>
                  <h6>Milestone Details</h6>
                  <CRow className="g-3 mb-1 ">
                    <CCol md={3}>Milestone</CCol>
                    <CCol md={3}>
                      Milestone Value (
                      <i className="bi bi-currency-rupee" style={{ display: 'inline-block' }}></i>)
                    </CCol>
                  </CRow>
                  {milestones.map((val, i) => (
                    <CRow className="g-3 mb-1 " key={i}>
                      <CCol md={3}>
                        <CFormInput
                          name="milestone"
                          value={val.milestone}
                          type="text"
                          id={`milestone${i}`}
                          placeholder="Milestone"
                          onChange={(e) => handleChange(e, i)}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          name="milestoneValue"
                          value={val.milestoneValue}
                          type="text"
                          id={`milestoneValue${i}`}
                          placeholder="Milestone Value"
                          onChange={(e) => handleChange(e, i)}
                        />
                      </CCol>
                      <CCol md={1}>
                        <CButton color="success" onClick={handleAdd}>
                          Add
                        </CButton>
                      </CCol>

                      <CCol md={2}>
                        <CButton
                          color="danger"
                          onClick={() => handleRemove(i)}
                          disabled={milestones.length === 1}
                        >
                          Remove
                        </CButton>
                      </CCol>
                    </CRow>
                  ))}
                </div>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setVisible(false)
                  setValidated(false)
                }}
              >
                Close
              </CButton>
              <CButton color="primary" onClick={handleSubmit}>
                Add Purchase Order
              </CButton>
            </CModalFooter>
          </CModal>

          {/* ////////////////////////////////////////Add Client Model ///////////////////////////////////////// */}
          <CModal visible={visibleAdd} onClose={() => setVisibleAdd(false)}>
            <CModalHeader>
              <CModalTitle>Add Client</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" validated={validatedAdd}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Enter Client Name "
                    autoComplete="client"
                    type="text"
                    required
                    feedbackInvalid="Please provide First Name."
                    onChange={(e) => {
                      setClientName(e.target.value)
                    }}
                  />
                </CInputGroup>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setVisibleAdd(false)
                  setValidated(false)
                }}
              >
                Close
              </CButton>
              <CButton color="primary" onClick={handleAddClient}>
                Add Client
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardHeader>
        <CCardBody>
          <DataTable
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
              <input
                type="text"
                placeholder="Search here"
                className="w-25 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </CCardBody>

        {/* /////////////////////////////////// Update Model Start ///////////////////////////////////// */}
        <CModal size="lg" visible={visibleUpdate} onClose={() => setVisibleUpdate(false)}>
          <CModalHeader>
            <CModalTitle>Update Purchase Order</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" validated={validatedUpdate}>
              <CCol md={5}>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select Client Name"
                  id="validationCustom04"
                  name="clientName_id"
                  label={
                    <span>
                      Client Name<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required
                  value={
                    purchase_orderToUpdate.clientNameDetails?.id !== undefined
                      ? purchase_orderToUpdate.clientNameDetails.id
                      : ''
                  }
                  onChange={(e) => {
                    setPurchase_orderToUpdate({
                      ...purchase_orderToUpdate,
                      clientNameDetails: {
                        id: e.target.value,
                      },
                    })
                  }}
                >
                  <option>Choose...</option>
                  {availableClient.map((data, index) => (
                    <option key={index} value={data.id}>
                      {data.clientName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={1}>
                <br />
                <CIcon
                  icon={cilPlus}
                  style={{ marginTop: '17px', cursor: 'pointer' }}
                  onClick={() => {
                    setVisibleAdd(true)
                  }}
                ></CIcon>
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="purchaseOrderNo"
                  name="purchaseOrderNo"
                  label={
                    <span>
                      Purchase Order No.<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  placeholder="Purchase Order No"
                  required
                  feedbackInvalid="Please provide Purchase Order No."
                  value={purchase_orderToUpdate.purchaseOrderNo || ''}
                  onChange={(e) => {
                    setPurchase_orderToUpdate({
                      ...purchase_orderToUpdate,
                      purchaseOrderNo: e.target.value,
                    })
                  }}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="date"
                  name="startDate"
                  id="inputStartDate"
                  label={
                    <span>
                      Start Date<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  feedbackInvalid="Please provide Start Date"
                  required
                  value={purchase_orderToUpdate.startDate || ''}
                  onChange={(e) => {
                    setPurchase_orderToUpdate({
                      ...purchase_orderToUpdate,
                      startDate: e.target.value,
                    })
                  }}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="date"
                  name="endDate"
                  id="inputEndDate"
                  label={
                    <span>
                      End Date<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  feedbackInvalid="Please provide End Date"
                  required
                  value={purchase_orderToUpdate.endDate || ''}
                  onChange={(e) => {
                    setPurchase_orderToUpdate({
                      ...purchase_orderToUpdate,
                      endDate: e.target.value,
                    })
                  }}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  id="customFile"
                  type="file"
                  name="file"
                  label="File"
                  custom
                  multiple
                  onChange={(event) => {
                    const files = event.target.files
                    const newAttachments = Array.from(files)

                    setPurchase_orderToUpdate((prevPurchaseOrder) => ({
                      ...prevPurchaseOrder,
                      attachment: prevPurchaseOrder.attachment
                        ? [...prevPurchaseOrder.attachment, ...newAttachments]
                        : newAttachments,
                    }))
                  }}
                />

                {purchase_orderToUpdate.attachment ? (
                  <ol>
                    {purchase_orderToUpdate.attachment.map((files, i) => (
                      <li key={i}>
                        {files.name}{' '}
                        <CIcon
                          icon={cilX}
                          className={styles.crossBtn}
                          onClick={() => {
                            handleRemove_updateAttachment(i)
                          }}
                        ></CIcon>
                      </li>
                    ))}
                  </ol>
                ) : (
                  ''
                )}

                {purchase_orderToUpdate.purchase_order_attachment_detail ? (
                  <ol>
                    {purchase_orderToUpdate.purchase_order_attachment_detail.map((data, index) => (
                      <li key={index}>
                        <a
                          style={{ width: '106px' }}
                          href={`${USER_API_ENDPOINT}uploads/${data.attachment}`}
                          target="_blank"
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
                <h6>Milestone Details</h6>
                <CRow className="g-3 mb-1 ">
                  <CCol md={3}>Milestone</CCol>
                  <CCol md={3}>
                    Milestone Value (
                    <i className="bi bi-currency-rupee" style={{ display: 'inline-block' }}></i>)
                  </CCol>
                </CRow>

                {purchase_orderToUpdate.purchase_order_detail ? (
                  purchase_orderToUpdate.purchase_order_detail.map((val, i) => (
                    <CRow className="g-3 mb-1 " key={i}>
                      <CCol md={3}>
                        <CFormInput
                          name="milestone"
                          value={val.milestone}
                          type="text"
                          id={`milestone${i}`}
                          placeholder="Milestone"
                          onChange={(e) => handleChange_onUpdate(e, i)}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          name="milestoneValue"
                          value={val.milestoneValue}
                          type="text"
                          id={`milestoneValue${i}`}
                          placeholder="Milestone Value"
                          onChange={(e) => handleChange_onUpdate(e, i)}
                        />
                      </CCol>
                      <CCol md={1}>
                        <CButton color="success" onClick={handleAdd_onUpdate}>
                          Add
                        </CButton>
                      </CCol>

                      <CCol md={2}>
                        <CButton
                          color="danger"
                          onClick={() => handleUpdateRemove(i)}
                          disabled={purchase_orderToUpdate.purchase_order_detail.length === 1}
                        >
                          Remove
                        </CButton>
                      </CCol>
                    </CRow>
                  ))
                ) : (
                  <p>No purchase order details available.</p>
                )}
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisibleUpdate(false)
                setValidatedUpdate(false)
              }}
            >
              Close
            </CButton>
            <CButton color="primary" onClick={handleUpdate}>
              Update Purchase Order
            </CButton>
          </CModalFooter>
        </CModal>
        {/* ///////////////Update Toaster////////// */}

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
                  Purchase Order updated successfully...
                </CToastBody>
              </CToast>
            </CToaster>
          </>
        )}

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
              {`Project Planning :- ${
                purchase_orderToUpdate.clientNameDetails?.clientName !== undefined
                  ? purchase_orderToUpdate.clientNameDetails?.clientName
                  : ''
              }`}
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
                  onChange={(e) => {
                    setProjectName(e.target.value)
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
                          {console.log('I KI VAL', i)}
                          <tr>
                            <td colSpan={6}>
                              <CFormInput
                                name="modules"
                                placeholder="Modules"
                                value={val.modules}
                                onChange={(e) => handleInputChange(e, i)}
                                style={{ width: '590px', background: 'floralwhite' }}
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

                                  // Sum up subTask planned hours
                                  task.subTasks.forEach((subTask) => {
                                    let subTask_planned_Hrs =
                                      Number(subTask.subTask_planned_Hrs) || 0

                                    // Sum up activities planned hours for the current subTask
                                    subTask.activities.forEach((activity) => {
                                      subTask_planned_Hrs +=
                                        Number(activity.activities_planned_Hrs) || 0
                                    })

                                    // Add subTask planned hours to task planned hours
                                    task_planned_Hrs += subTask_planned_Hrs
                                  })

                                  return total + task_planned_Hrs
                                }, 0)}
                                readOnly
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
                                  let task_actual_hrs = Number(task.task_actual_hrs) || 0 // Adjust the property name as per your structure
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
                                style={{ backgroundColor: 'red', border: 'none' }}
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
                                style={{ width: '488px', background: ' antiquewhite' }}
                                placeholder="Tasks"
                                name={`task-${i}`}
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
                                style={{ backgroundColor: 'red', border: 'none' }}
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
                                name={`task_planned_Hrs-${i}`}
                                onChange={(e) => handleTaskInputChange(e, i, 0, 'task_planned_Hrs')}
                                value={val.tasks.reduce((total, task) => {
                                  let subTasksHrsSum = task.subTasks.reduce((subTotal, subTask) => {
                                    let activitiesHrsSum = subTask.activities.reduce(
                                      (activityTotal, activity) => {
                                        let activities_planned_Hrs =
                                          Number(activity.activities_planned_Hrs) || 0
                                        return activityTotal + activities_planned_Hrs
                                      },
                                      0,
                                    )
                                    return subTotal + activitiesHrsSum
                                  }, 0)
                                  return total + subTasksHrsSum
                                }, 0)}
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
                              <CFormInput
                                style={{ width: '50px' }}
                                placeholder="Hrs"
                                name={`task_actual_hrs-${i}`}
                                onChange={(e) => handleTaskInputChange(e, i, 0, 'task_actual_hrs')}
                                value={val.tasks[0].task_actual_hrs}
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
                                style={{ backgroundColor: 'red', border: 'none' }}
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
                                value={val.tasks.reduce((total, task) => {
                                  return (
                                    total +
                                    task.subTasks.reduce((subTotal, subTask) => {
                                      return (
                                        subTotal +
                                        subTask.activities.reduce((activityTotal, activity) => {
                                          return (
                                            activityTotal +
                                            (Number(activity.activities_planned_Hrs) || 0)
                                          )
                                        }, 0)
                                      )
                                    }, 0)
                                  )
                                }, 0)}
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
                                value={val.tasks.reduce((total, task) => {
                                  let subTasksHrsSum = task.subTasks.reduce((subTotal, subTask) => {
                                    let subTask_actual_hrs = Number(subTask.subTask_actual_hrs) || 0 // Adjust the property name as per your structure
                                    return subTotal + subTask_actual_hrs
                                  }, 0)
                                  return total + subTasksHrsSum
                                }, 0)}
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
                                style={{ backgroundColor: 'red', border: 'none' }}
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
                                      style={{ backgroundColor: 'red', border: 'none' }}
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
                                    style={{ backgroundColor: 'red', border: 'none' }}
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
                                    style={{ backgroundColor: 'red', border: 'none' }}
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
                                    value={subtask.activities[0].activities_planned_Hrs}
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
                                          style={{ backgroundColor: 'red', border: 'none' }}
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
                                          name="actual_hrs"
                                          onChange={(e) => handleInputChange(e, i)}
                                          value={val.tasks.reduce((total, task) => {
                                            return (
                                              total +
                                              task.subTasks.reduce((subTotal, subTask) => {
                                                return (
                                                  subTotal +
                                                  subTask.activities.reduce(
                                                    (activityTotal, activity) => {
                                                      return (
                                                        activityTotal +
                                                        (Number(activity.activities_actual_hrs) ||
                                                          0)
                                                      )
                                                    },
                                                    0,
                                                  )
                                                )
                                              }, 0)
                                            )
                                          }, 0)}
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
                                  style={{ width: '488px', background: ' antiquewhite' }}
                                  placeholder="Tasks"
                                  name={`task-${i}-${taskindex}`}
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
                                  style={{ backgroundColor: 'red', border: 'none' }}
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
                                  name={`task_planned_startDate-${i}-${taskindex}`}
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
                                  name={`task_planned_endDate-${i}-${taskindex}`}
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
                                  name={`task_planned_Hrs-${i}-${taskindex}`}
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
                                  name={`task_actual_hrs-${i}-${taskindex}`}
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
                                  style={{ backgroundColor: 'red', border: 'none' }}
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
                                  style={{ backgroundColor: 'red', border: 'none' }}
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
                                        style={{ backgroundColor: 'red', border: 'none' }}
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
                                      style={{ backgroundColor: 'red', border: 'none' }}
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
                                      style={{ backgroundColor: 'red', border: 'none' }}
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
                                          style={{ backgroundColor: 'red', border: 'none' }}
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
              Add Project Planning
            </CButton>
          </CModalFooter>
        </CModal>
        <CCardBody></CCardBody>
      </CCard>
    </div>
  )
}

export default PurchaseOrder
