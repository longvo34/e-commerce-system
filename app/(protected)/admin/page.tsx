import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminPage() {
  return (
    <DashboardShell
      role="admin"
      title="Bảng điều khiển Quản trị viên"
      roleBadge="Quản trị viên (Chủ cửa hàng)"
    />
  );
}
