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
  CAvatar,
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

import userImage from './../../../assets/images/avatars/user (3).png'
import sendButton from './../../../assets/images/avatars/pngegg (1).png'
import styles from '../projectPlanning/ProjectPlanning.module.css'
import './TesterLogs.css'
import Swal from 'sweetalert2'


const Tester_Issue_Logs = () => {
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
  const [IssueDetails, setIssueDetails] = useState([]);
  const [visibleXL, setVisibleXL] = useState(false)
  useEffect(() => {
    axios.get(`${USER_API_ENDPOINT}getIssues`).then((res) => {
      setPurchaseOrderList(res.data.data);
      setfilterData(res.data.data);
      
      const data = res.data.data;
      setFilteredReports(data)
      
      // Extract project names and remove duplicates using Set
      const UniqueProjectNames = [...new Set(data.map((activity) => activity.projectActivity.projectPlanning.project_name))];
      const UniqueActivityNames = [...new Set(data.map((activity) => activity.projectActivity.project_modules_activities))];
      setProjectNames(UniqueProjectNames);
      setActivityNames(UniqueActivityNames);
    });
  }, [visible, visibleUpdate]);
  

  let userID

  const data = localStorage.getItem('userLogged')
  const ParsedData = JSON.parse(data)
  userID = ParsedData.id

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
      name: 'Name of Project',
      selector: (row) => row.projectActivity.projectPlanning.project_name,
      sortable: true,
    },

    {
      name: 'Activity Name',
      selector: (row) => row.projectActivity.project_modules_activities,
      sortable: true,
    },
    {
      name: 'Summary',
      selector: (row) => row.Work_Description,
      sortable: true
    },
    {
      name: 'Assignee',
      selector: (row) => row.assignedEmployeeFullName,
      sortable: true,
    },
    {
      name: 'Reporter',
      selector: (row) => `${row.employeeName.firstName} ${row.employeeName.midName} ${row.employeeName.lastName}`,
      sortable: true,
    },
    {
      name: 'Priority',
      selector: (row) => row.Priority ? row.Priority : 'NA',
      sortable: true,
    }

  ]
  const columns2 = [
    {
      name: 'Field',
      selector: row => row.fieldName,
      sortable: false,
      style: { fontWeight: 'bold' }
    },
    {
      name: 'Value',
      selector: row => row.value,
      sortable: false
    }
  ];
  const formattedIssueDetails = IssueDetails && IssueDetails.length > 0 ? [

    { fieldName: 'Project Name', value: IssueDetails[0].projectActivity.projectPlanning.project_name },
    { fieldName: 'Assignee', value: IssueDetails[0].assignedEmployeeFullName },
    { fieldName: 'Reporter', value: `${IssueDetails[0].employeeName.firstName} ${IssueDetails[0].employeeName.midName} ${IssueDetails[0].employeeName.lastName}` },
    { fieldName: 'Issue Summary', value: `${IssueDetails[0].Work_Description}` },
    { fieldName: 'Priority', value: IssueDetails[0].Priority ? IssueDetails[0].Priority : 'NA' },
    { fieldName: 'Status', value: IssueDetails[0].Status },


    // Add more fields as necessary
  ] : [];
  const statusOrder = {
    'Final Approval': 1,
    'Updated By Team Lead': 2,
    'Updated By Manager': 3,
    'Yet To Start': 4,
  }
  const conditionalRowStyles = [
    {
      when: (row) =>
        row.Priority === 'Low',
      style: {
        backgroundColor: '#bdced7',
      },
    },
    {
      when: (row) =>
        row.Priority === 'Normal',
      style: {
        backgroundColor: '#0dcaf0',
      },
    },
    {
      when: (row) =>
        row.Priority === 'High',
      style: {
        backgroundColor: '#d1fe24',
      },
    },
    {
      when: (row) =>
        row.Priority === 'Urgent',
      style: {
        backgroundColor: '#f2b714',
      },
    },
    {
      when: (row) =>
        row.Priority === 'Immediate',
      style: {
        backgroundColor: '#fb1100',
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


  const [selectedStatus, setSelectedStatus] = useState(' ');

  const handleStatusFilter2 = (status) => {
    setSelectedStatus(status);
    setDisable(false);
    const statusFilter = purchaseOrderList.filter((item) => {

      const detailStatus = item.Priority ? item.Priority.trim() : 'Priority Not Set';
      return detailStatus === status;
    });
    setfilterData(statusFilter);
  };

  const [disable, setDisable] = useState(true);

  const handleReset = () => {
    setfilterData(purchaseOrderList)
    setSelectedStatus("Filter By Priority")
    setDisable(true)

  }
  const [IssueDescription, setIssueDescription] = useState('')
  const [imageDetails, setImageDetails] = useState('')
  const [Task_Date, setTaskDate] = useState('');
  const [Task_Time, setTaskTime] = useState('');
  const [Activity_Id, setActivityID] = useState('')
  const [descriptions, setDescriptions] = useState([]);
  const [allComments, setAllComments] = useState([])
  const handleRowClick = async (row) => {
    setVisibleXL(!visibleXL);
    setActivityID(row.activity_ID);

    try {
      // First API call for issue details
      const data = await axios.get(`${USER_API_ENDPOINT}getIssues/${row.activity_ID}`);
      const response = data.data.data;
      setIssueDetails(response);

      console.log("Issue Details:", response);
    } catch (error) {
      setIssueDetails('');
      console.log("Error fetching issue details:", error);
    }

    // In your try block after the API call:
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getIssueDescription/${row.activity_ID}`);
      const responseData = response.data;

      // Check if responseData contains the required fields
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setDescriptions(responseData.data);
        setCurrentIndex(0); // Reset index on new data

        if (responseData.data.length > 0) {
          const firstItem = responseData.data[0];

          // Set the issue description, task date, and time
          setIssueDescription(firstItem.data || 'No description available');
          setTaskDate(firstItem.Task_Date || '');
          setTaskTime(firstItem.Task_Time || '');

          // Ensure imageDetails contains the entire object, not just the imagePath
          setImageDetails(responseData.data);  // Store the entire data object for rendering
        }
      } else {
        setDescriptions([]);
        setIssueDescription('No descriptions available');
        setImageDetails([]); // Ensure imageDetails is set to an empty array if no data
      }
    } catch (error) {
      // Handle error case
      if (error.response && error.response.status === 404) {
        // Specifically handle 404 errors
        setDescriptions([]);
        setIssueDescription('No descriptions available');
        setTaskDate('');
        setTaskTime('');
        setImageDetails([]);
      } else {
        // Handle other errors
        setIssueDescription('');
        setTaskDate('');
        setTaskTime('');
        setImageDetails([]);
      }
      console.error('Error fetching issue descriptions:', error.message);
    }



    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getAllCommentsById/${row.activity_ID}`);
      const data = response.data.data;

      if (data) {
        setAllComments(data); // Set comments if data exists
      } else {
        setAllComments(null); // Use null instead of an empty string
      }
    } catch (error) {
      console.error("Error fetching comments:", error); // Log the error
      setAllComments(null); // Set null in case of error
    }


  };

  const getAllComments = async (id) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}getAllCommentsById/${id}`);
      const data = response.data.data;

      if (data) {
        setAllComments(data); // Set comments if data exists
      } else {
        setAllComments(null); // Use null instead of an empty string
      }
    } catch (error) {
      console.error("Error fetching comments:", error); // Log the error
      setAllComments(null); // Set null in case of error
    }
  }

  const customStyles = {
    rows: {
      style: {
        cursor: 'pointer', // Change the cursor to pointer
      },
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [projectNames, setProjectNames] = useState([]);
  const [ActivityNames, setActivityNames] = useState([])
  const Status = ['In Progress', 'Pending', 'Completed', 'Closed', 'In Review', 'Issue/Bug Found']
  const addSearchField = (field) => {
    if (field) {
      setSearchFields([...searchFields, { field, query: '' }])
    }
  }
  const handleImageClick = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc('');
  };
  const [comment, setComment] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [filteredReportsX, setFilteredReports] = useState([])
  const [lastSelectedFilter, setLastSelectedFilter] = useState('')
  const cleanDescription = (description) => {
    if (typeof description !== 'string') {
      // Handle cases where description is not a string
      console.warn('Description is not a string:', description);
      return 'No Description Available';
    }

    // Remove patterns like [/uploads/upload-...]
    return description.replace(/\[\s*\/uploads\/[^]]+\s*\]/g, '').trim() || 'No Description Available';
  };

  const handleCommentChange = (value) => {

    setComment(value);
    // Enable button only if comment has 2 or more characters
    if (value.length >= 2) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);  // Disable button if less than 2 characters
    }
  };
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
  const handleAddComment = async (Issue_Comments, Activity_Id) => {
    try {
      const data = await axios.post(`${USER_API_ENDPOINT}addComments`, {
        Issue_Comments: Issue_Comments,
        Activity_Id: Activity_Id,
        user_ID: userID,
      });
      console.log(data);
      Swal.fire({
        title: 'Comment Added Successfully',
        icon: 'success'
      })
      getAllComments(Activity_Id)
      setComment('')


    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, descriptions.length - 1));
  };
  const handleDateChange = (event) => {
    const { name, value } = event.target
    setDateRange({ ...dateRange, [name]: value })
    setCurrentPage(1) // Reset to the first page on date change
  }
 
  const currentDescription = descriptions[currentIndex] || {};
  const validAttachmentsCount = Array.isArray(imageDetails)
    ? imageDetails.filter(imageDetail => imageDetail?.imagePath).length
    : 0;

    const handleAllSearchChange = (event) => {
      setAllSearchQuery(event.target.value)
      setCurrentPage(1) // Reset to the first page on search
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
  const [allSearchQuery, setAllSearchQuery] = useState('')
  const [searchFields, setSearchFields] = useState([])

  const handleFieldChange = (index, event) => {
    const values = [...searchFields]
    values[index][event.target.name] = event.target.value
    setSearchFields(values)
    setCurrentPage(1) // Reset to the first page on search
  }

 

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between">
          <strong>Issue Logs</strong>
          <CButton disabled={disable} onClick={handleReset}>Reset</CButton>
        </CCardHeader>
        <CCardBody>
          {/* <div className='filterDiv'>
            <CFormSelect
              value={selectedStatus}
              onChange={(e) => handleStatusFilter2(e.target.value)}
            >
              <option value=" ">Filter By Priority</option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
              <option value="Immediate">Immediate</option>
            </CFormSelect>
          </div> */}
          <header className="header12">
            <div className="filter-container1">
              <div className="blocks1">
                <div>
                  <div className="filter1">
                    <input
                      type="text"
                      value={allSearchQuery}
                      onChange={handleAllSearchChange}
                      placeholder="Search all fields..."
                    />
                  </div>
                  {searchFields.map((field, index) => (
                    <div key={index} className="filter1">
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
                          <div className="filterNew">
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
                <div style={{ marginLeft: '20px', height: '40px' }} className="filter1">
                  <select
                    style={{ height: '40px', padding: '5px', width: '35vw' }}
                    value={lastSelectedFilter} // Set the value to the last selected filter
                    onChange={(e) => addSearchField(e.target.value)}
                  >
                    <option value="">Add Filter</option>
                    <option value="Project">Project Name</option>
                    <option value="Activity">Activity</option>  
                  </select>
                </div>
              </div>
            </div>
          </header>
          <div>
          </div>

          <DataTable
            className="custom-data-table"
            columns={columns}
            data={sortedReports}
            pagination
            fixedHeader
            conditionalRowStyles={conditionalRowStyles}
            responsive
            highlightOnHover
            subHeader
            striped
            style={{ cursor: 'pointer' }}
            noHeader
            subHeaderComponent={
              <>

                <div className="timeDetails">
                  <b className="newBold2">
                    <p
                      className="statusItem11"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Low")}
                    >
                      Low
                    </p>
                    <p
                      className="statusItem21"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Normal")}
                    >
                      Normal
                    </p>
                    <p
                      className="statusItem31"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("High")}
                    >
                      High
                    </p>
                    <p
                      className="statusItem41"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Urgent")}
                    >
                      Urgent
                    </p>
                    <p
                      className="statusItem51"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStatusFilter2("Immediate")}
                    >
                      Immediate
                    </p>
                  </b>
                </div>
              </>
            }
            paginationServer
            paginationTotalRows={filterData.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            onRowClicked={handleRowClick}
            customStyles={customStyles}
          />
        </CCardBody>


      </CCard>

      <CModal
        size="xl"
        visible={visibleXL}
        onClose={() => setVisibleXL(false)}
        aria-labelledby="OptionalSizesExample1"
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample1">Issue Details</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '80vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
          <div className="issue-details-container">
            {IssueDetails && IssueDetails.length > 0 && (
              <h3 className="issue-title">
                {capitalizeFirstLetter(IssueDetails[0].projectActivity.project_modules_activities)}
              </h3>
            )}

            <div className="issue-content">
              <div className="left-pane">
                {/* <section className="description-section card">
                  <h3>Issue Description</h3>
                  {IssueDescription ? (
                    <p>{cleanDescription(IssueDescription)}</p>
                  ) : (
                    <p className="no-description">No Description Available</p>
                  )}
                </section> */}

                <section className="description-section card">
                  <h3 className="section-title">Issue Description</h3>
                  {currentDescription.data ? (
                    <>
                      <div className="description-header">
                        <div className="description-metadata">
                          <p className="description-date"><span className="label">Date:</span> {currentDescription.Task_Date}</p>
                          <p className="description-time"><span className="label">Time:</span> {currentDescription.Task_Time}</p>
                        </div>
                        <p className="description-counter">
                          {currentIndex + 1} <span className="separator">/</span> {descriptions.length}
                        </p>
                      </div>
                      <div className="description-content">
                        <p>{cleanDescription(currentDescription.data)}</p>
                      </div>
                      <div className="navigation-buttons">
                        <button
                          onClick={handlePrevious}
                          disabled={currentIndex === 0}
                          className="nav-button prev"
                        >
                          &larr; Previous
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={currentIndex === descriptions.length - 1}
                          className="nav-button next"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="no-description">No Description Available</p>
                  )}
                </section>


                <section className="description-section2 card">
                  <h3>Attachments ({validAttachmentsCount})</h3>
                  <div className="attachments-container">
                    {validAttachmentsCount > 0 ? (
                      imageDetails.map((imageDetail, index) => {
                        // Debugging: Log the imageDetail object to check its structure
                        console.log("imageDetail:", imageDetail);

                        // Check if imagePath, Task_Date, and Task_Time are valid, otherwise fallback to defaults
                        const imagePath = imageDetail?.imagePath || '';  // Safe check for imagePath
                        const filename = imagePath ? imagePath.split('/').pop() : 'Unknown Filename'; // Extract filename
                        const taskDate = imageDetail?.Task_Date || 'Unknown Date';  // Safe check for Task_Date
                        const taskTime = imageDetail?.Task_Time || 'Unknown Time';  // Safe check for Task_Time

                        // Debugging: Log the extracted values
                        console.log("imagePath:", imagePath, "filename:", filename, "taskDate:", taskDate, "taskTime:", taskTime);

                        return (
                          <div className="attachment-item" key={index}>
                            {imagePath ? (
                              <img
                                src={`http://localhost:8002${imagePath}`}  // Display image only if imagePath is valid
                                alt={`Attachment ${index + 1}`}
                                className="attachment-thumbnail"
                                onClick={() =>
                                  handleImageClick(`http://localhost:8002${imagePath}`)
                                }
                                style={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <p>No Image Available</p>
                            )}

                            <CModal
                              size="lg"
                              aria-labelledby="OptionalSizesExample1"
                              visible={isModalOpen}
                              onClose={closeModal}
                              className="modal"
                            >
                              <div className="modal-content">
                                <span className="close" onClick={closeModal}>
                                  &times;
                                </span>
                                <img
                                  src={modalImageSrc}
                                  alt="Full Attachment"
                                  className="modal-image"
                                />
                              </div>
                            </CModal>

                            {/* Display filename, Task_Date, and Task_Time */}
                            <p className="attachment-filename">{filename}</p>
                            <p className="attachment-timestamp">{taskDate}, {taskTime}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="no-attachments">No Attachments Available</p>
                    )}
                  </div>
                </section>




              </div>

              <div className="right-pane">
                <section className="details-section card">
                  <h3>Details</h3>
                  <DataTable
                    className="custom-data-table"
                    columns={columns2}
                    data={formattedIssueDetails}
                    fixedHeader
                    responsive
                    highlightOnHover
                    striped
                  />
                </section>
              </div>
            </div>
          </div>
          <div className="commentContainer" style={{
            width: '100%',
            padding: '20px',
            backgroundColor: '#f7f9fc',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <section className="details-section card" style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#333',
                marginBottom: '20px',
                borderBottom: '2px solid var(--primary-color)',
                paddingBottom: '10px'
              }}>Comments</h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <CAvatar src={userImage} size="m" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                <CFormInput
                  placeholder="Add a comment"
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    borderRadius: '25px',
                    border: '1px solid #e0e0e0',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  type="text"
                  value={comment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                />
                <button
                  disabled={buttonDisabled}
                  onClick={() => { handleAddComment(comment, Activity_Id) }}
                  style={{
                    cursor: buttonDisabled ? 'not-allowed' : 'pointer',
                    background: 'none',
                    border: 'none',
                    opacity: buttonDisabled ? 0.5 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <img
                    src={sendButton}
                    alt="Send"
                    style={{
                      width: '35px',
                      height: '35px',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </button>
              </div>
              <div style={{
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                width: '100%',
                margin: '10px auto'
              }}>
                {allComments && allComments.length > 0 ? (
                  allComments.map((comment, index) => (
                    <div key={index} style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      padding: '20px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      marginBottom: '20px',
                      transition: 'box-shadow 0.3s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '15px',
                        color: '#333'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#4a90e2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '15px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                          <span style={{ fontSize: '24px', color: '#ffffff', fontWeight: 'bold' }}>
                            {comment.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <b style={{ fontSize: '18px', color: '#333' }}>{comment.employeeName}</b>
                          <br />
                          <small style={{ color: '#888', fontSize: '14px' }}>
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>
                      <p style={{ fontSize: '16px', color: '#444', lineHeight: '1.6' }}>
                        {comment.Issue_Comments}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                    width: '100%',
                    margin: '20px auto',
                    color: '#888'
                  }}>
                    <p style={{ fontSize: '18px', fontStyle: 'italic' }}>No Comments Yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </CModalBody>
      </CModal>

    </div>
  )
}

export default Tester_Issue_Logs
