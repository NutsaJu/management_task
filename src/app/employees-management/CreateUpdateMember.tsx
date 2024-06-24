"use client";

import api from "@/store/services";
import { Member } from "@/types/types";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import dayjs from "dayjs";

export const CreateUpdateMember: React.FC<{
  memberRefetch: () => void;
  closeDrawer: () => void;
  memberId?: number;
  editedMemberData?: Partial<Member>;
}> = ({ memberRefetch, closeDrawer, memberId, editedMemberData }) => {
  //
  const [memberState, setMemberState] = useState<Partial<Member>>({
    firstname: "",
    lastname: "",
    gender: "",
    birthday: "",
    salary: 0,
  });
  //
  const isEdited = editedMemberData && memberId;
  //
  const setMemberField = (field: keyof Member, value: any) => {
    setMemberState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //
  const [updateMember, { isLoading: isUpdateMemberLoading }] =
    api.useUpdateMemberMutation();
  const [createMember, { isLoading: isCreateMemberLoading }] =
    api.useCreateMemberMutation();
  //
  const _updateMember = async () => {
    try {
      await updateMember(memberState).unwrap();
      toast.success(`თანამშრომლის ინფორმაცია წარმატებით განახლდა`);
      closeDrawer();
      memberRefetch();
    } catch (error) {
      console.log(error);
      toast.error(`მოხდა შეცდომა, სცადეთ მოგვიანებით!`);
    }
  };
  //
  const _createMember = async () => {
    try {
      await createMember(memberState).unwrap();
      toast.success(`თანამშრომელი წარმატებით დაემატა`);
      closeDrawer();
      memberRefetch();
    } catch (error) {
      console.log(error);
      toast.error(`მოხდა შეცდომა, სცადეთ მოგვიანებით!`);
    }
  };
  //
  useEffect(() => {
    if (editedMemberData && memberId) {
      setMemberState(editedMemberData);
    } else {
      setMemberState({
        firstname: "",
        lastname: "",
        gender: "",
        birthday: "",
        salary: 0,
      });
    }
  }, [editedMemberData, memberId]);
  //
  const MainLoading = isCreateMemberLoading || isUpdateMemberLoading;
  //
  return MainLoading ? (
    <Loading />
  ) : (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Typography.Text>სახელი</Typography.Text>
        <Input
          size="large"
          placeholder="სახელი"
          value={memberState.firstname || ""}
          onChange={(e) => setMemberField("firstname", e.target.value)}
        />
      </div>

      <div>
        <Typography.Text>გვარი</Typography.Text>
        <Input
          size="large"
          placeholder="გვარი"
          value={memberState.lastname || ""}
          onChange={(e) => setMemberField("lastname", e.target.value)}
        />
      </div>

      <div>
        <Typography.Text>დაბადების თარიღი</Typography.Text>
        <DatePicker
          size="large"
          placeholder="დაბადების თარიღი"
          style={{ width: "100%" }}
          value={memberState.birthday ? dayjs(memberState.birthday) : null}
          onChange={(date) => {
            const dateString = date ? dayjs(date).format("YYYY-MM-DD") : "";
            setMemberField("birthday", dateString);
          }}
          disabledDate={(current) => {
            return current && current >= dayjs().startOf("day");
          }}
        />
      </div>

      <Radio.Group
        onChange={(e: RadioChangeEvent) =>
          setMemberField("gender", e.target.value)
        }
        value={memberState.gender}
      >
        <Space direction="horizontal">
          {[
            { label: "ქალი", value: "female" },
            { label: "კაცი", value: "male" },
          ].map((item, index) => (
            <Radio value={item.value} key={index}>
              {item.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <div>
        <Typography.Text>ხელფასი</Typography.Text>
        <Input
          size="large"
          placeholder="ხელფასი"
          value={memberState.salary || ""}
          onChange={(e) => setMemberField("salary", parseInt(e.target.value))}
        />
      </div>

      <Divider />
      <Button
        style={{ width: "100%" }}
        type="primary"
        htmlType="submit"
        size="large"
        onClick={isEdited ? _updateMember : _createMember}
        disabled={
          memberState.firstname &&
          memberState.lastname &&
          memberState.gender &&
          memberState.birthday
            ? false
            : true
        }
      >
        {isEdited ? "განახლება" : "დამატება"}
      </Button>
    </Space>
  );
};

export default CreateUpdateMember;
