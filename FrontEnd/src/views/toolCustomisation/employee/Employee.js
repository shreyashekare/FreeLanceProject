import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormTextarea,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CRow,
} from '@coreui/react'
import axios, { all } from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from 'src/constants'
import { cilCash, cilPen } from '@coreui/icons'
import { Button } from '@coreui/coreui'
import { useNavigate } from 'react-router-dom'

const Employee = () => {
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleSalary, setVisibleSalary] = useState(false)
  const [validated, setValidated] = useState(false)
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [middleName, setmiddleName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [contact, setContact] = useState()
  const [address, setAddress] = useState('')
  const [panCard, setPanCard] = useState('')
  const [adhar, setAdhar] = useState('')
  const [designation, setDesignation] = useState('')
  const [designationList, setDesignationList] = useState([])
  const [dob, setDob] = useState()
  const [joiningDate, setJoiningDate] = useState()
  const [relievingDate, setRelievingDate] = useState()
  const [gender, setGender] = useState('male')
  const [employeeList, setEmployeeList] = useState([])
  const [search, setSearch] = useState('')
  const [filterData, setfilterData] = useState([])
  const [allDesignationList, setAllDesignationList] = useState([])
  const [updateToast, setUpdateToast] = useState(false)
  const [emailToast, setEmailToast] = useState(false)
  const [salaryDetails, setSalaryDetails] = useState([{ year: '', month: '', salary: '' }])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [employeeToUpdate, setEmployeeToUpdate] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const totalRows = filterData.length
  const nav = useNavigate()
  let userDesignation

  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  userDesignation = ParsedData.designation_id
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (newRowsPerPage, page) => {
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(page)
  }

  // if (userDesignation != 1) {
  //   // nav('/toolCustomisation/project');
  //   window.location.href = window.location.origin + '/#/toolCustomisation/project'
  // }
  ///////////// use effect for the active designation ///////////
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getActiveDesignation`).then((res) => {
      // console.log(res.data)
      setDesignationList(res.data.data)
    })
  }, [])

  //////////// use effect for all designation ///////////////

  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getDesignation`).then((res) => {
      setAllDesignationList(res.data.data)
    })
  }, [])

  //////////// get employee effect ///////////////

  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getemployeeDesignation`).then((res) => {
      // console.log(res.data.data)
      setEmployeeList(res.data.data)
      setfilterData(res.data.data.reverse())
    })
  }, [visible, visibleUpdate])
  // console.log(employeeList)

  /////////////////// filter data effect //////////////////

  useEffect(() => {
    const filterEmployee = employeeList.filter((employee) => {
      return employee.firstName.toLowerCase().match(search.toLowerCase())
    })
    setfilterData(filterEmployee)
  }, [search, employeeList])

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (event) => {
    if (password.length < 8) {
      alert('Please enter a valid password. Length of password must be greater than or equal to 8.')
      return
    }
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    setValidated(true)

    if (!validateEmail(email)) {
      setEmailError('Please provide a Valid Email')
      return
    }
    try {
      // Send a POST request to add a new designation
      const response = await axios.post(`${USER_API_ENDPOINT}addEmployee`, {
        firstName: fname,
        midName: middleName,
        lastName: lname,
        email: email,
        password: password,
        contact: contact,
        address: address,
        panCard: panCard,
        adhar: adhar,
        dob: dob,
        joiningDate: joiningDate,
        relievingDate: relievingDate,
        gender: gender,
        status: true,
        designation_id: designation,
      })

      console.log('Data saved:', response.data)

      setVisible(false)
      setValidated(false)
      // alert('Data saved successfully')
    } catch (error) {
      console.log('Error saving employee:', error)

      if (error.response.data.message == 'Email already exists') {
        setEmailToast(true)
      } else {
        console.error('Error saving employee')
      }

      // setValidated(false)
    }

    // setValidated(false)
  }

  /////// date formate ////
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
  }

  const columns = [
    {
      name: 'Sr.No.',
      selector: (_, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Name',
      selector: (row) => `${row.firstName} ${row.midName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: (row) => {
        return row.employeeDesignation?.designation !== undefined
          ? row.employeeDesignation.designation
          : ''
      },
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: 'Joining Date',
      selector: (row) => formatDate(row.joiningDate),
      sortable: true,
    },
    {
      name: 'Relieving Date',
      selector: (row) => (row.relievingDate ? formatDate(row.relievingDate) : 'NA'),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <CButton
          color={row.status ? 'success' : 'danger'}
          shape="rounded-pill"
          style={{ color: 'white', width: '67px ' }}
          className="btn btn-sm"
          onClick={() => handleStatusToggle(row.id, row.status)}
        >
          {row.status ? 'Active' : 'Inactive'}
        </CButton>
      ),
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <CIcon
            icon={cilPen}
            onClick={() => handleEdit(row.id)}
            style={{ cursor: 'pointer', color: 'blue' }}
          />

          {/* <CIcon
            className="ms-4"
            icon={cilCash}
            onClick={() => handleSalary(row.id)}
            style={{ cursor: 'pointer', color: 'blue' }}
          /> */}
        </>
      ),
    },
  ]

  /////////// Updating start //////////////////////

  const fetchEmployeeData = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getemployeeDesignation/${id}`)
      setEmployeeToUpdate(response.data.data)
    } catch (error) {
      console.error('Error fetching designation data:', error)
    }
  }

  const handleEdit = (id) => {
    setSelectedEmployeeId(id)
    fetchEmployeeData(id)
    setVisibleUpdate(true)
  }

  const handleUpdate = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    setValidated(true)

    try {
      // Send a PUT request to update the Employee on the server
      await axios.put(`${USER_API_ENDPOINT}updateEmployee/${selectedEmployeeId}`, {
        firstName: employeeToUpdate.firstName,
        midName: employeeToUpdate.midName,
        lastName: employeeToUpdate.lastName,
        email: employeeToUpdate.email,
        password: employeeToUpdate.password,
        contact: employeeToUpdate.contact,
        address: employeeToUpdate.address,
        panCard: employeeToUpdate.panCard,
        adhar: employeeToUpdate.adhar,
        dob: employeeToUpdate.dob,
        joiningDate: employeeToUpdate.joiningDate,
        relievingDate: employeeToUpdate.relievingDate,
        gender: employeeToUpdate.gender,
        designation_id: employeeToUpdate.employeeDesignation.id,
      })

      // Refresh the Employee list after successful update
      const updatedEmployee = await axios.get(`${USER_API_ENDPOINT}getEmployee`)
      setfilterData(updatedEmployee.data.data)

      // Close the modal and reset the state
      setVisibleUpdate(false)
      setValidated(false)
      setEmployeeToUpdate({})
      setUpdateToast(true)
    } catch (error) {
      console.error('Error updating Employee:', error)
    }
  }

  //////////////////////// Updating Status ///////////////////////

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${USER_API_ENDPOINT}changeEmployeeStatus/${id}`)
      console.log(response.data.message)

      // Update the status in the local state (if needed)
      const updatedEmployeeList = employeeList.map((item) => {
        if (item.id === id) {
          return { ...item, status: !currentStatus }
        }
        return item
      })

      setEmployeeList(updatedEmployeeList)
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  //////////////////////// Salary ///////////////////////////////////
  const handleSalary = (id) => {
    setSelectedEmployeeId(id)
    setVisibleSalary(true)
    fetchEmployeeData(id)
    // fetchSalaryDetails(id)
    console.log(id)
  }
  console.log('id:=', selectedEmployeeId)

  const handleAdd = () => {
    setSalaryDetails([...salaryDetails, { year: '', month: '', salary: '' }])
    console.log(salaryDetails)
  }

  const handleClick = async () => {
    try {
      const employeeId = selectedEmployeeId

      const endpoint = `${USER_API_ENDPOINT}addSalary/${employeeId}`

      const response = await axios.post(endpoint, salaryDetails)

      if (response.status === 201) {
        // Handle success, maybe close the modal or update the UI
        setVisibleSalary(false)
      } else {
        // Handle error
        console.error('Failed to add salary details')
      }
    } catch (error) {
      console.error('Error adding salary details:', error)
    }
  }

  const handleChange = (e, i) => {
    const { name, value } = e.target
    const onchangeVal = [...salaryDetails]
    onchangeVal[i][name] = value
    setSalaryDetails(onchangeVal)
  }

  const handleRemove = (i) => {
    const shouldRemove = window.confirm('Are you sure you want to remove this field?')
    if (shouldRemove) {
      const deleteVal = [...salaryDetails]
      deleteVal.splice(i, 1)
      setSalaryDetails(deleteVal)
    }
  }

  useEffect(() => {
    // Fetch salary details for the specified employee ID
    const fetchSalaryDetails = async (selectedEmployeeId) => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}getSalary/${selectedEmployeeId}`)

        setSalaryDetails((prevDetails) => {
          return response.data.salaryDetails && response.data.salaryDetails.length > 0
            ? response.data.salaryDetails
            : [{ year: '', month: '', salary: '' }] // Reset to empty array if no data
        })
      } catch (error) {
        console.error('Error fetching salary details:', error)
      }
    }

    fetchSalaryDetails(selectedEmployeeId)
  }, [selectedEmployeeId, employeeToUpdate])
  console.log('salary:', salaryDetails)
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isPasswordValid = password.length >= 8

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Employee</strong>
          <CButton onClick={() => setVisible(!visible)}>Add</CButton>
          <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Employee Form</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" validated={validated}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    // id="inputFname"
                    label={
                      <span>
                        First Name <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="first name"
                    feedbackInvalid="Please provide First Name."
                    id="inputFirstName"
                    required
                    onChange={(e) => {
                      setFname(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputMname"
                    label="Middle Name"
                    placeholder="middle name"
                    onChange={(e) => {
                      setmiddleName(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputLname"
                    label={
                      <span>
                        Last Name <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="last name"
                    feedbackInvalid="Please provide Last Name."
                    required
                    onChange={(e) => {
                      setLname(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="email"
                    id="inputEmail4"
                    label={
                      <span>
                        Email <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter email"
                    feedbackInvalid={emailError ? emailError : 'Please provide email'}
                    required
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="password"
                    id="inputPassword"
                    label={
                      <span>
                        Password <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter password"
                    feedbackInvalid="Please provide password"
                    required
                    onChange={handlePasswordChange}
                    invalid={isSubmitted && !isPasswordValid}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    id="inputContact"
                    label={
                      <span>
                        Contact <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter contact no."
                    feedbackInvalid="Please provide Contact no.."
                    required
                    onChange={(e) => {
                      setContact(e.target.value)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormTextarea
                    id="inputAddress"
                    label={
                      <span>
                        Address<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter Address"
                    feedbackInvalid="Please provide address."
                    required
                    onChange={(e) => {
                      setAddress(e.target.value)
                    }}
                    rows={2}
                  ></CFormTextarea>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputPancard"
                    label="Pan-Card"
                    placeholder="Enter pan no."
                    onChange={(e) => {
                      setPanCard(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputAadharcard"
                    label="Aadhar Card"
                    placeholder="Enter adhar no."
                    onChange={(e) => {
                      setAdhar(e.target.value)
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select designation"
                    id="validationCustom04"
                    label={
                      <span>
                        Designation <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    required
                    onChange={(e) => {
                      setDesignation(e.target.value)
                    }}
                  >
                    <option>Choose...</option>
                    {designationList.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.designation}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputDob"
                    label={
                      <span>
                        D.O.B <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide D.O.B"
                    required
                    onChange={(e) => {
                      setDob(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputDob"
                    label={
                      <span>
                        Joining Date <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide D.O.B"
                    required
                    onChange={(e) => {
                      setJoiningDate(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputDob"
                    label="Relieving Date"
                    feedbackInvalid="Please provide D.O.B"
                    onChange={(e) => {
                      setRelievingDate(e.target.value)
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <legend className="col-form-label col-sm-2 pt-0">
                    Gender<span style={{ color: 'red' }}>*</span>
                  </legend>
                  <CFormCheck
                    inline
                    defaultChecked
                    checked={gender === 'male'}
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    value="male"
                    label="Male"
                    required
                    onChange={(e) => {
                      setGender(e.target.value)
                    }}
                  />
                  <CFormCheck
                    inline
                    required
                    checked={gender === 'female'}
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    value="female"
                    label="Female"
                    onChange={(e) => {
                      setGender(e.target.value)
                    }}
                  />
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
                Add Employee
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardHeader>
        <CCardBody>
          {/* ..................... Table Start  ..................................... */}

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

          {/* //////////////////////////// Update Model Start /////////////////////////////// */}

          <CModal size="lg" visible={visibleUpdate} onClose={() => setVisibleUpdate(false)}>
            <CModalHeader>
              <CModalTitle>Employee Update Form</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" validated={validated}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    // id="inputFname"
                    label={
                      <span>
                        First Name <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="first name"
                    feedbackInvalid="Please provide First Name."
                    id="inputFirstName"
                    required
                    value={employeeToUpdate.firstName || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        firstName: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputMname"
                    label="Middle Name"
                    placeholder="middle name"
                    value={employeeToUpdate.midName || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        midName: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputLname"
                    label={
                      <span>
                        Last Name <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="last name"
                    feedbackInvalid="Please provide Last Name."
                    required
                    value={employeeToUpdate.lastName || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        lastName: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="email"
                    id="inputEmail4"
                    label={
                      <span>
                        Email <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter email"
                    feedbackInvalid="Please provide Email."
                    required
                    value={employeeToUpdate.email || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        email: e.target.value,
                      })
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputEmail4"
                    label={
                      <span>
                        Password <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter password"
                    feedbackInvalid="Please provide Password."
                    required
                    value={employeeToUpdate.password || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        password: e.target.value,
                      })
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="number"
                    id="inputContact"
                    label={
                      <span>
                        Contact <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter contact no."
                    feedbackInvalid="Please provide Contact no.."
                    required
                    value={employeeToUpdate.contact || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        contact: e.target.value,
                      })
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormTextarea
                    id="inputAddress"
                    label={
                      <span>
                        Address<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    placeholder="Enter Address"
                    feedbackInvalid="Please provide address."
                    required
                    value={employeeToUpdate.address || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        address: e.target.value,
                      })
                    }}
                    rows={2}
                  ></CFormTextarea>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputPancard"
                    label="Pan-Card"
                    placeholder="Enter pan no."
                    value={employeeToUpdate.panCard || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        panCard: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputAadharcard"
                    label="Aadhar Card"
                    placeholder="Enter adhar no."
                    value={employeeToUpdate.adhar || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        adhar: e.target.value,
                      })
                    }}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select designation"
                    id="validationCustom04"
                    label={
                      <span>
                        Designation <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    value={
                      employeeToUpdate.employeeDesignation?.id !== undefined
                        ? employeeToUpdate.employeeDesignation.id
                        : ''
                    }
                    required
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        employeeDesignation: {
                          id: e.target.value,
                        },
                      })
                    }}
                  >
                    <option>Choose...</option>
                    {allDesignationList.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.designation}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputDob"
                    label={
                      <span>
                        D.O.B <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide D.O.B"
                    required
                    value={employeeToUpdate.dob || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        dob: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputjoiningDate"
                    label={
                      <span>
                        Joining Date <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    feedbackInvalid="Please provide Joining Date"
                    required
                    value={employeeToUpdate.joiningDate || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        joiningDate: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    id="inputrelievingDate"
                    label="Relieving Date"
                    // feedbackInvalid="Please provide D.O.B"
                    value={employeeToUpdate.relievingDate || ''}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        relievingDate: e.target.value,
                      })
                    }}
                  />
                </CCol>

                <CCol md={6}>
                  <legend className="col-form-label col-sm-2 pt-0">
                    Gender<span style={{ color: 'red' }}>*</span>
                  </legend>
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox1"
                    label="Male"
                    value="male"
                    checked={employeeToUpdate.gender === 'male'}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        gender: e.target.value,
                      })
                    }}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineCheckbox2"
                    label="Female"
                    value="female"
                    checked={employeeToUpdate.gender === 'female'}
                    onChange={(e) => {
                      setEmployeeToUpdate({
                        ...employeeToUpdate,
                        gender: e.target.value,
                      })
                    }}
                  />
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
                Update Employee
              </CButton>
            </CModalFooter>
          </CModal>

          {/* //////////////////////////// Update Model End  ///////////////////////////////// */}

          {/* /////////////////////////////// Salary Model Start ////////////////////////// */}
          <CModal size="lg" visible={visibleSalary} onClose={() => setVisibleSalary(false)}>
            <CModalHeader>
              <CModalTitle>{`Salary Details - ${employeeToUpdate.firstName} ${employeeToUpdate.lastName}`}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm validated={validated}>
                {salaryDetails.map((val, i) => (
                  <CRow className="g-3 mb-2" key={i}>
                    <CCol md={3}>
                      <CFormInput
                        name="year"
                        value={val.year}
                        type="text"
                        id={`inputYear${i}`}
                        placeholder="Year"
                        onChange={(e) => {
                          handleChange(e, i)
                        }}
                      />
                    </CCol>

                    <CCol md={3}>
                      <CFormSelect
                        aria-describedby={`validationCustom04Feedback${i}`}
                        feedbackInvalid="Please select month"
                        id={`validationCustom04${i}`}
                        name="month"
                        value={val.month}
                        required
                        onChange={(e) => {
                          handleChange(e, i)
                        }}
                      >
                        <option>Month</option>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>Octomber</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>1
                      </CFormSelect>
                    </CCol>

                    <CCol md={3}>
                      <CFormInput
                        type="text"
                        id={`inputSalary${i}`}
                        name="salary"
                        value={val.salary}
                        placeholder="Salary"
                        onChange={(e) => {
                          handleChange(e, i)
                        }}
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
                        disabled={salaryDetails.length === 1}
                      >
                        Remove
                      </CButton>
                    </CCol>
                  </CRow>
                ))}
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setVisibleSalary(false)
                  setValidated(false)
                  setEmployeeToUpdate({})
                }}
              >
                Close
              </CButton>
              <CButton color="primary" onClick={handleClick}>
                Add Salary
              </CButton>
            </CModalFooter>
          </CModal>
          {/* </CCardBody>
      </CCard> */}

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
                    Employee updated successfully...
                  </CToastBody>
                </CToast>
              </CToaster>
            </>
          )}

          {/* /////////////////// Email Toast ////////////////////// */}

          {emailToast && (
            <>
              <CToaster placement="top-center">
                <CToast
                  title="CoreUI for React.js"
                  autohide={false}
                  visible={true}
                  onClose={() => setEmailToast(false)}
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
                    <strong className="me-auto">Warning</strong>
                  </CToastHeader>
                  <CToastBody style={{ color: 'red', textAlign: 'center' }}>
                    Email already exist..
                  </CToastBody>
                </CToast>
              </CToaster>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Employee
