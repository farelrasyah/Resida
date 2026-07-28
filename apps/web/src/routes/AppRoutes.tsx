import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';

// Resident Pages
import { ResidentListPage } from '../pages/residents/ResidentListPage';
import { ResidentDetailPage } from '../pages/residents/ResidentDetailPage';
import { ResidentFormPage } from '../pages/residents/ResidentFormPage';

// House Pages
import { HouseListPage } from '../pages/houses/HouseListPage';
import { HouseDetailPage } from '../pages/houses/HouseDetailPage';

// Dues Pages
import { DuesTypeSettingPage } from '../pages/dues/DuesTypeSettingPage';

// Payment Pages
import { PaymentListPage } from '../pages/payments/PaymentListPage';
import { PaymentFormPage } from '../pages/payments/PaymentFormPage';
import { PaymentDetailPage } from '../pages/payments/PaymentDetailPage';

// Expense Pages
import { ExpenseListPage } from '../pages/expenses/ExpenseListPage';

// Report Pages
import { AnnualReportPage } from '../pages/reports/AnnualReportPage';
import { MonthlyReportPage } from '../pages/reports/MonthlyReportPage';

export const AppRoutes: React.FC = () => {
  return (
    <ToastProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes inside AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Master Data: Residents */}
          <Route path="/residents" element={<ResidentListPage />} />
          <Route path="/residents/new" element={<ResidentFormPage />} />
          <Route path="/residents/:id" element={<ResidentDetailPage />} />
          <Route path="/residents/:id/edit" element={<ResidentFormPage />} />

          {/* Master Data: Houses */}
          <Route path="/houses" element={<HouseListPage />} />
          <Route path="/houses/:id" element={<HouseDetailPage />} />

          {/* Master Data: Dues Types */}
          <Route path="/dues-types" element={<DuesTypeSettingPage />} />

          {/* Transactions: Payments */}
          <Route path="/payments" element={<PaymentListPage />} />
          <Route path="/payments/new" element={<PaymentFormPage />} />
          <Route path="/payments/:id" element={<PaymentDetailPage />} />

          {/* Transactions: Expenses */}
          <Route path="/expenses" element={<ExpenseListPage />} />

          {/* Reports */}
          <Route path="/reports/summary" element={<AnnualReportPage />} />
          <Route path="/reports/monthly" element={<MonthlyReportPage />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
};

export default AppRoutes;
