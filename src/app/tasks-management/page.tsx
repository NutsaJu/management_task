"use client";

import Responsive from "@/assets/config/Responsive";
import Colors from "@/assets/config/styles/Colors";
import { TasksFilterFieldsType } from "@/types/types";
import {
  Button,
  Checkbox,
  Drawer,
  Flex,
  Input,
  Popconfirm,
  Select,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import api from "@/store/services/index";
import { ClearOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CreateUpdateTask from "./CreateUpdateTask";
import { useDebounce } from "use-debounce";

export default function Page () {
  //
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  //
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //
  const [openedTaskDrawer, setOpenedTaskDrawer] = useState(false);
  //
  const [filterFields, setFilterFields] =
    useState<Partial<TasksFilterFieldsType> | null>();
  //
  const _setFilterFields = (field: keyof TasksFilterFieldsType, value: any) => {
    setFilterFields({
      ...filterFields,
      [field]: value,
    });
  };
  //
  const { data: existingTask, isLoading: isExistingTaskLoading } =
    api.useGetTaskByIdQuery(editedTaskId as number, {
      skip: editedTaskId ? false : true,
      refetchOnMountOrArgChange: true,
    });
  //
  const [debouncedTaskTitle] = useDebounce(filterFields?.title, 1000);
  //
  const { data: MembersList, isLoading: isMembersListLoading } =
    api.useGetAllMembersQuery({
      query: "",
    });
  //
  //
  const {
    data: TasksList,
    isLoading: isTasksListLoading,
    refetch: tasksListRefetch,
  } = api.useGetAllTasksQuery({
    query: "",
  });
  //
  const [deleteTask, { isLoading: isDeleteTaskLoading }] =
    api.useDeleteTaskMutation();
  //
  //
  const columns = [
    {
      title: "სათაური",
      dataIndex: "title",
    },
    {
      title: "აღწერა",
      dataIndex: "description",
    },
    {
      title: "შესრულების თარიღი",
      dataIndex: "completion_date",
    },
    {
      title: "შემსრულებელი პირი",
      dataIndex: "assigned_member",
    },
    {
      title: "სტატუსი",
      dataIndex: "status",
    },
    {
      title: "შექმნის თარიღი",
      dataIndex: "createdAt",
    },
  ];
  //
  const statusOptions = [
    {
      title: "მიმდინარე",
      slug: "ongoing",
    },
    {
      title: "დასრულებული",
      slug: "completed",
    },
  ];
  //
  const _deleteTaskById = async (id: number) => {
    if (
      selectedRowKeys &&
      selectedRowKeys.length === 1 &&
      id &&
      TasksList &&
      TasksList.find((x) => x.id === selectedRowKeys[0])
    ) {
      try {
        await deleteTask(id).unwrap();
        //
        tasksListRefetch();
        //
        toast.success(`დავალება წარმატებით წაიშალა`);
        //
      } catch (error) {
        if (error) {
          console.log(error);
        } else {
          toast.error(`მოხდა შეცდომა, სცადეთ მოგვიანებით!`);
        }
      }
    }
  };
  //
  const _closeCreateTaskDrawer = () => {
    setOpenedTaskDrawer(false);
    setEditedTaskId(null);
  };
  //
  //
  //
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 
  const isTaskExpired = (completeionDate : string) => {
    return dayjs(completeionDate).isBefore(dayjs().startOf("day").add(1, "day"));
  };
  //
  const filterTasks = () => {
    if (!TasksList) return [];

    return TasksList.filter((task) => {
      const titleMatch = debouncedTaskTitle
        ? task.title.includes(debouncedTaskTitle)
        : true;
      const memberMatch =
      filterFields?.assignedMembers?.length
        ? task._assigned_member && filterFields.assignedMembers.includes(task._assigned_member.id)
        : true;
      const statusMatch = filterFields?.status?.length
        ? filterFields.status.includes(task.status)
        : true;
      const expiredMatch = filterFields?.expiredTask
        ? dayjs(task.completion_date).isBefore(
            dayjs().startOf("day").add(1, "day")
          )
        : true;
      return titleMatch && memberMatch && statusMatch && expiredMatch;
    });
  };
  //
  const MainLoading =
    isDeleteTaskLoading || isTasksListLoading || isExistingTaskLoading;

  return (
    <Wrapper>
      <TitleDiv>
        <Title
          style={{
            margin: 0,
          }}
          level={4}
        >
          დავალებები
        </Title>

        <Flex gap={10}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setOpenedTaskDrawer(true)}
            title="ახალი დავალება"
          />
          {selectedRowKeys &&
            selectedRowKeys.length === 1 &&
            TasksList &&
            TasksList.find((x) => x.id === selectedRowKeys[0]) && (
              <Popconfirm
                title="ნამდვილად გსურთ წაშლა?"
                onConfirm={() => _deleteTaskById(selectedRowKeys[0] as number)}
                onCancel={() => {}}
                okText="დიახ"
                cancelText="არა"
              >
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: Colors.primaryRed,
                    borderColor: Colors.primaryRed,
                    padding: "10px",
                    // marginLeft: "20px",
                  }}
                  size="large"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
        </Flex>
      </TitleDiv>

      <br />

      <div>
        <SeperateDiv>
          <CustomInputs>
            <Input
              size="large"
              placeholder={`სათაური`}
              style={{
                width: "100%",
                minWidth: "200px",
              }}
              value={filterFields?.title || ""}
              onChange={(e) => _setFilterFields("title", e.target.value)}
            />

            <Select
              loading={isMembersListLoading}
              mode="multiple"
              size="large"
              style={{ width: "100%", minWidth: "200px" }}
              placeholder={`შემსრულებელი თანამშრომელი`}
              value={filterFields?.assignedMembers?.map((x) => x)}
              onChange={(value: number[]) => {
                _setFilterFields(
                  "assignedMembers",
                  value?.map((id: number) => id)
                );
              }}
              options={[
                ...(MembersList || []).map((member) => ({
                  label: `${member.firstname} ${member.lastname}`,
                  value: member?.id,
                })),
              ]}
              filterOption={(input, option) => {
                if (!option) return false;
                return (option.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            />
          </CustomInputs>

          <CheckboxesFlex>
            <Checkbox.Group
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
              options={[
                ...statusOptions.map((item) => ({
                  label: item.title,
                  value: item.slug,
                })),
              ]}
              value={filterFields?.status}
              onChange={(checkedValues) =>
                _setFilterFields("status", checkedValues)
              }
            />
            <Checkbox
              checked={filterFields?.expiredTask}
              onChange={(e) => {
                _setFilterFields("expiredTask", e.target.checked);
              }}
            >
              {"ვადაგადაცილებული დავალება"}
            </Checkbox>
          </CheckboxesFlex>

          <FilterButtons
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "40px",
              }}
              type="dashed"
              danger
              size="large"
              icon={<ClearOutlined />}
              onClick={() => [setFilterFields({})]}
            >
              {`გასუფთავება`}
            </Button>
          </FilterButtons>
        </SeperateDiv>
      </div>

      <MembersListDiv>
        <Table
          rowClassName={(record) => (record.isExpired ? "red-row" : "")}
          loading={MainLoading}
          onRow={(record) => {
            return {
              onClick: () => {
                //

                const _taskId = record.key;
                // opend edited drawer menu
                if (_taskId) {
                  return [setEditedTaskId(_taskId), setOpenedTaskDrawer(true)];
                }
              },
            };
          }}
          rowSelection={rowSelection}
          pagination={false}
          dataSource={filterTasks()?.map((task) => ({
            key: task.id,
            title: task.title,
            description: task.description,
            completion_date:
              task?.completion_date !== null
                ? dayjs(task.completion_date).format("DD / MM / YYYY")
                : "",
            assigned_member: task?._assigned_member
              ? `${task?._assigned_member?.firstname} ${task?._assigned_member?.lastname}`
              : "",
            status:
              task.status === "ongoing"
                ? "მიმდინარე"
                : task.status === "completed"
                ? "დასრულებული"
                : "",
            createdAt: dayjs(task.createdAt).format("DD / MM / YYYY"),
            isExpired: isTaskExpired(task.completion_date),
          }))}
          columns={[
            ...columns.map((item) => ({
              title: item.title,
              dataIndex: item.dataIndex,
            })),
          ]}
        />
      </MembersListDiv>

      <Drawer
        width={500}
        title={`დავალების ინფორმაცია`}
        onClose={_closeCreateTaskDrawer}
        open={openedTaskDrawer}
      >
        <CreateUpdateTask
          taskId={editedTaskId ? editedTaskId : undefined}
          taskRefetch={tasksListRefetch}
          closeDrawer={_closeCreateTaskDrawer}
          editedTaskData={editedTaskId ? existingTask : undefined}
        />
      </Drawer>
    </Wrapper>
  );
};

//

const CheckboxesFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Responsive.mobile} {
    flex-direction: column;
  }
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 450px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const MembersListDiv = styled.div`
  margin-top: 40px;
  overflow-x: scroll;
  width: 100%;
  white-space: wrap;

  .ant-table-row {
    cursor: pointer;
  }
  background-color: white;
`;
const Wrapper = styled.div``;
const SeperateDiv = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CustomInputs = styled.div`
  display: flex;
  gap: 10px;

  ${Responsive.tablet} {
    width: 100%;
    flex-direction: column;
  }

  ${Responsive.mobile} {
    width: 100%;
    flex-direction: column;
  }
`;
