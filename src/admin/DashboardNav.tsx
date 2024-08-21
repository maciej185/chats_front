import "../styles/admin/DashboardNav.css";
import { ColumnInfo, TabInfo } from "./AdminDashboard";

interface DashboardsNavProps {
  tables: {
    [table_name: string]: { [column_name: string]: ColumnInfo };
  };
  currentTab: string | null;
  setCurrentTab: CallableFunction;
  tabs: Array<TabInfo>;
  selectedTable: string | null;
  setSelectedTable: CallableFunction;
}

function formatTableName(tableName: string): string {
  return [""]
    .concat(tableName.split("_"))
    .reduce((prev, current) =>
      prev.concat(" ", current[0].toUpperCase() + current.substring(1))
    );
}

export default function DashboardsNav({
  tables,
  currentTab,
  setCurrentTab,
  tabs,
  selectedTable,
  setSelectedTable,
}: DashboardsNavProps) {
  const tableNames = Object.keys(tables);
  const tabNames = tabs.map((tab) => tab.name);

  const handleClickGeneralListItemGenerator = (tab: string) => {
    const handleClickGeneralListItem = () => {
      setCurrentTab(tab !== currentTab ? tab : currentTab);
      setSelectedTable(null);
    };
    return handleClickGeneralListItem;
  };
  const handleClickTableListItemGenerator = (table: string) => {
    const handleClickTableListItem = () => {
      setSelectedTable(table);
      setCurrentTab("CRUD");
    };
    return handleClickTableListItem;
  };

  return (
    <div className="dashboard_nav">
      <div className="dashboard_nav-general dashboard_nav-section">
        <div className="dashboard_nav-general-header dashboard_nav-section-header">
          General
        </div>
        <div className="dashboard_nav-general-list dashboard_nav-section-list">
          {tabs.map((tab) =>
            tab.display ? (
              <div
                onClick={handleClickGeneralListItemGenerator(tab.name)}
                key={tab.name}
                className={`dashboard_nav-general-list-item dashboard_nav-section-list-item ${
                  tab.name === currentTab
                    ? "dashboard_nav-section-list-item_active"
                    : "dashboard_nav-section-list-item_inactive"
                }`}
              >
                {tab.name}
              </div>
            ) : (
              <div key={tab.name} className="hidden"></div> // added to avoid warnings about missing keys
            )
          )}
        </div>
      </div>

      <div className="dashboard_nav-tables dashboard_nav-section">
        <div className="dashboard_nav-tables-header dashboard_nav-section-header">
          Tables
        </div>
        <div className="dashboard_nav-tables-list dashboard_nav-section-list">
          {Object.keys(tables).length > 0 ? (
            Object.keys(tables).map((table_name, ind) => (
              <div
                onClick={handleClickTableListItemGenerator(table_name)}
                key={`table-${table_name}`}
                className={`dashboard_nav-tables-list-table dashboard_nav-section-list-item ${
                  selectedTable
                    ? table_name === selectedTable
                      ? "dashboard_nav-section-list-item_active"
                      : "dashboard_nav-section-list-item_inactive"
                    : "dashboard_nav-section-list-item_inactive"
                }`}
              >
                {formatTableName(table_name)}
              </div>
            ))
          ) : (
            <div key={"table-error"}>
              Could not get info about tables in the DB.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
