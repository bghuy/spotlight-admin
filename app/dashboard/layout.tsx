"use client";

import type React from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/user-slice";
import axiosInstance from "@/constants/axios-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Toaster } from "@/components/ui/toaster";

// Sử dụng dynamic import để tránh lỗi hydration
const MusicPlayer = dynamic(() => import("@/components/music-player").then((mod) => mod.MusicPlayer), {
  ssr: false,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { isLoading, isAuthenticated, getIdTokenClaims, user } = useAuth0();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout: auth0Logout } = useAuth0();
  const {isVisible} = useSelector((state: RootState) => state.musicPlayer);
  const fetchUser = async () => {
    try {
      const userData = await axiosInstance.get("/api/v1/auth/session-user")
      return userData.data
    } catch (error) {
      console.error("Error fetching user:", error)
      router.push("/login")
    }

  }
  // Đảm bảo chỉ render ở phía client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(()=>{
    const controller = new AbortController();
    fetchUser().then((user)=>{
      // if(user.role !== "admin"){
      //   auth0Logout({
      //     logoutParams: {
      //       returnTo: window.location.origin,
      //     },
      //   });
      // }
      dispatch(setUser(user))
    }).catch((error)=>{
      console.error("Error fetching user:", error)
      router.push("/login")
    })
    return () => {
      controller.abort(); // 🧼 cleanup: huỷ request nếu unmount
    };
  },[])

  // Lấy claims khi đã xác thực
  // useEffect(() => {
  //   async function fetchClaims() {
  //     // console.log("Checking auth state - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "user:", user);
  //     if (!isLoading && isAuthenticated) {
  //       try {
  //         const claims = await getIdTokenClaims();
  //         // console.log("Claims:", claims);
  //         if (claims) {
  //           dispatch(setUser(claims)); // Lưu claims vào Redux
  //         } else {
  //           console.error("No claims received");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching claims:", error);
  //         router.push("/login?error=failed_to_fetch_claims");
  //       }
  //     } else if (!isLoading && !isAuthenticated) {
  //       console.log("Not authenticated, redirecting to login");
  //       router.push("/login");
  //     }
  //   }

  //   fetchClaims();
  // }, [isLoading, isAuthenticated, getIdTokenClaims, user, dispatch, router]);

  if (!isClient || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }
  else {
    return (
      <div className="flex min-h-screen">
        <DashboardNav />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
              <h1 className="text-xl font-bold ml-10 md:ml-0">Music Admin</h1>
              <UserNav />
            </div>
          </header>
          <main className={`flex-1 p-6 ${isVisible ? 'mb-[96px]': '' } `}>{children}</main>
          <Toaster/>
          <MusicPlayer />
        </div>
      </div>
    );
  }

}