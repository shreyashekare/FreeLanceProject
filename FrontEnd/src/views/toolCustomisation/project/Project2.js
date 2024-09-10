<CRow style={{ marginTop: '10px' }}>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      NOT STARTED
                      <span className={styles.circle}>{activityCounts['NOT STARTED']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      {' '}
                      IN PROGRESS
                      <span className={styles.circle}>{activityCounts['IN PROGRESS']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      PENDING
                      <span className={styles.circle}>{activityCounts['PENDING']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      COMPLETED
                      <span className={styles.circle}>{activityCounts['COMPLETED']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>

            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      IN REVIEW
                      <span className={styles.circle}>{activityCounts['IN REVIEW']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      ISSUE/BUG FOUND
                      <span className={styles.circle}>{activityCounts['ISSUE/BUG FOUND']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
            <CCol xs={12} sm={6} md={4} lg={3} className={styles.projectBox}>
              <div className={styles.projectBox}>
                <Card className={styles.projectCards}>
                  <Card.Body className="cardBody">
                    <Card.Title className={styles.projectName}>
                      CLOSED
                      <span className={styles.circle}>{activityCounts['CLOSED']}</span>
                    </Card.Title>
                    <br />
                  </Card.Body>
                </Card>
              </div>
            </CCol>
          </CRow>