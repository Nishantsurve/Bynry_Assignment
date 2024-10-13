import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";

import { type BaseRecord, useMany } from "@refinedev/core";
import { Input, Space, Table,Button,Image,message } from "antd";
import { useState, useEffect } from "react";


const { Search } = Input;

export const BlogPostList = () => {

  const { tableProps } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 10, // Limit the number of posts to 10
      current: 1, // Current page number
    },
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "categories",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.category?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  

  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState(tableProps?.dataSource);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const filtered = tableProps?.dataSource?.filter((item) => {
        const category = categoryData?.data?.find((cat) => cat.id === item?.category?.id);
        const categoryName = category?.title || "";
        return (
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.content?.toLowerCase().includes(value.toLowerCase()) ||
            categoryName.toLowerCase().includes(value.toLowerCase())
        );
    });

    setFilteredData(filtered);
};

useEffect(() => {
  setFilteredData(tableProps?.dataSource); // Reset data when table data changes
}, [tableProps?.dataSource]);


const generateMapLink = (locationName: string) => {
  if (locationName) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
  }
  return null; // Return a default value if location name is missing
};

const handleMapClick = (locationName: string) => {
  const mapLink = generateMapLink(locationName);
  if (mapLink) {
    window.open(mapLink, "_blank");
  } else {
    message.warning("Location is missing. Unable to open the map.");
  }
};


  return (
    <List>

               <Search
                placeholder="Search by title, content, or category"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
                style={{ marginBottom: "20px" }}
            />
  

      <Table dataSource={filteredData} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        
        <Table.Column
          dataIndex={"image"} // Assuming the image field is called 'image'
          title={"Image"}
          render={(imageUrl) => (
            <Image
              width={50} // Set a width for the image
              src={imageUrl || "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png"} // Placeholder for missing images
              alt="Person"
            />
          )}
        />
        
        <Table.Column dataIndex="title" title={"Name"} />
        <Table.Column

          dataIndex="content"
          title={"Description"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        />




<Table.Column
          dataIndex={"category"}
          title={"Summary"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  const categoryTitle = categoryData?.data?.find((item) => item.id === value?.id)?.title || null;
                  handleMapClick(categoryTitle); // Handle the click
                }}
              >
                View on Map
              </Button>
            )
          }
        />
        <Table.Column dataIndex="status" title={"Age"} />
       
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
