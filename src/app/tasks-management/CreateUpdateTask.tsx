"use client";

import api from "@/store/services";
import { Task } from "@/types/types";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import dayjs from "dayjs";

export const CreateUpdateTask: React.FC<{
  taskRefetch: () => void;
  closeDrawer: () => void;
  taskId?: number;
  editedTaskData?: Partial<Task>;
}> = ({ taskRefetch, closeDrawer, taskId, editedTaskData }) => {
  //
  const [taskState, setTaskState] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "",
    assigned_member_id: null,
    completion_date: "",
    _assigned_member: undefined,
  });
  //
  const isEdited = editedTaskData && taskId;
  //
  const setTaskFields = (field: keyof Task, value: any) => {
    setTaskState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //
  const { data: MembersList, isLoading: isMembersListLoading } =
    api.useGetAllMembersQuery({
      query: "",
    });
  //
  const [updateTask, { isLoading: isUpdateTaskLoading }] =
    api.useUpdateTaskMutation();
  //
  const [createTask, { isLoading: isCreateTaskLoading }] =
    api.useCreateTaskMutation();
  //
  const _updateTask = async () => {
    try {
      await updateTask(taskState).unwrap();
      toast.success(`დავალება წარმატებით განახლდა`);
      closeDrawer();
      taskRefetch();
    } catch (error) {
      console.log(error);
      toast.error(`მოხდა შეცდომა, სცადეთ მოგვიანებით!`);
    }
  };
  //
  const _createTask = async () => {
    try {
      await createTask(taskState).unwrap();
      toast.success(`დავალება წარმატებით დაემატა`);
      closeDrawer();
      taskRefetch();
    } catch (error) {
      console.log(error);
      toast.error(`მოხდა შეცდომა, სცადეთ მოგვიანებით!`);
    }
  };
  //
  useEffect(() => {
    if (editedTaskData && taskId) {
      setTaskState(editedTaskData);
    } else {
      setTaskState({
        title: "",
        description: "",
        status: "",
        assigned_member_id: null,
        completion_date: "",
      });
    }
  }, [editedTaskData, taskId]);
  //
  const MainLoading =
    isCreateTaskLoading || isUpdateTaskLoading || isMembersListLoading;
  //
  return MainLoading ? (
    <Loading />
  ) : (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Text>სათაური</Typography.Text>
        <Input
          size="large"
          placeholder="სათაური"
          value={taskState?.title || ""}
          onChange={(e) => setTaskFields("title", e.target.value)}
        />
      </div>

      <div>
        <Typography.Text>აღწერა</Typography.Text>
        <Input
          size="large"
          placeholder="აღწერა"
          value={taskState?.description || ""}
          onChange={(e) => setTaskFields("description", e.target.value)}
        />
      </div>

      <div>
        <Typography.Text>შემსრულებელი პირი</Typography.Text>

        <Select
          size="large"
          style={{ width: "100%", minWidth: "200px" }}
          placeholder={`შემსრულებელი პირი`}
          onChange={(value: number) =>
            setTaskFields("assigned_member_id", value)
          }
          value={taskState?.assigned_member_id || taskState?._assigned_member?.id}
          options={
            MembersList
              ? [
                  ...MembersList?.map((member) => ({
                    value: member.id,
                    label: `${member.firstname} ${member.lastname}`,
                  })),
                ]
              : []
          }
        />
      </div>

      <div>
        <Typography.Text>შესრულების თარიღი</Typography.Text>
        <DatePicker
          size="large"
          placeholder="შესრულების თარიღი"
          style={{ width: "100%" }}
          value={
            taskState?.completion_date
              ? dayjs(taskState?.completion_date)
              : null
          }
          onChange={(date) => {
            const dateString = date ? dayjs(date).format("YYYY-MM-DD") : "";
            setTaskFields("completion_date", dateString);
          }}
        />
      </div>

      <Radio.Group
        onChange={(e: RadioChangeEvent) =>
          setTaskFields("status", e.target.value)
        }
        value={taskState?.status}
      >
        <Space direction="horizontal">
          {[
            { label: "მიმდინარე", value: "ongoing" },
            { label: "დასრულებული", value: "completed" },
          ].map((item, index) => (
            <Radio value={item.value} key={index}>
              {item.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <Divider />
      <Button
        style={{ width: "100%" }}
        type="primary"
        htmlType="submit"
        size="large"
        onClick={isEdited ? _updateTask : _createTask}
        disabled={
          taskState?.title && taskState?.description && taskState?.status
            ? false
            : true
        }
      >
        {isEdited ? "განახლება" : "დამატება"}
      </Button>
    </Space>
  );
};

export default CreateUpdateTask;
