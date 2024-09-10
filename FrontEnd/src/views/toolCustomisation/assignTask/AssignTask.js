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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { USER_API_ENDPOINT } from 'src/constants'
import styles from './AssignTask.module.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './slik.css'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'

const AssignTask = () => {
  const [visible, setVisible] = useState(false)

  const [validated, setValidated] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [project, setProject] = useState('')
  const [parentTask, setParentTask] = useState('')
  const [task, setTask] = useState('')
  const [taskDetail, setTaskDetail] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [estimatedHour, setEstimatedHour] = useState('')
  const [approver, setApprover] = useState('')
  const [attachment, setAttachment] = useState('')
  const [status, setStatus] = useState('open')
  const [activeEmployee, setActiveEmployee] = useState([])
  const [activeProject, setActiveProject] = useState([])
  const [taskList, setTaskList] = useState([])
  const [employeeTasks, setEmployeeTasks] = useState([])
  const [alltask, setAlltask] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [taskToUpdate, setTaskToUpdate] = useState({})
  ////////////////// get all assigned task///////////////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}fetchAssignTask`).then((res) => {
      setAlltask(res.data.tasks)
      // console.log('task ', res.data.tasks)
    })
  }, [employeeTasks])

  ////////////////////// draging code start ////////////////////////
  const dragStarted = (e, task) => {
    console.log('has started')
    e.dataTransfer.setData('taskData', JSON.stringify(task))
  }
  const ondragover = (e) => {
    e.preventDefault()
    console.log('dragging')
  }

  const onDrop = async (e, employeeId) => {
    console.log('dropped')
    const taskData = e.dataTransfer.getData('taskData')
    // Parse the task data from the string
    const task = JSON.parse(taskData)

    try {
      // Make a PATCH request to update the task status to "assigned"
      await axios.patch(`${USER_API_ENDPOINT}updatetaskStatus/${task.id}`, {
        status: 'assigned',
      })

      // Make a POST request to your backend API to store the task assignment
      await axios.post(`${USER_API_ENDPOINT}assignTask`, {
        taskId: task.id,
        employeeId: employeeId,
      })
      // Fetch tasks assigned to the specific employee
      const response = await axios.get(`${USER_API_ENDPOINT}fetchAssignTask`)
      const allTasks = response.data.tasks

      // Update the state with the fetched tasks
      setEmployeeTasks(allTasks)
    } catch (error) {
      console.error('Error assigning task:', error)
    }
  }
  ////////////////////// draging code end ////////////////////////
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  ////////////// useEffect for all Active Employee ////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveEmployee`).then((res) => {
      setActiveEmployee(res.data.data)
      //   console.log(res.data.data)
    })
  }, [])

  ////////////// useEffect for all Active Project ////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveProject`).then((res) => {
      setActiveProject(res.data.data)
      console.log(res.data.data)
    })
  }, [])

  /////////////////// useEffect to get all TaskList ////////////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getTask`).then((res) => {
      setTaskList(res.data.data)
      console.log(res.data.data)
    })
  }, [visible, employeeTasks])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setAttachment(file)
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    // setValidated(true)

    const formData = new FormData()
    formData.append('project_id', project)
    formData.append('parentTask', parentTask)
    formData.append('task', task)
    formData.append('taskDetail', taskDetail)
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    formData.append('estimatedHour', estimatedHour)
    formData.append('employee_id', approver)
    formData.append('file', attachment)
    formData.append('status', status)

    try {
      // Make a POST request to the backend API
      const response = await axios.post(`${USER_API_ENDPOINT}upload`, formData)

      console.log('Data saved:', response.data)

      // Reset the form and state
      setValidated(false)
      setVisible(false)

      // Add any other logic or UI updates on successful submission
    } catch (error) {
      console.error('Error saving daily expenses:', error)

      // Handle errors or display error messages
    }
  }

  //////////////////////////////// Updating Start ///////////////////////////////

  const fetchTaskData = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}fetchTask/${id}`)
      setTaskToUpdate(response.data.data)
    } catch (error) {
      console.error('Error fetching designation data:', error)
    }
  }

  const handleEdit = (id) => {
    setSelectedTaskId(id)
    fetchTaskData(id)
    setVisibleUpdate(true)
    console.log(id)
  }
  const handleUpdate = async () => {
    // Validate other form fields here if needed

    const formData = new FormData()
    formData.append('project_id', taskToUpdate.project)
    formData.append('parentTask', taskToUpdate.parentTask)
    formData.append('task', taskToUpdate.task)
    formData.append('taskDetail', taskToUpdate.taskDetail)
    formData.append('startDate', taskToUpdate.startDate)
    formData.append('endDate', taskToUpdate.endDate)
    formData.append('estimatedHour', taskToUpdate.estimatedHour)
    formData.append('employee_id', taskToUpdate.approver)
    formData.append('file', taskToUpdate.attachment)

    try {
      // Make a PUT request to the backend API
      const response = await axios.put(`${USER_API_ENDPOINT}updateTask/${selectedTaskId}`, formData)

      console.log('Data updated:', response.data)
      const updatedTask = await axios.get(`${USER_API_ENDPOINT}fetchAssignTask`)
      setAlltask(updatedExpenses.data.tasks)

      // Reset the form and state
      setValidated(false)
      setVisibleUpdate(false)

      // Add any other logic or UI updates on successful update
    } catch (error) {
      console.error('Error updating daily expenses:', error)

      // Handle errors or display error messages
    }
  }
  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Assign Task</strong>
          <CButton onClick={() => setVisible(!visible)}>Add Task</CButton>
          <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Assign Task</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" validated={validated}>
                <CCol md={6}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select Approver"
                    id="validationCustom04"
                    name="project_id"
                    label={
                      <span>
                        Project <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required
                    onChange={(e) => {
                      setProject(e.target.value)
                    }}
                  >
                    <option>Choose...</option>
                    {activeProject.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.project}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select Approver"
                    id="validationCustom04"
                    name="parentTask"
                    label="Parent Task"
                    onChange={(e) => {
                      setParentTask(e.target.value)
                    }}
                  >
                    <option>Choose...</option>
                    {taskList.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.task}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CRow className="mt-2">
                  <CCol>
                    <CFormInput
                      type="text"
                      id="inputTask"
                      name="task"
                      label={
                        <span>
                          Task<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      placeholder="Task"
                      feedbackInvalid="Please provide Task."
                      required
                      onChange={(e) => {
                        setTask(e.target.value)
                      }}
                    />
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol>
                    <CFormTextarea
                      id="inputTaskDetail"
                      name="taskDetail"
                      label={
                        <span>
                          Task Detail<span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      placeholder="Enter Task Detail"
                      feedbackInvalid="Please provide Task Detail."
                      required
                      onChange={(e) => {
                        setTaskDetail(e.target.value)
                      }}
                      rows={2}
                    ></CFormTextarea>
                  </CCol>
                </CRow>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    name="startDate"
                    id="inputStartDate"
                    label={
                      <span>
                        Start Date <span style={{ color: 'red' }}>*</span>
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
                    type="text"
                    name="estimatedHour"
                    id="inputEstimatedHour"
                    label={
                      <span>
                        Estimated Hour<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Estimated Hour"
                    feedbackInvalid="Please provide Estimated Hour."
                    required
                    onChange={(e) => {
                      setEstimatedHour(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    id="customFile"
                    type="file"
                    name="file"
                    label="Attach a file"
                    custom
                    onChange={handleFileChange}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select Approver"
                    id="validationCustom04"
                    name="employee_id"
                    label={
                      <span>
                        Approver <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required
                    onChange={(e) => {
                      setApprover(e.target.value)
                    }}
                  >
                    <option>Choose...</option>
                    {activeEmployee.map((data, index) => (
                      <option key={index} value={data.id}>
                        {`${data.firstName} ${data.midName} ${data.lastName}`}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
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
                Add Task
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardHeader>
        <CCardBody className={styles.cardBody}>
          <div className={styles.taskBox}>
            <div className={styles.taskContentBox}>
              {taskList
                .filter((task) => task.status === 'open')
                .map((data, index) => (
                  <div
                    draggable
                    onDragStart={(e) => dragStarted(e, data)}
                    className={styles.task}
                    key={index}
                  >
                    Task : {data.task}
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.slider_container}>
            <Slider {...settings}>
              {activeEmployee.map((employee, index) => (
                <div key={index}>
                  <div
                    droppable
                    onDragOver={(e) => ondragover(e)}
                    onDrop={(e) => onDrop(e, employee.id)}
                    className={styles.employee_box}
                  >
                    <span style={{ position: 'sticky', top: '0' }}>
                      {`${employee.firstName} ${employee.midName} ${employee.lastName}`}
                    </span>

                    {/* Render tasks for this employee */}
                    {alltask
                      .filter((task) => task.employee_id === employee.id)
                      .map((task, i) => (
                        <>
                          <div key={i} className={styles.assignTask_employee}>
                            Task: {task.taskDetails.task}
                            <div className={styles.actionBtn_box}>
                              <CIcon
                                icon={cilPen}
                                className={styles.actionBtn}
                                style={{ height: '10px', cursor: 'pointer' }}
                                onClick={() => {
                                  handleEdit(task.taskDetails.id)
                                }}
                              ></CIcon>
                              <CIcon
                                icon={cilTrash}
                                style={{ height: '10px', cursor: 'pointer' }}
                                className={styles.actionBtn}
                              ></CIcon>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </CCardBody>
        {/* ////////////////////////////// update model ///////////////////////////////////// */}
        <CModal size="lg" visible={visibleUpdate} onClose={() => setVisibleUpdate(false)}>
          <CModalHeader>
            <CModalTitle>Update Assign Task</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" validated={validated}>
              <CCol md={6}>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select Approver"
                  id="validationCustom04"
                  name="project_id"
                  label={
                    <span>
                      Project <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required
                  value={
                    taskToUpdate.projectDetails?.id !== undefined
                      ? taskToUpdate.projectDetails.id
                      : ''
                  }
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
                      projectDetails: {
                        id: e.target.value,
                      },
                    })
                  }}
                >
                  <option>Choose...</option>
                  {activeProject.map((data, index) => (
                    <option key={index} value={data.id}>
                      {data.project}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select Approver"
                  id="validationCustom04"
                  name="parentTask"
                  label="Parent Task"
                  value={taskToUpdate.parentTask || ''}
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
                      parentTask: e.target.value,
                    })
                  }}
                >
                  <option>Choose...</option>
                  {taskList.map((data, index) => (
                    <option key={index} value={data.id}>
                      {data.task}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CRow className="mt-2">
                <CCol>
                  <CFormInput
                    type="text"
                    id="inputTask"
                    name="task"
                    label={
                      <span>
                        Task<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Task"
                    feedbackInvalid="Please provide Task."
                    required
                    value={taskToUpdate.task || ''}
                    onChange={(e) => {
                      setTaskToUpdate({
                        ...taskToUpdate,
                        task: e.target.value,
                      })
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mt-2">
                <CCol>
                  <CFormTextarea
                    id="inputTaskDetail"
                    name="taskDetail"
                    label={
                      <span>
                        Task Detail<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter Task Detail"
                    feedbackInvalid="Please provide Task Detail."
                    required
                    value={taskToUpdate.taskDetail || ''}
                    onChange={(e) => {
                      setTaskToUpdate({
                        ...taskToUpdate,
                        taskDetail: e.target.value,
                      })
                    }}
                    rows={2}
                  ></CFormTextarea>
                </CCol>
              </CRow>

              <CCol md={6}>
                <CFormInput
                  type="date"
                  name="startDate"
                  id="inputStartDate"
                  label={
                    <span>
                      Start Date <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  feedbackInvalid="Please provide Start Date"
                  required
                  value={taskToUpdate.startDate || ''}
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
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
                  value={taskToUpdate.endDate || ''}
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
                      endDate: e.target.value,
                    })
                  }}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  name="estimatedHour"
                  id="inputEstimatedHour"
                  label={
                    <span>
                      Estimated Hour<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  placeholder="Estimated Hour"
                  feedbackInvalid="Please provide Estimated Hour."
                  required
                  value={taskToUpdate.estimatedHour || ''}
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
                      estimatedHour: e.target.value,
                    })
                  }}
                />
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select Approver"
                  id="validationCustom04"
                  name="employee_id"
                  label={
                    <span>
                      Approver <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  required
                  value={
                    taskToUpdate.employeeDetails?.id !== undefined
                      ? taskToUpdate.employeeDetails.id
                      : ''
                  }
                  onChange={(e) => {
                    setTaskToUpdate({
                      ...taskToUpdate,
                      employeeDetails: { id: e.target.value },
                    })
                  }}
                >
                  <option>Choose...</option>
                  {activeEmployee.map((data, index) => (
                    <option key={index} value={data.id}>
                      {`${data.firstName} ${data.midName} ${data.lastName}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormInput
                  id="customFile"
                  type="file"
                  name="file"
                  label="Attach a file"
                  custom
                  onChange={(event) => {
                    const newFile = event.target.files[0]

                    setTaskToUpdate((prevTask) => ({
                      ...prevTask,
                      attachment: newFile || prevTask.attachment,
                    }))
                  }}
                />
                <a
                  className="btn btn-primary mt-2"
                  style={{ width: '106px' }}
                  href={`${USER_API_ENDPOINT}uploads/${taskToUpdate.attachment}`}
                  target="_blank"
                >
                  View
                </a>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisibleUpdate(false)
                setValidated(false)
              }}
            >
              Close
            </CButton>
            <CButton color="primary" onClick={handleUpdate}>
              Update Task
            </CButton>
          </CModalFooter>
        </CModal>
      </CCard>
    </div>
  )
}
export default AssignTask
