import React from "react";
import {
  AccountsQuery,
  Grid,
  GridItem,
  Spinner,
  AreaChart,
  HeadingText,
  Tooltip,
  Link,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardSection,
  CardSectionBody,
} from "nr1";
import { CSVLink } from "react-csv";
import AccountsNRQL from "./components/AccountsNRQL";
import MetricNRQL from "./components/MetricNRQL";

const GhostNerdlet = (props) => {
  return (
    <AccountsQuery>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Grid>
              <GridItem columnStart={2} columnEnd={12}>
                <Spinner inline /> Loading account list...
              </GridItem>
            </Grid>
          );
        }

        if (error) {
          return (
            <Grid>
              {" "}
              <GridItem columnStart={2} columnEnd={12}>
                Error loading accounts!
              </GridItem>
            </Grid>
          );
        }
        console.log({ data });
        const accountList = data.map((account, id) => {
          return { id: account.id, name: account.name };
        });
        console.log({ accountList });
        return (
          <AccountsNRQL
            accountList={accountList}
            nrql="SHOW EVENT TYPES SINCE 1 WEEK AGO"
            shardSize={10}
          >
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <Grid>
                    <GridItem columnStart={2} columnEnd={12}>
                      <HeadingText type={[HeadingText.TYPE.HEADING_1]}>
                        <Spinner inline /> Loading query for data for{" "}
                        {accountList.length} accounts...
                      </HeadingText>
                    </GridItem>
                  </Grid>
                );
              if (error) {
                console.log(error);
                return (
                  <Grid>
                    <GridItem columnSpan={12}>
                      Error loading data, check the console.
                    </GridItem>
                  </Grid>
                );
              }
              if (data) {
                if (data && data.length > 0) {
                  // console.log({ data });
                  const noReportingEvents = data.filter(
                    (res) => res.eventTypes.length < 4
                  );
                  console.log({ noReportingEvents });
                  const metricsIncluded = noReportingEvents.filter((datum) =>
                    datum.eventTypes.includes("Metric")
                  );
                  const everythingElse = noReportingEvents.filter(
                    (datum) => !datum.eventTypes.includes("Metric")
                  );
                  console.log({ metricsIncluded, everythingElse });
                  // return (<div>Hello</div>)
                  return (
                    <MetricNRQL
                      accountList={metricsIncluded}
                      nrql="SELECT * FROM Metric SINCE 1 week ago WHERE dataType != 'NRDB Query'"
                      shardSize={10}
                    >
                      {({ loading, error, data }) => {
                        if (loading)
                          return (
                            <Grid>
                              <GridItem columnStart={2} columnEnd={12}>
                                <HeadingText
                                  type={[HeadingText.TYPE.HEADING_1]}
                                >
                                  <Spinner inline /> Loading query for data for{" "}
                                  {accountList.length} accounts...
                                </HeadingText>
                              </GridItem>
                            </Grid>
                          );
                        if (error) {
                          console.log(error);
                          return (
                            <Grid>
                              <GridItem columnSpan={12}>
                                Error loading data, check the console.
                              </GridItem>
                            </Grid>
                          );
                        }
                        if (data) {
                          if (data && data.length > 0) {
                            console.log({ data });
                            const finalData = data.filter(
                              (datum) =>
                                datum.relevantMetrics.length === 0 &&
                                datum.relevantMetrics.every((dat) =>
                                  [
                                    "Metric",
                                    "NRDBQuery",
                                    "Public_APICall",
                                  ].includes(dat)
                                )
                            );
                            console.log({ finalData });
                            const allData = [...everythingElse, ...finalData];
                            const csvData = allData.map((datum) => {
                              return {
                                accountId: datum.id,
                                accountName: datum.name,
                              };
                            });
                            return (
                              <Grid style={{ padding: "15px" }}>
                                <GridItem columnSpan={12}>
                                  <Card>
                                    <CardHeader>
                                      <HeadingText
                                        type={[HeadingText.TYPE.HEADING_1]}
                                      >
                                        Ghost Accounts
                                      </HeadingText>
                                    </CardHeader>
                                    <CardBody>
                                      The following is a list of accounts that
                                      have not reported Events or Metrics over
                                      the last month.
                                      <CardSection>
                                        <CardSectionBody>
                                          <CSVLink
                                            filename="GhostAccounts.csv"
                                            data={csvData}
                                          >
                                            Download data as CSV
                                          </CSVLink>
                                        </CardSectionBody>
                                      </CardSection>
                                    </CardBody>
                                  </Card>
                                  {/* <div className="totalRows">
                                    <strong>Total rows:</strong> {data.length}
                                  </div>
                                  <div className="resultFields">
                                    <strong>Result fields:</strong> {fields}
                                  </div> */}
                                  <>
                                    <Grid style={{ padding: "15px" }}>
                                      <GridItem
                                        columnSpan={2}
                                        style={{ padding: "15px" }}
                                      >
                                        <HeadingText
                                          type={[HeadingText.TYPE.HEADING_5]}
                                        >
                                          Account Name
                                        </HeadingText>
                                      </GridItem>
                                      <GridItem
                                        columnSpan={2}
                                        style={{ padding: "15px" }}
                                      >
                                        <HeadingText
                                          type={[HeadingText.TYPE.HEADING_5]}
                                        >
                                          Account ID
                                        </HeadingText>
                                      </GridItem>
                                      <GridItem
                                        columnSpan={2}
                                        style={{ padding: "15px" }}
                                      >
                                        <HeadingText
                                          type={[HeadingText.TYPE.HEADING_5]}
                                        >
                                          Reporting Metrics{" "}
                                          <Tooltip text="Public_API is ignored, as are Metrics related to Queries and NrdbQuery Events">
                                            <Icon
                                              type={
                                                Icon.TYPE
                                                  .INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE
                                              }
                                            />
                                          </Tooltip>
                                        </HeadingText>
                                      </GridItem>
                                      <GridItem
                                        columnSpan={6}
                                        style={{ padding: "15px" }}
                                      >
                                        <HeadingText
                                          type={[HeadingText.TYPE.HEADING_5]}
                                        >
                                          Metrics over the last 6 months
                                        </HeadingText>
                                      </GridItem>
                                    </Grid>
                                    {allData.map((datum) => {
                                      return (
                                        <Grid
                                          style={{
                                            boxShadow: "0px -3px 7px 0px",
                                          }}
                                        >
                                          <GridItem
                                            columnSpan={2}
                                            style={{ padding: "15px" }}
                                          >
                                            <HeadingText
                                              type={[
                                                HeadingText.TYPE.HEADING_3,
                                              ]}
                                              spacingType={[
                                                HeadingText.SPACING_TYPE
                                                  .EXTRA_LARGE,
                                              ]}
                                            >
                                              <Link
                                                to={`https://one.newrelic.com/usage-and-cost?account=${datum.id}`}
                                              >
                                                {datum.name}
                                              </Link>
                                            </HeadingText>
                                          </GridItem>
                                          <GridItem
                                            columnSpan={2}
                                            style={{ padding: "15px" }}
                                          >
                                            <HeadingText
                                              type={[
                                                HeadingText.TYPE.HEADING_3,
                                              ]}
                                              spacingType={[
                                                HeadingText.SPACING_TYPE
                                                  .EXTRA_LARGE,
                                              ]}
                                            >
                                              {datum.id}
                                            </HeadingText>
                                          </GridItem>
                                          <GridItem
                                            columnSpan={2}
                                            style={{ padding: "15px" }}
                                          >
                                            <HeadingText
                                              type={[
                                                HeadingText.TYPE.HEADING_3,
                                              ]}
                                              spacingType={[
                                                HeadingText.SPACING_TYPE
                                                  .EXTRA_LARGE,
                                              ]}
                                            >
                                              {datum.eventTypes.join(", ")}
                                            </HeadingText>
                                          </GridItem>
                                          <GridItem
                                            columnSpan={6}
                                            style={{
                                              height: "200px",
                                              padding: "15px",
                                              marginRight: "20px",
                                            }}
                                          >
                                            <AreaChart
                                              accountIds={[datum.id]}
                                              query={`SELECT count(*) FROM Metric SINCE 6 months AGO TIMESERIES AUTO FACET newrelic.source`}
                                              fullHeight
                                              fullWidth
                                            />
                                          </GridItem>
                                        </Grid>
                                      );
                                    })}
                                  </>
                                </GridItem>
                              </Grid>
                            );
                          } else {
                            return (
                              <Grid>
                                <GridItem columnStart={2} columnEnd={12}>
                                  No data! Check the query.
                                </GridItem>
                              </Grid>
                            );
                          }
                        }
                      }}
                    </MetricNRQL>
                  );
                } else {
                  return (
                    <Grid>
                      <GridItem columnStart={2} columnEnd={12}>
                        No data! Check the query.
                      </GridItem>
                    </Grid>
                  );
                }
              }
            }}
          </AccountsNRQL>
        );
      }}
    </AccountsQuery>
  );
};
export default GhostNerdlet;