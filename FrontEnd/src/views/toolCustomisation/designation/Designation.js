/* eslint-disable react/react-in-jsx-scope */
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CCol,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTooltip,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormFeedback,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilLockLocked, cilUser, cilEducation, cilPen } from '@coreui/icons'
import { useEffect, useState } from 'react'
import { DocsLink } from 'src/components'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { USER_API_ENDPOINT } from '../../../constants/index'

const Designation = () => {
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [designation, setDesignation] = useState('')
  const [validated, setValidated] = useState(false)
  const [designationList, setDesignationList] = useState([])
  const [designationError, setDesignationError] = useState('')

  const [selectedDesignationId, setSelectedDesignationId] = useState('')
  const [designationToUpdate, setDesignationToUpdate] = useState({})
  const [search, setSearch] = useState('')
  const [filterData, setfilterData] = useState([])
  const [toast, setToast] = useState(false)
  const [updateToast, setUpdateToast] = useState(false)
  const [updateExistToast, setUpdateExistToast] = useState(false)

  // let userDesignation;

  // const data = localStorage.getItem("userLogged");
  // const ParsedData = JSON.parse(data);
  // userDesignation = ParsedData.designation_id;

  // if(userDesignation!=1)
  // {
  //   // nav('/toolCustomisation/project');
  //   window.location.href = window.location.origin + '/#/toolCustomisation/project'
  // }
  /////// date formate ////
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
  }

  ///////////////////// data Table /////////////////////

  const columns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: (row) => row.designation,
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
      name: 'Created At',
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      name: 'Updated At',
      selector: (row) => formatDate(row.updatedAt),
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <CIcon
          icon={cilPen}
          onClick={() => handleEdit(row.id)}
          style={{ cursor: 'pointer', color: 'blue' }}
        />
      ),
    },
  ]

  //////////////// data Table end /////////////////////

  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getDesignation`).then((res) => {
      console.log(res.data.data)
      setDesignationList(res.data.data)
      setfilterData(res.data.data)
    })
  }, [designation, visibleEdit])

  useEffect(() => {
    const filterDesignation = designationList.filter((desgn) => {
      return desgn.designation.toLowerCase().match(search.toLowerCase())
    })
    setfilterData(filterDesignation)
  }, [search, designationList])

  //////////////// add designation ////////////////

  const handleSubmit = async () => {
    console.log('Submitting designation:', designation)
    setValidated(true)
    const trimmedDesignation = designation.trim()

    if (!trimmedDesignation) {
      setDesignationError('Please enter designation')
      return
    }

    try {
      // Send a POST request to add a new designation
      const response = await axios.post(`${USER_API_ENDPOINT}addDesignation`, {
        designation: trimmedDesignation,
        status: true, // You can set the status as needed
      })

      console.log('Data saved:', response.data)
      setDesignation('')
      setVisible(false)
      setValidated(false)
    } catch (error) {
      console.log('Error saving designation:', error)

      if (error.response.data.message == 'Designation already exists') {
        setToast(true)

        console.log('designationError', designationError)
      } else {
        console.error('Error saving designation')
      }

      setValidated(false)
    }
  }

  //////// editing/////////

  const fetchDesignationData = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getDesignation/${id}`)
      setDesignationToUpdate(response.data.data)
    } catch (error) {
      console.error('Error fetching designation data:', error)
    }
  }

  const handleEdit = (id) => {
    setSelectedDesignationId(id)
    setVisibleEdit(true)
    fetchDesignationData(id) // Fetch data when the edit modal is opened
    console.log(id)
  }

  const handleUpdate = async () => {
    setValidated(true)

    if (!designationToUpdate.designation) {
      setDesignationError('Please enter designation')
      return
    }

    try {
      // Send a PUT request to update the designation on the server
      await axios.put(`${USER_API_ENDPOINT}updateDesignation/${selectedDesignationId}`, {
        designation: designationToUpdate.designation,
        status: designationToUpdate.status,
      })

      // Refresh the designation list after successful update
      const updatedDesignations = await axios.get(`${USER_API_ENDPOINT}getDesignation`)
      setDesignationList(updatedDesignations.data.data)

      // Close the modal and reset the state
      setVisibleEdit(false)
      setValidated(false)
      setDesignationToUpdate({})
      setUpdateToast(true)
    } catch (error) {
      console.error('Error updating designation:', error)

      if (error.response.data.message == 'Designation with the updated name already exists') {
        // alert('data already exist')
        setUpdateExistToast(true)
      }
    }
  }

  //////////////////////// Updating Status ///////////////////////

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const response = await axios.put(`${USER_API_ENDPOINT}toggleStatus/${id}`)
      console.log(response.data.message)

      // Update the status in the local state (if needed)
      const updatedDesignationList = designationList.map((item) => {
        if (item.id === id) {
          return { ...item, status: !currentStatus }
        }
        return item
      })

      setDesignationList(updatedDesignationList)
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Designation</strong>
          {/* <DocsLink href="https://coreui.io/docs/content/typography/" /> */}
          <CButton onClick={() => setVisible(!visible)}>Add</CButton>
          <CModal visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Add Designation</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm noValidate validated={validated}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilEducation} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Enter Designation"
                    autoComplete="designation"
                    type="text"
                    onChange={(e) => {
                      setDesignation(e.target.value)
                    }}
                    required
                    isInvalid={designationError !== ''}
                  />
                  <CFormFeedback invalid>{designationError}</CFormFeedback>
                </CInputGroup>
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
                Add designation
              </CButton>
            </CModalFooter>
          </CModal>
        </CCardHeader>

        {/* card body Start */}
        <CCardBody>
          <DataTable
            columns={columns}
            data={filterData.reverse()}
            pagination
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
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
            }
          />

          <CModal visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
            <CModalHeader>
              <CModalTitle>{selectedDesignationId ? 'Update' : 'Add'} Designation</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm noValidate validated={validated}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilEducation} />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Enter Designation"
                    autoComplete="updatedesignation"
                    type="text"
                    required
                    isInvalid={designationError !== ''}
                    value={designationToUpdate.designation || ''}
                    onChange={(e) =>
                      setDesignationToUpdate({
                        ...designationToUpdate,
                        designation: e.target.value,
                      })
                    }
                  />
                  <CFormFeedback invalid>{designationError}</CFormFeedback>
                </CInputGroup>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setVisibleEdit(false)
                  setValidated(false)
                  setDesignationToUpdate({})
                  console.log(designationToUpdate)
                }}
              >
                Close
              </CButton>
              <CButton
                color="primary"
                onClick={selectedDesignationId ? handleUpdate : handleSubmit}
              >
                {selectedDesignationId ? 'Update' : 'Add'} Designation
              </CButton>
            </CModalFooter>
          </CModal>
          {/* </CTable> */}
        </CCardBody>
      </CCard>
      {toast && (
        <>
          <CToaster placement="top-end">
            <CToast
              title="CoreUI for React.js"
              autohide={false}
              visible={true}
              onClose={() => setToast(false)}
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
                Designation already exist
              </CToastBody>
            </CToast>
          </CToaster>
        </>
      )}
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
                Designation updated successfully...
              </CToastBody>
            </CToast>
          </CToaster>
        </>
      )}

      {/* ///////////////Update alredy Exist Toaster////////// */}

      {updateExistToast && (
        <>
          <CToaster placement="top-end">
            <CToast
              title="CoreUI for React.js"
              autohide={false}
              visible={true}
              onClose={() => setUpdateExistToast(false)}
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
                Designation alreay exist...
              </CToastBody>
            </CToast>
          </CToaster>
        </>
      )}
    </>
  )
}
export default Designation
