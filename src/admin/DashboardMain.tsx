import AddAdmin from "./main/general/AddAdmin";
import ChangePassword from "./main/general/ChangePassword";
import { ColumnInfo } from "./AdminDashboard";

interface DashboardMainProps {
  currentTab: string | null;
  tableInfo: {
    name: string;
    columns: { [column_name: string]: ColumnInfo };
  } | null;
}

export default function DashboardMain({
  currentTab,
  tableInfo,
}: DashboardMainProps) {
  switch (currentTab) {
    case "Add admin":
      return <div>ADD ADMIN</div>;
    case "Change password":
      return <div>CHANGE PASSWORD</div>;
    case "CRUD":
      return <div>TABLE: {tableInfo?.name}</div>;
    default:
      return <div>SELECT TAB</div>;
  }
}
