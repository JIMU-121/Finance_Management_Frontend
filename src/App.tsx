import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import Profile from "./pages/UserProfiles";
import ManageUser from "./pages/ManageUser";
import ManagePartners from "./pages/Manage-Partner/ManagePartners";
import ManageEmployees from "./pages/ManageEmployees";
import ManageDocumentType from "./pages/ManageDocumentType";
import ManageAsset from "./pages/Manage-Asset";
import ManageExpense from "./pages/Manage-Expense";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageProject from "./pages/Manage-Project";
import ManageRevenue from "./pages/Manage-Revenue";
import ManageCategory from "./pages/Manage-Category";
import { ProtectedRoute, GuestRoute } from "./components/auth/RouteGuards";
import AddPartner from "./pages/Manage-Partner/AddPartner";
import AddEmployee from "./pages/AddEmployee";
import AddExpense from "./pages/Manage-Expense/AddExpense";
import AddCategory from "./pages/Manage-Category/AddCategory";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

          {/* ── Protected: must be logged in with a valid token ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

              {/* Others Page */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/manage-partner" element={<ManagePartners />} />
              <Route path="/manage-partner/register" element={<AddPartner />} />
              <Route path="/manage-user" element={<ManageUser />} />
              <Route path="/manage-employees" element={<ManageEmployees />} />
              <Route path="/manage-employees/add" element={<AddEmployee />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/document-type" element={<ManageDocumentType />} />
              <Route path="/manage-asset" element={<ManageAsset />} />
              <Route path="/manage-expense" element={<ManageExpense />} />
              <Route path="/manage-expense/add" element={<AddExpense />} />
              <Route path="/manage-category" element={<ManageCategory />} />
              <Route path="/manage-category/add" element={<AddCategory />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/manage-project" element={<ManageProject />} />
              <Route path="/manage-revenue" element={<ManageRevenue />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* ── Guest: redirect to "/" if already logged in ── */}
          <Route element={<GuestRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>

      {/* React Toastify */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}
