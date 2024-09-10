import {
  cilCash,
  cilEducation,
  cilPen,
  cilPlus,
  cilUser,
  cilX,
  cilWindowRestore,
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
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from 'src/constants'
import './userAccess.css'
import Swal from 'sweetalert2'

const PurchaseOrder = () => {
  const [data, setData] = useState([])
  const [userDesignation, setUserDesignation] = useState([])
  const [selectedDesignation, setSelectedDesignation] = useState('')
  const [checkedIds, setCheckedIds] = useState(new Set()) // Store checked IDs in a Set
  const [visible, setVisible] = useState(false)
  const [Module_Name, setModuleName] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [isDesignationSelected, setIsDesignationSelected] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [checkedRows, setCheckedRows] = useState([])
  const [toasts, setToasts] = useState([])

  let isChecked
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${USER_API_ENDPOINT}getUserRights`)
      setData(response.data.data)
    }
    const fetchDesignation = async () => {
      try {
        const response = await axios.get(`${USER_API_ENDPOINT}getAllDesignations2`)
        // const filteredData = response.data.data.filter(item => item.Designation !== "CEO");
        const filteredData = response.data.data
        setUserDesignation(filteredData)
      } catch (error) {
        console.error('Error fetching designations', error)
      }
    }

    fetchData()
    fetchDesignation()
  }, [])

  const fetchData = async () => {
    const response = await axios.get(`${USER_API_ENDPOINT}getUserRights`)
    setData(response.data.data)
  }

  const handleSelectAll = () => {
    const uncheckedRows = data.filter((row) => !checkedRows.includes(row.id))
    handleCheckboxChange1(uncheckedRows, true) // Select all unchecked rows
    setIsAllSelected(true) // Update the state to reflect all selected

    // Disable "Select All" and enable "Unselect All"
    setIsSelectAllDisabled(true)
    setIsUnselectAllDisabled(false)
  }

  const handleUnselectAll = () => {
    handleCheckboxChange1(data, false) // Unselect all
    setIsAllSelected(false) // Update the state to reflect none selected

    // Enable "Select All" and disable "Unselect All"
    setIsSelectAllDisabled(false)
    setIsUnselectAllDisabled(true)
  }

  const [isSelectAllDisabled, setIsSelectAllDisabled] = useState(false)
  const [isUnselectAllDisabled, setIsUnselectAllDisabled] = useState(false)

  const handleDesignationChange = async (e) => {
    const designationId = e.target.value
    setSelectedDesignation(designationId)

    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getUserRights/${designationId}`)
      const fetchedData = response.data.data
      setData(fetchedData)

      // Set the designation selected state to true
      setIsDesignationSelected(true)

      // Check if all rows are selected
      const allSelected = fetchedData.every((row) => checkedRows.includes(row.id))
      setIsAllSelected(allSelected)

      // Determine if all rows have Status == 0 or Status == 1
      const allStatusZero = fetchedData.every((row) => row.Status == 0)
      const allStatusOne = fetchedData.every((row) => row.Status == 1)

      // Set button states based on Status
      setIsSelectAllDisabled(allStatusOne) // Disable if all are Status == 1
      setIsUnselectAllDisabled(allStatusZero) // Disable if all are Status == 0
    } catch (error) {
      console.error('Error fetching user rights', error)
      setIsDesignationSelected(false) // Reset the state in case of error
    }
  }

  const handleCheckboxChange = async (id, Module_Name, isChecked) => {
    try {
      const newStatus = isChecked ? '1' : '0'

      // Make the API request to update the server
      await axios.post(`${USER_API_ENDPOINT}changeUserAccess`, {
        Name: Module_Name,
        Assigined_DesignationID: selectedDesignation,
        Status: newStatus,
        rowID: id,
      })

      // Add a new toast to the list
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id: new Date().getTime(), // Unique ID for each toast
          message: 'Access Changed Successfully',
        },
      ])

      // Fetch the updated data from the server
      const response = await axios.get(`${USER_API_ENDPOINT}getUserRights/${selectedDesignation}`)
      const fetchedData = response.data.data

      // Update local state to reflect checkbox change
      setData(fetchedData)

      // Enable both buttons
      setIsSelectAllDisabled(false)
      setIsUnselectAllDisabled(false)

      // Determine if buttons should be disabled based on new status
      const allStatusZero = fetchedData.every((row) => row.Status == 0)
      const allStatusOne = fetchedData.every((row) => row.Status == 1)

      // Update button states based on the new data
      if (allStatusZero) {
        setIsUnselectAllDisabled(true) // Disable "Unselect All" if all are Status == 0
      } else if (allStatusOne) {
        setIsSelectAllDisabled(true) // Disable "Select All" if all are Status == 1
      }
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  const handleCheckboxChange1 = async (rows, isChecked) => {
    try {
      // Convert isChecked to '1' or '0'
      const newStatus = isChecked ? '1' : '0'

      // Prepare the data array to send in the request
      const requestData = rows.map((row) => ({
        Name: row.Module_Name,
        Assigined_DesignationID: selectedDesignation,
        Status: newStatus,
        rowID: row.id,
      }))

      // Make the API request to update the server
      await axios.post(`${USER_API_ENDPOINT}changeUserAccess2`, requestData)

      // Update checked rows locally
      const updatedCheckedRows = isChecked
        ? [...checkedRows, ...rows.map((row) => row.id)]
        : checkedRows.filter((rowId) => !rows.map((row) => row.id).includes(rowId))

      setCheckedRows(updatedCheckedRows)

      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id: new Date().getTime(), // Unique ID for each toast
          message: 'Access Changed Successfully',
        },
      ])

      // Fetch updated data
      const response = await axios.get(`${USER_API_ENDPOINT}getUserRights/${selectedDesignation}`)
      const fetchedData = response.data.data

      // Update local state to reflect checkbox changes
      setData(fetchedData)

      // Check if all rows are selected
      const allSelected = fetchedData.every((row) => checkedRows.includes(row.id))
      setIsAllSelected(allSelected)
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  const CustomHeader = () => <div style={{ paddingLeft: '80px', textAlign: 'left' }}>Sr.No.</div>

  const columns = [
    {
      name: 'Sr.No.',
      selector: (_, index) => index + 1,
      sortable: true,
      cell: (row, index) => <div>{index + 1}</div>,
      // If your library supports header styles
      width: '80px',
    },
    {
      name: 'Name of Module',
      selector: (row) => row.Module_Name,
      sortable: true,
      cell: (row) => <div>{row.Module_Name}</div>,
    },
    {
      name: 'Activate/Deactivate',
      selector: (row) => {
        const isChecked = determineCheckedState(row)

        return (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleCheckboxChange(row.id, row.Module_Name, e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              cursor: isDesignationSelected ? 'pointer' : 'not-allowed',
            }}
            disabled={!isDesignationSelected} // Conditionally disable the checkbox
          />
        )
      },
      sortable: true,
    },
  ]

  const determineCheckedState = (row) => {
    const userAccess = row.userAccess || []
    const isCheckedFromUserAccess =
      userAccess.length === 0 ? userAccess.some((access) => access.Status === 1) : true

    return checkedIds.has(row.id) || isCheckedFromUserAccess
  }

  // const activeDeactivateColumn =

  // const columns = selectedDesignation ? [...baseColumns, activeDeactivateColumn] : baseColumns

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${USER_API_ENDPOINT}addModules`, {
        Module_Name: Module_Name,
      })

      // Assuming response.data contains the message
      Swal.fire({
        title: response.data.message, // Use the message from the response
        icon: 'success',
      })
      fetchData()
      setVisible(false)

      console.log('Module Added Successfully ', response.data)
    } catch (error) {
      // Handle the case where the error response may not have a `data` property
      const errorMessage = error.response?.data?.message || 'An error occurred'

      Swal.fire({
        title: errorMessage,
        icon: 'warning',
      })

      console.error('Error adding module: ', error)
    }
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>User Access Rights</strong>
          <CButton onClick={() => setVisible(!visible)}>Add Module</CButton>
        </CCardHeader>
        <CCardBody>
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            responsive
            highlightOnHover
            subHeader
            striped
            subHeaderComponent={
              <div>
                <div className="designationArea">
                  {/* {isDesignationSelected && (<CButton className='newButton'>Reset</CButton>)} */}
                  <select
                    name="Designation"
                    style={{
                      height: '40px',
                      padding: '5px',
                      width: '25vw',
                      borderRadius: '6px',
                    }}
                    onChange={handleDesignationChange}
                  >
                    <option>Select Designation</option>
                    {userDesignation.map((designationObj, index) => (
                      <option key={index} value={designationObj.Id}>
                        {designationObj.Designation}
                      </option>
                    ))}
                  </select>
                </div>
                {isDesignationSelected && (
                  <div className="selectButton">
                    <CButton onClick={handleSelectAll} disabled={isSelectAllDisabled}>
                      Select All
                    </CButton>
                    <CButton onClick={handleUnselectAll} disabled={isUnselectAllDisabled}>
                      Unselect All
                    </CButton>
                  </div>
                )}
              </div>
            }
          />
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Module</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilWindowRestore} />
              </CInputGroupText>
              <CFormInput
                placeholder="Enter Module Name"
                autoComplete="Module_Name"
                type="text"
                onChange={(e) => {
                  setModuleName(e.target.value)
                }}
                required
              />
            </CInputGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
            }}
          >
            Close
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Add Module
          </CButton>
        </CModalFooter>
      </CModal>

      <>
        <CToaster placement="top-end">
          {toasts.map((toast) => (
            <CToast
              key={toast.id}
              title="CoreUI for React.js"
              autohide={true}
              visible={true}
              dismissible={false}
              delay={2000}
              onClose={() => setToasts(toasts.filter((t) => t.id !== toast.id))}
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
              <CToastBody style={{ color: 'red', textAlign: 'center' }}>{toast.message}</CToastBody>
            </CToast>
          ))}
        </CToaster>
        {/* Other components and JSX here */}
      </>
    </div>
  )
}

export default PurchaseOrder
