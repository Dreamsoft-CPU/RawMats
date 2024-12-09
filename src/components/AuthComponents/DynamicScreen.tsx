import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { User } from "@supabase/supabase-js";
import LoadingModal from "../Loading/LoadingModal";

const AuthScreen = dynamic(() => import("@/components/Screens/AuthScreen"), {
  loading: () => <LoadingModal message="Loading..." />,
  ssr: true,
});

interface DynamicScreenProps {
  header: string;
  message: string;
  body: React.ReactNode;
  user?: User;
  isSupplierForm?: boolean;
}

const DynamicScreen: React.FC<DynamicScreenProps> = ({
  header,
  message,
  body,
  user,
  isSupplierForm = false,
}) => {
  return (
    <Suspense fallback={<LoadingModal />}>
      <AuthScreen
        header={header}
        message={message}
        body={body}
        user={user}
        isSupplierForm={isSupplierForm}
      />
    </Suspense>
  );
};

export default DynamicScreen;
