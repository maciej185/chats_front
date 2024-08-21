import { useState, useContext, useEffect } from "react";
import "../styles/admin/AdminDashboard.css";
import DashboardsNav from "./DashboardNav";
import DashboardMain from "./DashboardMain";
import { TokenContext } from "../tokenContext";
import configData from "../config.json";
import { getBackendAddress } from "../utils";

export interface ColumnInfo {
  type: string;
  html: Array<Object>;
  primary_key: Boolean;
  foreign_key: null | Array<{ column: string; table: string }>;
}

export interface TabInfo {
  name: string;
  display: Boolean;
}

async function fetchTables(
  token: string,
  tablesSetter: CallableFunction,
  tablesError: string,
  tablesErrorSetter: CallableFunction
) {
  const url = "http://" + getBackendAddress() + configData.GET_TABLES_ENDPOINT;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await res.json();
  if (res.status === 200) {
    tablesSetter(resData);
    if (tablesError) tablesErrorSetter("");
  } else {
    tablesErrorSetter(resData.detail);
  }
}

export default function AdminDashboard() {
  const [tables, setTables] = useState<{
    [table_name: string]: { [column_name: string]: ColumnInfo };
  }>({});
  const [tablesError, setTablesError] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("Add admin");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const token = useContext(TokenContext);
  const tabs = [
    { name: "Add admin", display: true },
    { name: "Change password", display: true },
    { name: "CRUD", display: false },
  ];

  useEffect(() => {
    fetchTables(token, setTables, tablesError, setTablesError);
  }, []);

  return (
    <div className="dashboard">
      <DashboardsNav
        tables={tables}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        tabs={tabs}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />
      <DashboardMain
        currentTab={currentTab}
        tableInfo={
          selectedTable
            ? { name: selectedTable, columns: tables[selectedTable] }
            : null
        }
      />
    </div>
  );
}
