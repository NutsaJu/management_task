"use client";

import Responsive from "@/assets/config/Responsive";
import Colors from "@/assets/config/styles/Colors";
import { FilterFieldsType } from "@/types/types";
import { Button, Drawer, Flex, Input, Popconfirm, Select, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import api from "@/store/services/index";
import { useDebounce } from "use-debounce";
import { ClearOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CreateUpdateMember from "./CreateUpdateMember";

export default () => {
  //
  const [editedMemberId, setEditedMemberId] = useState<number | null>(null);
  //
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //
  const [openedMemberDrawer, setOpenedMemberDrawer] = useState(false);
  //
  const [filterFields, setFilterFields] =
    useState<Partial<FilterFieldsType> | null>();
  //
  const _setFilterFields = (field: keyof FilterFieldsType, value: any) => {
    setFilterFields({
      ...filterFields,
      [field]: value,
    });
  };
  //
  const { data: existingMember, isLoading: isExistingMemberLoading } =
    api.useGetMemberByIdQuery(editedMemberId as number, {
      skip: editedMemberId ? false : true,
      refetchOnMountOrArgChange: true,
    });
  //
  const [debouncedMemberFirstName] = useDebounce(filterFields?.firstname, 1000);
  //
  const [debouncedMemberLastName] = useDebounce(filterFields?.lastname, 1000);
  //
  const query = `${
    debouncedMemberFirstName !== undefined && debouncedMemberFirstName !== ""
      ? `firstname=${debouncedMemberFirstName}&`
      : ``
  }${
    debouncedMemberLastName !== undefined && debouncedMemberLastName !== ""
      ? `lastname=${debouncedMemberLastName}&`
      : ``
  }${
    filterFields?.gender !== undefined ? `gender=${filterFields.gender}` : ``
  }`;
  //
  //
  const {
    data: MembersList,
    isLoading: isMembersListLoading,
    refetch: memberListRefetch,
  } = api.useGetAllMembersQuery({
    query: query,
  });
  //
  const [deleteMember, { isLoading: isDeleteMemberLoading }] =
    api.useDeleteMemberMutation();
  //
  //
  const columns = [
    {
      title: "სახელი",
      dataIndex: "firstname",
    },
    {
      title: "გვარი",
      dataIndex: "lastname",
    },
    {
      title: "სქესი",
      dataIndex: "gender",
    },
    {
      title: "დაბადების თარიღი",
      dataIndex: "birthday",
    },
    {
      title: "ხელფასი",
      dataIndex: "salary",
    },
    {
      title: "დამატების თარიღი",
      dataIndex: "createdAt",
    },
  ];
  //
  const genderOptions = [
    {
      title: "კაცი",
      slug: "male",
    },
    {
      title: "ქალი",
      slug: "female",
    },
  ];
  //
  const _deleteMemberById = async (id: number) => {
    if (
      selectedRowKeys &&
      selectedRowKeys.length === 1 &&
      id &&
      MembersList &&
      MembersList.find((x) => x.id === selectedRowKeys[0])
    ) {
      try {
        await deleteMember(id).unwrap();
        //
        memberListRefetch();
        //
        toast.success(`თანამშრომელი წარმატებით წაიშალა`);
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
  const _closeCreateMemberDrawer = () => {
    setOpenedMemberDrawer(false);
    setEditedMemberId(null);
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
  //
  const MainLoading =
    isDeleteMemberLoading || isMembersListLoading || isExistingMemberLoading;

  return (
    <Wrapper>
      <TitleDiv>
        <Title
          style={{
            margin: 0,
          }}
          level={4}
        >
          თანამშრომლები
        </Title>

        <Flex gap={10}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              padding: '10px',
            }}
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setOpenedMemberDrawer(true)}
            title="ახალი თანამშრომელი"

          />
          {selectedRowKeys &&
            selectedRowKeys.length === 1 &&
            MembersList &&
            MembersList.find((x) => x.id === selectedRowKeys[0]) && (
              <Popconfirm
                title="ნამდვილად გსურთ წაშლა?"
                onConfirm={() =>
                  _deleteMemberById(selectedRowKeys[0] as number)
                }
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
                    padding: '10px',
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
              placeholder={`სახელი`}
              style={{
                width: "100%",
                minWidth: "200px",
              }}
              value={filterFields?.firstname || ""}
              onChange={(e) => _setFilterFields("firstname", e.target.value)}
            />

            <Input
              size="large"
              placeholder={`გვარი`}
              style={{
                width: "100%",
                minWidth: "200px",
              }}
              value={filterFields?.lastname || ""}
              onChange={(e) => _setFilterFields("lastname", e.target.value)}
            />

            <Select
              size="large"
              style={{ width: "100%", minWidth: "200px" }}
              placeholder={`სქესი`}
              onChange={(value: string) => _setFilterFields("gender", value)}
              value={filterFields?.gender}
              options={[
                ...genderOptions.map((item) => ({
                  value: item.slug,
                  label: item.title,
                })),
              ]}
            />
          </CustomInputs>

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
          loading={MainLoading}
          onRow={(record) => {
            return {
              onClick: () => {
                //
                const _memberId = record.key;
                // opend edited drawer menu
                if (_memberId) {
                  return [
                    setEditedMemberId(_memberId),
                    setOpenedMemberDrawer(true),
                  ];
                }
              },
            };
          }}
          rowSelection={rowSelection}
          pagination={false}
          dataSource={
            MembersList && MembersList?.length >= 1
              ? [
                  ...MembersList?.map((member) => ({
                    key: member.id,
                    firstname: member.firstname,
                    lastname: member.lastname,
                    gender: member.gender === "female" ? "ქალი" : "კაცი",
                    birthday: dayjs(member.birthday).format("DD / MM / YYYY"),
                    createdAt: dayjs(member.createdAt).format("DD / MM / YYYY"),
                    salary: member.salary,
                  })),
                ]
              : []
          }
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
        title={`თანამშრომლის ინფორმაცია`}
        onClose={_closeCreateMemberDrawer}
        open={openedMemberDrawer}
      >
        <CreateUpdateMember
          memberId={editedMemberId ? editedMemberId : undefined}
          memberRefetch={memberListRefetch}
          closeDrawer={_closeCreateMemberDrawer}
          editedMemberData={editedMemberId ? existingMember : undefined}
        />
      </Drawer>
    </Wrapper>
  );
};

//
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
