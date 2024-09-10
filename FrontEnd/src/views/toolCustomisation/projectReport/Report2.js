<CModal
          fullscreen
          visible={visibleUpdate_projectPlanning}
          onClose={() => setVisibleUpdate_projectPlanning(false)}
        >
          <CModalHeader>
            <CModalTitle>
              Update Project Planning :-
              {purchaseOrder_ToUpdate.purchaseOrder?.clientNameDetails !==
                undefined
                ? purchaseOrder_ToUpdate.purchaseOrder.clientNameDetails
                  .clientName
                : ""}
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
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={purchaseOrder_ToUpdate.project_name || ""}
                  onChange={(e) => {
                    setPurchaseOrder_ToUpdate({
                      ...purchaseOrder_ToUpdate,
                      project_name: e.target.value,
                    });
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
                    const files = event.target.files;
                    const newProjectFiles = Array.from(files);

                    setPurchaseOrder_ToUpdate((prevPurchaseOrder) => ({
                      ...prevPurchaseOrder,
                      project_file: prevPurchaseOrder.project_file
                        ? [
                          ...prevPurchaseOrder.project_file,
                          ...newProjectFiles,
                        ]
                        : newProjectFiles,
                    }));
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
                            handleRemove_updateProject_file(i);
                          }}
                        ></CIcon>
                      </li>
                    ))}
                  </ol>
                )}

                {purchaseOrder_ToUpdate.project_planning_files ? (
                  <ol>
                    {purchaseOrder_ToUpdate.project_planning_files.map(
                      (data, index) => (
                        <li key={index}>
                          <a
                            style={{ width: "106px" }}
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
                      ),
                    )}
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
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  
                  onChange={(e) => {
                    setPurchaseOrder_ToUpdate({
                      ...purchaseOrder_ToUpdate,
                      Status: e.target.value,
                    });
                  }}
                  value={purchaseOrder_ToUpdate.Status || ""}
                  required
                >
                  <option value="">Select a status</option>
                  <option value="Updated By Manager">Updated By Manager</option>
                  <option value="Updated By Team Lead">
                    Updated By Team Lead
                  </option>
                  <option value="Final Approval">Final Approval</option>
                </CFormSelect>
              </CCol>

              <div>
                <h6 className="mb-4">Modules Details</h6>

                <div className={styles.modules_color_box}>
                  <CButton
                    style={{
                      backgroundColor: "floralwhite",
                      border: "1px solid black",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  ></CButton>
                  Modules
                  <CButton
                    style={{
                      backgroundColor: "antiquewhite",
                      border: "1px solid black",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  ></CButton>
                  Tasks
                  <CButton
                    style={{
                      backgroundColor: "aquamarine",
                      border: "1px solid black",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  ></CButton>
                  Sub Tasks
                  <CButton
                    style={{
                      backgroundColor: "rgba(0, 255, 255, 0.22)",
                      border: "1px solid black",
                      height: "20px",
                      marginRight: "5px",
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
                    purchaseOrder_ToUpdate.project_planning_moduleDetails.map(
                      (val, i) => (
                        <>
                          {console.log("data", val)}
                          <tbody id="tbody">
                            <React.Fragment key={i}>
                              {console.log("Iteration:", i, "Value:", val)}
                              <tr>
                                <td colSpan={6}>
                                  <CFormInput
                                    name="modules"
                                    placeholder="Modules"
                                    value={val?.project_modules || ""}
                                    onChange={(e) =>
                                      handleInputChange2(e, i, "project_modules")
                                    }
                                    style={{
                                      width: "590px",
                                      background: "floralwhite",
                                    }}
                                  />
                                </td>

                                <td
                                  colSpan={3}
                                  className="dropdown"
                                  onClick={() => collapseBtn(i)}
                                >
                                  {" "}
                                  <CIcon
                                    icon={
                                      isCollapsed[i]
                                        ? cilChevronCircleDownAlt
                                        : cilChevronTop
                                    }
                                    style={{
                                      position: "relative",
                                      left: "20px",
                                      fontWeight: "bold",
                                      fontSize: "30px",
                                      cursor: "pointer",
                                    }}
                                    className="dropdownC"
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    type="date"
                                    name="planned_startDate"
                                    onChange={(e) =>
                                      handleInputChange2(
                                        e,
                                        i,
                                        "module_planned_startDate",
                                      )
                                    }
                                    value={val?.module_planned_startDate || ""}
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    type="date"
                                    name="planned_endDate"
                                    onChange={(e) =>
                                      handleInputChange2(
                                        e,
                                        i,
                                        "module_planned_endDate",
                                      )
                                    }
                                    value={val?.module_planned_endDate || ""}
                                  />
                                </td>

                                <td>
                                  <CFormInput
                                    style={{ width: "50px" }}
                                    placeholder="Hrs"
                                    name="planned_Hrs"
                                    // onChange={(e) => handleInputChange2(e, i, 'module_planned_Hrs')}
                                    value={
                                      val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details
                                          .length > 0
                                        ? calculateModulePlannedHrs(val)
                                        : ""
                                    }
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    type="date"
                                    value={val?.module_actual_startDate || ""}
                                    onChange={(e) =>
                                      handleInputChange2(
                                        e,
                                        i,
                                        "module_actual_startDate",
                                      )
                                    }
                                    name="actual_startDate"
                                  />
                                </td>
                                <td>
                                  <CFormInput
                                    type="date"
                                    value={val?.module_actual_endDate || ""}
                                    onChange={(e) =>
                                      handleInputChange2(
                                        e,
                                        i,
                                        "module_actual_endDate",
                                      )
                                    }
                                    name="actual_endDate"
                                  />
                                </td>

                                <td>
                                  <CFormInput
                                    style={{ width: "50px" }}
                                    placeholder="Hrs"
                                    name="actual_hrs"
                                    // onChange={(e) => handleInputChange2(e, i, 'module_actual_hrs')}
                                    value={
                                      val.projectPlanning_module_tasks_details &&
                                        val.projectPlanning_module_tasks_details
                                          .length > 0
                                        ? calculateModuleActualHrs(val)
                                        : ""
                                    }
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <CButton onClick={handle_onupdate_Modules}>
                                    +
                                  </CButton>
                                </td>
                                <td>
                                  <CButton
                                    onClick={() => {
                                      handleRemove_Modules(i, val?.id);
                                    }}
                                    style={{
                                      backgroundColor: "red",
                                      border: "none",
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
                                          width: "488px",
                                          background: " antiquewhite",
                                        }}
                                        placeholder="Tasks"
                                        name={`task-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .project_modules_tasks
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "project_modules_tasks",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CButton
                                        onClick={() => {
                                          handleAddTasks_onupdate(i);
                                        }}
                                      >
                                        +
                                      </CButton>
                                    </td>
                                    <td>
                                      <CButton
                                        disabled={
                                          val.projectPlanning_module_tasks_details &&
                                          val
                                            .projectPlanning_module_tasks_details
                                            .length === 1
                                        }
                                        onClick={() => {
                                          handleRemove_Tasks(
                                            i,
                                            0,
                                            val.projectPlanning_module_tasks_details &&
                                              val
                                                .projectPlanning_module_tasks_details
                                                .length > 0
                                              ? val
                                                .projectPlanning_module_tasks_details[0]
                                                .id
                                              : "",
                                          );
                                        }}
                                        style={{
                                          backgroundColor: "red",
                                          border: "none",
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .tasks_planned_startDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_planned_startDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        type="date"
                                        name={`task_planned_endDate-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .tasks_planned_endDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_planned_endDate",
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`task_planned_Hrs-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? calculateTaskPlannedHrs(
                                              val
                                                .projectPlanning_module_tasks_details[0],
                                            )
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_planned_Hrs",
                                          )
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .tasks_actual_startDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_actual_startDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        type="date"
                                        name={`task_actual_endDate-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .tasks_actual_endDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_actual_endDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`task_actual_hrs-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0
                                            ? calculateTaskActualHrs(
                                              val
                                                .projectPlanning_module_tasks_details[0],
                                            )
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            "tasks_actual_hrs",
                                          )
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .project_modules_subTasks
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .project_modules_subTasks
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "project_modules_subTasks",
                                          )
                                        }
                                        style={{ background: " aquamarine" }}
                                      />
                                    </td>
                                    <td>
                                      <CButton
                                        onClick={() => {
                                          handleModule_subtask_onUpdate(i);
                                        }}
                                      >
                                        +
                                      </CButton>
                                    </td>
                                    <td>
                                      <CButton
                                        onClick={() =>
                                          handleRemove_SubTasks(
                                            i,
                                            0,
                                            0,
                                            subtaskId || "",
                                          )
                                        }
                                        style={{
                                          backgroundColor: "red",
                                          border: "none",
                                        }}
                                        disabled={
                                          val.projectPlanning_module_tasks_details &&
                                          val
                                            .projectPlanning_module_tasks_details
                                            .length > 0 &&
                                          val
                                            .projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details &&
                                          val
                                            .projectPlanning_module_tasks_details[0]
                                            .projectPlanning_task_subtasks_details
                                            .length === 1
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_startDate
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_startDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_planned_startDate",
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_endDate
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_planned_endDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_planned_endDate",
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`subTask_planned_Hrs-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0
                                            ? calculateSubTaskPlannedHrs(
                                              val
                                                .projectPlanning_module_tasks_details[0]
                                                .projectPlanning_task_subtasks_details[0],
                                            )
                                            : ""
                                        }
                                        readOnly
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_planned_Hrs",
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_startDate
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_startDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_actual_startDate",
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
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_endDate
                                            ? val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details[0]
                                              .subTasks_actual_endDate
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_actual_endDate",
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`subTask_actual_hrs-${i}`}
                                        value={
                                          val.projectPlanning_module_tasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details
                                              .length > 0 &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details &&
                                            val
                                              .projectPlanning_module_tasks_details[0]
                                              .projectPlanning_task_subtasks_details
                                              .length > 0
                                            ? calculateSubTaskActualHrs(
                                              val
                                                .projectPlanning_module_tasks_details[0]
                                                .projectPlanning_task_subtasks_details[0],
                                            )
                                            : ""
                                        }
                                        readOnly
                                        onChange={(e) =>
                                          handleSubTaskInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            "subTasks_actual_hrs",
                                          )
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
                                        style={{ background: "#00ffff38" }}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.project_modules_activities || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "project_modules_activities",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CButton
                                        onClick={() => {
                                          handleModule_activities_onUpdate(i);
                                        }}
                                      >
                                        +
                                      </CButton>
                                    </td>
                                    <td>
                                      <CButton
                                        style={{
                                          backgroundColor: "red",
                                          border: "none",
                                        }}
                                        onClick={() =>
                                          handleRemove_activities(
                                            i,
                                            0,
                                            0,
                                            0,
                                            val
                                              .projectPlanning_module_tasks_details?.[0]
                                              ?.projectPlanning_task_subtasks_details?.[0]
                                              ?.projectPlanning_subTasks_Activities_details?.[0]
                                              ?.id || "",
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
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_planned_startDate || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_planned_startDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        type="date"
                                        name={`activities_planned_endDate-${i}`}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_planned_endDate || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_planned_endDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`activities_planned_Hrs-${i}`}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_planned_Hrs || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_planned_Hrs",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        type="date"
                                        name={`activities_actual_startDate-${i}`}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_actual_startDate || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_actual_startDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        type="date"
                                        name={`activities_actual_endDate-${i}`}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_actual_endDate || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_actual_endDate",
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <CFormInput
                                        style={{ width: "50px" }}
                                        placeholder="Hrs"
                                        name={`activities_actual_hrs-${i}`}
                                        value={
                                          val
                                            .projectPlanning_module_tasks_details?.[0]
                                            ?.projectPlanning_task_subtasks_details?.[0]
                                            ?.projectPlanning_subTasks_Activities_details?.[0]
                                            ?.activities_actual_hrs || ""
                                        }
                                        onChange={(e) =>
                                          handleActivitiesInputChange2(
                                            e,
                                            i,
                                            0,
                                            0,
                                            0,
                                            "activities_actual_hrs",
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
                                    <React.Fragment
                                      key={`${i}-${activityIndex}`}
                                    >
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
                                                "project_modules_activities",
                                              )
                                            }
                                            value={
                                              activity?.project_modules_activities ||
                                              ""
                                            }
                                            style={{ background: "#00ffff38" }}
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleModule_activities_onUpdate(
                                                i,
                                              );
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
                                            }}
                                            onClick={() => {
                                              handleRemove_activities(
                                                i,
                                                0,
                                                0,
                                                activityIndex + 1,
                                                activity?.id,
                                              );
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
                                                "activities_planned_startDate",
                                              )
                                            }
                                            value={
                                              activity?.activities_planned_startDate ||
                                              ""
                                            }
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
                                                "activities_planned_endDate",
                                              )
                                            }
                                            value={
                                              activity?.activities_planned_endDate ||
                                              ""
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_planned_Hrs-${i}-${activityIndex}`}
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                0,
                                                0,
                                                activityIndex + 1,
                                                "activities_planned_Hrs",
                                              )
                                            }
                                            value={
                                              activity?.activities_planned_Hrs ||
                                              ""
                                            }
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
                                                "activities_actual_startDate",
                                              )
                                            }
                                            value={
                                              activity?.activities_actual_startDate ||
                                              ""
                                            }
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
                                                "activities_actual_endDate",
                                              )
                                            }
                                            value={
                                              activity?.activities_actual_endDate ||
                                              ""
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_actual_Hrs-${i}-${activityIndex}`}
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                0,
                                                0,
                                                activityIndex + 1,
                                                "activities_actual_hrs",
                                              )
                                            }
                                            value={
                                              activity?.activities_actual_hrs ||
                                              ""
                                            }
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
                                                "project_modules_subTasks",
                                              )
                                            }
                                            value={
                                              subtask.project_modules_subTasks
                                            }
                                            style={{
                                              background: " aquamarine",
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleModule_subtask_onUpdate(i);
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
                                            }}
                                            onClick={() => {
                                              handleRemove_SubTasks(
                                                i,
                                                0,
                                                j + 1,
                                                subtask.id,
                                              );
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
                                                "subTasks_planned_startDate",
                                              )
                                            }
                                            value={
                                              subtask.subTasks_planned_startDate
                                            }
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
                                                "subTasks_planned_endDate",
                                              )
                                            }
                                            value={
                                              subtask.subTasks_planned_endDate
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`subTask_planned_Hrs-${i}-${j}`}
                                            value={
                                              subtask.projectPlanning_task_subtasks_details &&
                                                subtask
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? subtask.projectPlanning_task_subtasks_details
                                                  .reduce(
                                                    (sum, subtask) =>
                                                      sum +
                                                      parseFloat(
                                                        subtask.subTask_planned_Hrs ||
                                                        0,
                                                      ),
                                                    0,
                                                  )
                                                  .toString()
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                0,
                                                j + 1,
                                                "subTask_planned_Hrs",
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
                                                "subTasks_actual_startDate",
                                              )
                                            }
                                            value={
                                              subtask.subTasks_actual_startDate
                                            }
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
                                                "subTasks_actual_endDate",
                                              )
                                            }
                                            value={
                                              subtask.subTasks_actual_endDate
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`subTask_actual_hrs-${i}-${j}`}
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                0,
                                                j + 1,
                                                "subTasks_actual_hrs",
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
                                                "project_modules_activities",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
                                                ?.project_modules_activities
                                            }
                                            style={{ background: "#00ffff38" }}
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleModule_activities_for_subindex_onUpdate(
                                                i,
                                                j,
                                              );
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
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
                                              );
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
                                                "activities_planned_startDate",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
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
                                                "activities_planned_endDate",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
                                                ?.activities_planned_endDate
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_planned_Hrs-${i}-${j}`}
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                0,
                                                j + 1,
                                                0,
                                                "activities_planned_Hrs",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
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
                                                "activities_actual_startDate",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
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
                                                "activities_actual_endDate",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
                                                ?.activities_actual_endDate
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_actual_hrs-${i}-${j}`}
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                0,
                                                j + 1,
                                                0,
                                                "activities_actual_hrs",
                                              )
                                            }
                                            value={
                                              subtask
                                                .projectPlanning_subTasks_Activities_details?.[0]
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
                                          <React.Fragment
                                            key={`${i}-${j}-${aindex}`}
                                          >
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
                                                      "project_modules_activities",
                                                    )
                                                  }
                                                  value={
                                                    activie.project_modules_activities
                                                  }
                                                  style={{
                                                    background: "#00ffff38",
                                                  }}
                                                />
                                              </td>
                                              <td>
                                                <CButton
                                                  onClick={() => {
                                                    handleModule_activities_for_subindex_onUpdate(
                                                      i,
                                                      j,
                                                    );
                                                  }}
                                                >
                                                  +
                                                </CButton>
                                              </td>
                                              <td>
                                                <CButton
                                                  style={{
                                                    backgroundColor: "red",
                                                    border: "none",
                                                  }}
                                                  onClick={() => {
                                                    handleRemove_activities(
                                                      i,
                                                      0,
                                                      j + 1,
                                                      aindex + 1,
                                                      activie.id,
                                                    );
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
                                                      "activities_planned_startDate",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_planned_startDate
                                                  }
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
                                                      "activities_planned_endDate",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_planned_endDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: "50px" }}
                                                  placeholder="Hrs"
                                                  name={`activities_planned_Hrs-${i}-${j}-${aindex}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange2(
                                                      e,
                                                      i,
                                                      0,
                                                      j + 1,
                                                      aindex + 1,
                                                      "activities_planned_Hrs",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_planned_Hrs
                                                  }
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
                                                      "activities_actual_startDate",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_actual_startDate
                                                  }
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
                                                      "activities_actual_endDate",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_actual_endDate
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: "50px" }}
                                                  placeholder="Hrs"
                                                  name={`activities_actual_hrs-${i}-${j}-${aindex}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange2(
                                                      e,
                                                      i,
                                                      0,
                                                      j + 1,
                                                      aindex + 1,
                                                      "activities_actual_hrs",
                                                    )
                                                  }
                                                  value={
                                                    activie.activities_actual_hrs
                                                  }
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
                                      {console.log("tasks", task)}
                                      <tr>
                                        <td></td>
                                        <td colSpan={6}>
                                          <CFormInput
                                            style={{
                                              width: "488px",
                                              background: " antiquewhite",
                                            }}
                                            placeholder="Tasks"
                                            name={`task-${i}-${taskindex}`}
                                            value={task.project_modules_tasks}
                                            onChange={(e) =>
                                              handleTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                "project_modules_tasks",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleAddTasks_onupdate(i);
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
                                            }}
                                            onClick={() => {
                                              handleRemove_Tasks(
                                                i,
                                                taskindex + 1,
                                                task.id,
                                              );
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
                                                "tasks_planned_startDate",
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
                                                "tasks_planned_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`task_planned_Hrs-${i}-${taskindex}`}
                                            value={task.tasks_planned_Hrs}
                                            onChange={(e) =>
                                              handleTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                "tasks_planned_Hrs",
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
                                                "tasks_actual_startDate",
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
                                                "tasks_actual_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`task_actual_hrs-${i}-${taskindex}`}
                                            value={task.tasks_actual_hrs}
                                            onChange={(e) =>
                                              handleTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                "tasks_actual_hrs",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .project_modules_subTasks
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "project_modules_subTasks",
                                              )
                                            }
                                            style={{
                                              background: " aquamarine",
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleAddSubTasks_onUpdate(
                                                i,
                                                taskindex,
                                              );
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
                                            }}
                                            onClick={() => {
                                              handleRemove_SubTasks(
                                                i,
                                                taskindex + 1,
                                                0,
                                                task.projectPlanning_task_subtasks_details &&
                                                  task
                                                    .projectPlanning_task_subtasks_details
                                                    .length > 0
                                                  ? task
                                                    .projectPlanning_task_subtasks_details[0]
                                                    .id
                                                  : "",
                                              );
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_startDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_planned_startDate",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_endDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_planned_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`subTask_planned_Hrs-${i}-${taskindex}`}
                                            value={
                                              task.projectPlanning_task_subtasks_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_planned_Hrs
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_planned_Hrs",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_startDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_actual_startDate",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_endDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_actual_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`subTask_actual_hrs-${i}-${taskindex}`}
                                            value={
                                              task.projectPlanning_task_subtasks_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .subTasks_actual_hrs
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleSubTaskInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                "subTasks_actual_hrs",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .project_modules_activities
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "project_modules_activities",
                                              )
                                            }
                                            style={{ background: "#00ffff38" }}
                                          />
                                        </td>
                                        <td>
                                          <CButton
                                            onClick={() => {
                                              handleAdd_activities_forSubTask1_onUpdate(
                                                i,
                                                taskindex + 1,
                                                0,
                                              );
                                            }}
                                          >
                                            +
                                          </CButton>
                                        </td>
                                        <td>
                                          <CButton
                                            style={{
                                              backgroundColor: "red",
                                              border: "none",
                                            }}
                                            onClick={() => {
                                              handleRemove_activities(
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                task.projectPlanning_task_subtasks_details &&
                                                  task
                                                    .projectPlanning_task_subtasks_details
                                                    .length > 0 &&
                                                  task
                                                    .projectPlanning_task_subtasks_details[0]
                                                    .projectPlanning_subTasks_Activities_details &&
                                                  task
                                                    .projectPlanning_task_subtasks_details[0]
                                                    .projectPlanning_subTasks_Activities_details
                                                    .length > 0
                                                  ? task
                                                    .projectPlanning_task_subtasks_details[0]
                                                    .projectPlanning_subTasks_Activities_details[0]
                                                    .id
                                                  : "",
                                              );
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_startDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_planned_startDate",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_endDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_planned_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_planned_Hrs-${i}-${taskindex}`}
                                            value={
                                              task.projectPlanning_task_subtasks_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_planned_Hrs
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_planned_Hrs",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_startDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_actual_startDate",
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
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_endDate
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_actual_endDate",
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <CFormInput
                                            style={{ width: "50px" }}
                                            placeholder="Hrs"
                                            name={`activities_actual_hrs-${i}-${taskindex}`}
                                            value={
                                              task.projectPlanning_task_subtasks_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details
                                                  .length > 0 &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details &&
                                                task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details
                                                  .length > 0
                                                ? task
                                                  .projectPlanning_task_subtasks_details[0]
                                                  .projectPlanning_subTasks_Activities_details[0]
                                                  .activities_actual_hrs
                                                : ""
                                            }
                                            onChange={(e) =>
                                              handleActivitiesInputChange2(
                                                e,
                                                i,
                                                taskindex + 1,
                                                0,
                                                0,
                                                "activities_actual_hrs",
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
                                          <React.Fragment
                                            key={`${i}-${taskindex}-${asi}`}
                                          >
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
                                                      "project_modules_activities",
                                                    )
                                                  }
                                                  value={
                                                    activity?.project_modules_activities ||
                                                    ""
                                                  }
                                                  style={{
                                                    background: "#00ffff38",
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
                                                    );
                                                  }}
                                                >
                                                  +
                                                </CButton>
                                              </td>
                                              <td>
                                                <CButton
                                                  style={{
                                                    backgroundColor: "red",
                                                    border: "none",
                                                  }}
                                                  onClick={() => {
                                                    handleRemove_activities(
                                                      i,
                                                      taskindex + 1,
                                                      0,
                                                      asi + 1,
                                                      activity?.id,
                                                    );
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
                                                      "activities_planned_startDate",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_planned_startDate ||
                                                    ""
                                                  }
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
                                                      "activities_planned_endDate",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_planned_endDate ||
                                                    ""
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: "50px" }}
                                                  placeholder="Hrs"
                                                  name={`activities_planned_Hrs-${i}-${taskindex}-${asi}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange2(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      0,
                                                      asi + 1,
                                                      "activities_planned_Hrs",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_planned_Hrs ||
                                                    ""
                                                  }
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
                                                      "activities_actual_startDate",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_actual_startDate ||
                                                    ""
                                                  }
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
                                                      "activities_actual_endDate",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_actual_endDate ||
                                                    ""
                                                  }
                                                />
                                              </td>
                                              <td>
                                                <CFormInput
                                                  style={{ width: "50px" }}
                                                  placeholder="Hrs"
                                                  name={`activities_actual_hrs-${i}-${taskindex}-${asi}`}
                                                  onChange={(e) =>
                                                    handleActivitiesInputChange2(
                                                      e,
                                                      i,
                                                      taskindex + 1,
                                                      0,
                                                      asi + 1,
                                                      "activities_actual_hrs",
                                                    )
                                                  }
                                                  value={
                                                    activity?.activities_actual_hrs ||
                                                    ""
                                                  }
                                                />
                                              </td>
                                              <td></td>
                                              <td></td>
                                            </tr>
                                          </React.Fragment>
                                        ))}

                                      {/* ///////////////////////////////////////////// for task +1 subtask  //////////////////////////////////////////////// */}
                                      {val.projectPlanning_module_tasks_details[
                                        taskindex + 1
                                      ].projectPlanning_task_subtasks_details &&
                                        val
                                          .projectPlanning_module_tasks_details[
                                          taskindex + 1
                                        ].projectPlanning_task_subtasks_details
                                          .length > 1 &&
                                        val.projectPlanning_module_tasks_details[
                                          taskindex + 1
                                        ].projectPlanning_task_subtasks_details
                                          .slice(1)
                                          .map((subTask, s) => (
                                            <React.Fragment
                                              key={`${i}-${taskindex}-${s}`}
                                            >
                                              {console.log("subtask", subTask)}
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
                                                        "project_modules_subTasks",
                                                      )
                                                    }
                                                    value={
                                                      subTask.project_modules_subTasks
                                                    }
                                                    style={{
                                                      background: " aquamarine",
                                                    }}
                                                  />
                                                </td>
                                                <td>
                                                  <CButton
                                                    onClick={() => {
                                                      handleAddSubTasks_onUpdate(
                                                        i,
                                                        taskindex,
                                                      );
                                                    }}
                                                  >
                                                    +
                                                  </CButton>
                                                </td>
                                                <td>
                                                  <CButton
                                                    style={{
                                                      backgroundColor: "red",
                                                      border: "none",
                                                    }}
                                                    onClick={() => {
                                                      handleRemove_SubTasks(
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        subTask.id,
                                                      );
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
                                                        "subTasks_planned_startDate",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_planned_startDate
                                                    }
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
                                                        "subTasks_planned_endDate",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_planned_endDate
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <CFormInput
                                                    style={{ width: "50px" }}
                                                    placeholder="Hrs"
                                                    name={`subTask_planned_Hrs-${i}-${taskindex}-${s}`}
                                                    onChange={(e) =>
                                                      handleSubTaskInputChange2(
                                                        e,
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        "subTasks_planned_Hrs",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_planned_Hrs
                                                    }
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
                                                        "subTasks_actual_startDate",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_actual_startDate
                                                    }
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
                                                        "subTasks_actual_endDate",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_actual_endDate
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <CFormInput
                                                    style={{ width: "50px" }}
                                                    placeholder="Hrs"
                                                    name={`subTask_actual_hrs-${i}-${taskindex}-${s}`}
                                                    onChange={(e) =>
                                                      handleSubTaskInputChange2(
                                                        e,
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        "subTasks_actual_hrs",
                                                      )
                                                    }
                                                    value={
                                                      subTask.subTasks_actual_hrs
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
                                                    name={`activities-${i}-${taskindex}-${s}`}
                                                    onChange={(e) =>
                                                      handleActivitiesInputChange2(
                                                        e,
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        0,
                                                        "project_modules_activities",
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
                                                      background: "#00ffff38",
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
                                                      );
                                                    }}
                                                  >
                                                    +
                                                  </CButton>
                                                </td>
                                                <td>
                                                  <CButton
                                                    style={{
                                                      backgroundColor: "red",
                                                      border: "none",
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
                                                      );
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
                                                        "activities_planned_startDate",
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
                                                        "activities_planned_endDate",
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
                                                    style={{ width: "50px" }}
                                                    placeholder="Hrs"
                                                    name={`activities_planned_Hrs-${i}-${taskindex}-${s}`}
                                                    onChange={(e) =>
                                                      handleActivitiesInputChange2(
                                                        e,
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        0,
                                                        "activities_planned_Hrs",
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
                                                        "activities_actual_startDate",
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
                                                        "activities_actual_endDate",
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
                                                    style={{ width: "50px" }}
                                                    placeholder="Hrs"
                                                    name={`activities_actual_Hrs-${i}-${taskindex}-${s}`}
                                                    onChange={(e) =>
                                                      handleActivitiesInputChange2(
                                                        e,
                                                        i,
                                                        taskindex + 1,
                                                        s + 1,
                                                        0,
                                                        "activities_actual_hrs",
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
                                                  <tr
                                                    key={`${i}-${taskindex}-${s}-${ai}`}
                                                  >
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
                                                            "project_modules_activities",
                                                          )
                                                        }
                                                        value={
                                                          activity.project_modules_activities
                                                        }
                                                        style={{
                                                          background:
                                                            "#00ffff38",
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
                                                          );
                                                        }}
                                                      >
                                                        +
                                                      </CButton>
                                                    </td>
                                                    <td>
                                                      <CButton
                                                        style={{
                                                          backgroundColor:
                                                            "red",
                                                          border: "none",
                                                        }}
                                                        onClick={() => {
                                                          handleRemove_activities(
                                                            i,
                                                            taskindex + 1,
                                                            s + 1,
                                                            ai + 1,
                                                            activity.id,
                                                          ); // Assuming you want to remove the first activity
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
                                                            "activities_planned_startDate",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_planned_startDate
                                                        }
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
                                                            "activities_planned_endDate",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_planned_endDate
                                                        }
                                                      />
                                                    </td>
                                                    <td>
                                                      <CFormInput
                                                        style={{
                                                          width: "50px",
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
                                                            "activities_planned_Hrs",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_planned_Hrs
                                                        }
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
                                                            "activities_actual_startDate",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_actual_startDate
                                                        }
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
                                                            "activities_actual_endDate",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_actual_endDate
                                                        }
                                                      />
                                                    </td>
                                                    <td>
                                                      <CFormInput
                                                        style={{
                                                          width: "50px",
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
                                                            "activities_actual_hrs",
                                                          )
                                                        }
                                                        value={
                                                          activity.activities_actual_hrs
                                                        }
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
                      ),
                    )
                  ) : (
                    <p>No purchase order details available.</p>
                  )}
                </table>
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setVisibleUpdate_projectPlanning(false)}
            >
              Close
            </CButton>
            <CButton color="primary" onClick={handleUpdate}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>