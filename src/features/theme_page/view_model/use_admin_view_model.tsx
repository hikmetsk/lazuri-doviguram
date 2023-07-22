import { useBaseViewModelContext } from "./context_providers/base_view_model";
import { AdminViewModel } from "../model/admin_view_model";
import { useState } from "react";
import { StatusResponse } from "@/core/models/repositories/status_response";
import { Activity, LessonMap } from "@/core/models/entities/learning_unit";
import { useRouter } from "next/navigation";

export function useAdminViewModel(): AdminViewModel {
  const {
    themeId,
    activeLesson,
    lessons,
    setThemeTitle,
    setThemeExplanation,
    setThemeYoutubeVideoUrl,
    setLessons,
    setActiveLesson,
    setThemeImage,
  } = useBaseViewModelContext()!;
  const { replace } = useRouter();
  const [stalling, setStalling] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    severity: "error" | "success" | "warning" | "info";
    message: string;
    visible: boolean;
  }>({ severity: "info", message: "", visible: false });

  const saveTheme = async ({
    title,
    explanation,
    image,
    youtubeVideoUrl,
  }: {
    title: string;
    explanation: string;
    image: string;
    youtubeVideoUrl: string;
  }) => {
    setStalling(true);
    const resObj = await fetch(`/api/admin/temalar/${themeId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: "saveTheme",
        title,
        explanation,
        image,
        youtubeVideoUrl,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setThemeTitle(title);
    setThemeExplanation(explanation);
    setThemeImage(image);
    setThemeYoutubeVideoUrl(youtubeVideoUrl);
  };

  const deleteTheme = async () => {
    setStalling(true);
    const resObj = await fetch(`/api/admin/temalar/${themeId}`, {
      method: "DELETE",
    });
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    replace("/admin");
  };

  const saveLesson = async ({
    title,
    explanation,
  }: {
    title: string;
    explanation: string;
  }) => {
    if (activeLesson === null) return;
    setStalling(true);
    const lessonId = lessons.meta[activeLesson].id;
    const resObj = await fetch(`/api/admin/temalar/${themeId}/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: "saveLesson",
        themeId,
        lessonId,
        lessonIndex: activeLesson,
        title,
        explanation,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setLessons((prev) => {
      const newLessons = { ...prev };
      const newLessonMeta = newLessons.meta[activeLesson];
      newLessonMeta.title = title;
      newLessons[newLessonMeta.id].explanation = explanation;
      return newLessons;
    });
  };

  const createNewLesson = async () => {
    setStalling(true);
    const resObj = await fetch(`/api/admin/temalar/${themeId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: "createLesson",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as Omit<StatusResponse, "data"> & {
      data: { lessons: LessonMap };
    };
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setLessons((prev) => ({ ...prev, ...res.data.lessons }));
    if (activeLesson === null) {
      setActiveLesson(0);
    }
  };

  const deleteLesson = async () => {
    if (activeLesson === null) return;
    setStalling(true);
    const lessonId = lessons.meta[activeLesson].id;
    const resObj = await fetch(`/api/admin/temalar/${themeId}/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: "deleteLesson",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setLessons((prevLessons) => {
      const newLessons = { ...prevLessons };
      delete newLessons[lessonId];
      newLessons.meta = newLessons.meta.filter(
        (lessonMeta) => lessonMeta.id !== lessonId
      );
      return newLessons;
    });
    setActiveLesson((prev) => {
      if (lessons.meta.length === 0) return null;
      if (prev === null) return null;
      if (prev > 0) return prev - 1;
      return 0;
    });
  };

  const createNewActivity = async () => {
    if (activeLesson === null) return;
    setStalling(true);
    const lessonId = lessons.meta[activeLesson].id;
    const resObj = await fetch(`/api/admin/temalar/${themeId}/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify({
        type: "createNewActivity",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as Omit<StatusResponse, "data"> & {
      data: { meta: string; activity: Activity<any> };
    };
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setLessons((prev) => {
      const newLessons = { ...prev };
      let newActivities = { ...prev[lessonId].activities };
      newActivities.idOrderMeta = [...newActivities.idOrderMeta, res.data.meta];
      newActivities = {
        ...newActivities,
        [res.data.meta]: res.data.activity,
      };
      newLessons[lessonId].activities = newActivities;

      return newLessons;
    });
  };

  const deleteActivity = async ({
    activityIndex,
    activityId,
  }: {
    activityIndex: number;
    activityId: string;
  }) => {
    if (activeLesson === null) return;
    setStalling(true);
    const lessonId = lessons.meta[activeLesson].id;
    const resObj = await fetch(
      `/api/admin/temalar/${themeId}/${lessonId}/${activityId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          type: "deleteActivity",
          activityIndex,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
    setLessons((prev) => {
      const newLessons = { ...prev };
      const newActivities = newLessons[lessonId].activities;
      newActivities.idOrderMeta = newActivities.idOrderMeta.filter(
        (id, i) => id !== activityId
      );
      delete newActivities[activityId];
      return newLessons;
    });
  };

  const publishChanges = async () => {
    setStalling(true);
    const resObj = await fetch(`/api/admin/temalar/${themeId}`, {
      method: "POST",
      body: JSON.stringify({ type: "publishChanges" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = (await resObj.json()) as StatusResponse;
    setStalling(false);

    if (res.status === "error") {
      setSnackbar({
        severity: res.status,
        message: res.message,
        visible: true,
      });
      return;
    }

    setSnackbar({
      severity: res.status,
      message: res.message,
      visible: true,
    });
  };

  return {
    stalling,
    snackbar,
    setSnackbar,
    // activity actions
    createNewActivity,
    deleteActivity,
    // lesson actions
    createNewLesson,
    saveLesson,
    deleteLesson,
    // theme actions
    saveTheme,
    deleteTheme,
    publishChanges,
  };
}
